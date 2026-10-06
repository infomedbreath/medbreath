/**
 * Image storage.
 *
 * Uploaded and replaced images live in Cloudflare R2, addressed through its
 * S3-compatible REST API so the same code runs on localhost and on Cloudflare.
 * Locally, files are written under `public/uploads`, which behaves the same
 * way for development.
 *
 * Every image record carries its pixel dimensions and its byte size so the
 * admin can see them next to each thumbnail.
 */
import "server-only";
import { createHash, createHmac } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { ImageMeta } from "@/lib/image-meta";

export type { ImageMeta };

const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"]);
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/**
 * R2's S3-compatible API only needs a bucket name plus an API token pair.
 * The Cloudflare REST API (account id + API token) is a *separate* credential
 * set used by D1 in content-store.ts, so it must not gate image storage here.
 */
function r2Config() {
  const bucket = process.env.CLOUDFLARE_R2_BUCKET;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  if (!bucket || !accessKeyId || !secretAccessKey) return null;
  return { bucket, accessKeyId, secretAccessKey };
}

export const storageKind = r2Config() ? "r2" : "local";

/* ------------------------------------------------------------------ */
/* Dimensions                                                          */
/* ------------------------------------------------------------------ */

/** Image formats the size probe understands. */
export type ImageFormat = "png" | "jpg" | "gif" | "webp" | "bmp" | "avif";

/**
 * Identifies an image from its magic bytes.
 *
 * The extension is deliberately ignored: this site's images are actually WebP
 * files that were saved under `.png` and `.jpg` names, so trusting the filename
 * reports every one of them as 0x0.
 */
export function sniffFormat(buffer: Buffer): ImageFormat | null {
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "png";
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }
  if (buffer.length >= 6) {
    const sig = buffer.toString("ascii", 0, 6);
    if (sig === "GIF87a" || sig === "GIF89a") return "gif";
  }
  if (
    buffer.length >= 16 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }
  if (buffer.length >= 2 && buffer.toString("ascii", 0, 2) === "BM") return "bmp";
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 4, 8) === "ftyp" &&
    /^(avif|avis|mif1|heic|heix|hevc)/.test(buffer.toString("ascii", 8, 12))
  ) {
    return "avif";
  }
  return null;
}

/** MIME type for a sniffed format, used when uploading to R2. */
export function mimeFor(format: ImageFormat): string {
  switch (format) {
    case "png":
      return "image/png";
    case "jpg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "bmp":
      return "image/bmp";
    case "avif":
      return "image/avif";
  }
}

function dimensionsOfPng(buffer: Buffer) {
  // 8-byte signature, then IHDR with width/height at offsets 16 and 20.
  if (buffer.length < 24) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function dimensionsOfGif(buffer: Buffer) {
  if (buffer.length < 10) return null;
  return {
    width: buffer.readUInt16LE(6),
    height: buffer.readUInt16LE(8),
  };
}

function dimensionsOfBmp(buffer: Buffer) {
  if (buffer.length < 26) return null;
  return {
    width: Math.abs(buffer.readInt32LE(18)),
    height: Math.abs(buffer.readInt32LE(22)),
  };
}

function dimensionsOfWebp(buffer: Buffer) {
  if (buffer.length < 30) return null;
  const chunk = buffer.toString("ascii", 12, 16);

  // Lossy: 14-bit width and height after the sync code.
  if (chunk === "VP8 ") {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }
  // Lossless: 14 bits each, stored as size minus one.
  if (chunk === "VP8L") {
    const bits = buffer.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }
  // Extended: 24-bit canvas size minus one.
  if (chunk === "VP8X") {
    return {
      width: (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16)) + 1,
      height: (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16)) + 1,
    };
  }
  return null;
}

function dimensionsOfJpeg(buffer: Buffer) {
  let offset = 2;
  while (offset + 9 < buffer.length) {
    // Markers may be preceded by fill bytes, so resynchronise on 0xFF.
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    // SOF0..SOF15, minus the markers that are not frame headers.
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc
    ) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    // Standalone markers carry no length.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    const segmentLength = buffer.readUInt16BE(offset + 2);
    if (segmentLength < 2) return null;
    offset += 2 + segmentLength;
  }
  return null;
}

function dimensionsOfAvif(buffer: Buffer) {
  // The pixel size lives in an `ispe` box: 4-byte size, 'ispe', 4-byte
  // version/flags, then width and height as big-endian uint32.
  const index = buffer.indexOf("ispe", 0, "ascii");
  if (index < 0 || index + 16 > buffer.length) return null;
  return {
    width: buffer.readUInt32BE(index + 8),
    height: buffer.readUInt32BE(index + 12),
  };
}

/**
 * Reads pixel dimensions straight out of the file header.
 * Supports PNG, JPEG, GIF, WebP, BMP and AVIF - no image library required.
 *
 * The format is detected from the bytes, not the filename, because this site
 * stores WebP images under `.png` and `.jpg` names.
 */
export function readDimensions(buffer: Buffer): {
  width: number;
  height: number;
} | null {
  switch (sniffFormat(buffer)) {
    case "png":
      return dimensionsOfPng(buffer);
    case "jpg":
      return dimensionsOfJpeg(buffer);
    case "gif":
      return dimensionsOfGif(buffer);
    case "webp":
      return dimensionsOfWebp(buffer);
    case "bmp":
      return dimensionsOfBmp(buffer);
    case "avif":
      return dimensionsOfAvif(buffer);
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* R2 (S3-compatible REST)                                             */
/* ------------------------------------------------------------------ */

function r2Endpoint(): string | null {
  const bucket = process.env.CLOUDFLARE_R2_BUCKET;
  if (!bucket) return null;
  return `https://${bucket}.r2.cloudflarestorage.com`;
}

/** AWS SigV4 signing, which R2's S3 API requires. */
async function signRequest(
  method: string,
  url: string,
  payload: Buffer | null,
  extraHeaders: Record<string, string> = {},
) {
  if (!r2Config()) throw new Error("R2 is not configured");
  const accessKey = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!;
  const secretKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const target = new URL(url);
  const host = target.host;

  const payloadHash = createHash("sha256")
    .update(payload ?? Buffer.alloc(0))
    .digest("hex");

  const headers: Record<string, string> = {
    host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
    ...extraHeaders,
  };

  const signedHeaderNames = Object.keys(headers).sort();
  const canonicalHeaders = signedHeaderNames
    .map((n) => `${n}:${headers[n].trim()}\n`)
    .join("");
  const signedHeaders = signedHeaderNames.join(";");

  const canonicalRequest = [
    method,
    target.pathname,
    target.searchParams.toString(),
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const scope = `${dateStamp}/auto/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    createHash("sha256").update(canonicalRequest).digest("hex"),
  ].join("\n");

  const hmac = (key: Buffer, data: string) =>
    createHmac("sha256", key).update(data).digest();

  const signingKey = hmac(
    hmac(
      hmac(hmac(Buffer.from(`AWS4${secretKey}`, "utf8"), dateStamp), "auto"),
      "s3",
    ),
    "aws4_request",
  );
  const signature = createHmac("sha256", signingKey)
    .update(stringToSign)
    .digest("hex");

  return {
    ...headers,
    Authorization:
      `AWS4-HMAC-SHA256 Credential=${accessKey}/${scope}, ` +
      `SignedHeaders=${signedHeaders}, Signature=${signature}`,
    "Content-Type": extraHeaders["Content-Type"] ?? "application/octet-stream",
  };
}

async function r2Put(key: string, body: Buffer, contentType: string) {
  if (!r2Config()) throw new Error("R2 is not configured");
  const url = `${r2Endpoint()}/${key}`;
  const headers = await signRequest("PUT", url, body, {
    "Content-Type": contentType,
  });
  // fetch() wants a BodyInit, and Buffer is not one - wrap it.
  const res = await fetch(url, {
    method: "PUT",
    headers,
    body: new Uint8Array(body),
  });
  if (!res.ok) {
    throw new Error(`R2 upload failed (${res.status}): ${await res.text()}`);
  }
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

function extensionOf(filename: string): string {
  const ext = filename.toLowerCase().split(".").pop() ?? "";
  return ext === "jpeg" ? "jpg" : ext;
}

function sanitizeBase(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "image"
  );
}

/**
 * Stores an uploaded image and returns its metadata.
 * The returned `path` is what goes into product/news records.
 */
export async function saveUpload(
  file: { name: string; type: string; buffer: Buffer },
): Promise<ImageMeta> {
  const ext = extensionOf(file.name);
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error(
      `Unsupported image type ".${ext}". Allowed: ${[...ALLOWED_EXT].join(", ")}`,
    );
  }
  if (file.buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error(
      `Image is ${(file.buffer.length / 1024 / 1024).toFixed(1)} MB. The limit is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`,
    );
  }

  // Confirm the bytes really decode as an image. Checking the filename alone
  // would happily store an HTML document named ".png".
  const format = sniffFormat(file.buffer);
  const dims = readDimensions(file.buffer);
  if (!format || !dims) {
    throw new Error(
      `"${file.name}" is not a readable image. The file extension says .${ext} but the contents are something else.`,
    );
  }

  const base = sanitizeBase(file.name);
  const unique = createHash("sha1")
    .update(`${Date.now()}-${Math.random()}`)
    .digest("hex")
    .slice(0, 8);
  // Store the real format in the name, so the file matches its bytes.
  const key = `uploads/${base}-${unique}.${format}`;
  const publicPath = `/${key}`;

  if (storageKind === "r2") {
    await r2Put(key, file.buffer, mimeFor(format));
  } else {
    const target = path.join(process.cwd(), "public", key);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, file.buffer);
  }

  return {
    path: publicPath,
    name: file.name,
    width: dims.width,
    height: dims.height,
    bytes: file.buffer.length,
    ext: format,
  };
}

/**
 * Overwrites an existing image in place, keeping the same path so every
 * product, article or banner that references it updates automatically.
 *
 * Returns the new metadata: dimensions and file size change, the path does not.
 */
export async function replaceImage(
  publicPath: string,
  file: { name: string; type: string; buffer: Buffer },
): Promise<ImageMeta> {
  const currentExt = extensionOf(publicPath);
  if (!ALLOWED_EXT.has(currentExt)) {
    throw new Error(`"${publicPath}" is not a supported image file.`);
  }
  if (!file.buffer.length) {
    throw new Error("The uploaded file is empty.");
  }
  if (file.buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error(
      `Image is ${(file.buffer.length / 1024 / 1024).toFixed(1)} MB. The limit is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`,
    );
  }

  // Verify the bytes really decode as an image, so a renamed text file or an
  // HTML document cannot be written over one.
  const format = sniffFormat(file.buffer);
  const dims = readDimensions(file.buffer);
  if (!format || !dims) {
    throw new Error(
      `That file is not a readable image, so it cannot replace ${publicPath}.`,
    );
  }

  const key = publicPath.replace(/^\/+/, "");
  if (storageKind === "r2") {
    await r2Put(key, file.buffer, mimeFor(format));
  } else {
    const root = path.join(process.cwd(), "public");
    const absolute = path.resolve(root, key);
    // Refuse to write outside public/.
    if (absolute !== root && !absolute.startsWith(root + path.sep)) {
      throw new Error("Invalid image path.");
    }
    await fs.writeFile(absolute, file.buffer);
  }

  return {
    path: publicPath,
    name: publicPath.split("/").pop() ?? publicPath,
    width: dims.width,
    height: dims.height,
    bytes: file.buffer.length,
    ext: currentExt,
  };
}

/** Reads the byte size and dimensions of a local file under `public/`. */
export async function inspectLocalImage(
  publicPath: string,
): Promise<{ width: number; height: number; bytes: number } | null> {
  const relative = publicPath.replace(/^\/+/, "");
  const absolute = path.join(process.cwd(), "public", relative);
  // Refuse to escape the public directory.
  if (!absolute.startsWith(path.join(process.cwd(), "public"))) return null;

  try {
    const buffer = await fs.readFile(absolute);
    const dims = readDimensions(buffer);
    return {
      width: dims?.width ?? 0,
      height: dims?.height ?? 0,
      bytes: buffer.length,
    };
  } catch {
    return null;
  }
}

/** Lists images already present in `public/` (local mode / initial import). */
export async function listLocalImages(
  subdir = "",
): Promise<ImageMeta[]> {
  const dir = path.join(process.cwd(), "public", subdir);
  const out: ImageMeta[] = [];

  async function walk(current: string, prefix: string) {
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(full, `${prefix}${entry.name}/`);
        continue;
      }
      const ext = extensionOf(entry.name);
      if (!ALLOWED_EXT.has(ext)) continue;
      const info = await inspectLocalImage(`${prefix}${entry.name}`);
      if (!info) continue;
      out.push({
        path: `/${prefix}${entry.name}`,
        name: entry.name,
        width: info.width,
        height: info.height,
        bytes: info.bytes,
        ext,
      });
    }
  }

  await walk(dir, subdir ? `${subdir}/` : "");
  return out.sort((a, b) => a.path.localeCompare(b.path));
}