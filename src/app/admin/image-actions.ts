"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./guard";
import {
  saveUpload,
  replaceImage,
  listLocalImages,
  MAX_UPLOAD_BYTES,
  type ImageMeta,
} from "@/lib/image-store";
import type { FormState } from "./data-actions";

const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "gif", "avif"];

function extOf(name: string): string {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  return ext === "jpeg" ? "jpg" : ext;
}

/**
 * Stores one uploaded image and returns its public path plus size info, which
 * the client inserts into the form's image list.
 */
export async function uploadImageAction(
  _prev: FormState & { uploaded?: ImageMeta },
  formData: FormData,
): Promise<FormState & { uploaded?: ImageMeta }> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image to upload." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      error: `That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`,
    };
  }
  if (!ALLOWED_EXT.includes(extOf(file.name))) {
    return { error: "Only JPG, PNG, WEBP, GIF or AVIF files are accepted." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await saveUpload({
      name: file.name,
      type: file.type,
      buffer,
    });
    revalidatePath("/admin/images");
    return { ok: true, uploaded };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Upload failed.",
    };
  }
}

/** Lists every image already in `public/` with its dimensions and size. */
export async function listImagesAction(): Promise<ImageMeta[]> {
  await requireAdmin();
  return listLocalImages("images");
}

/**
 * Swaps the file behind an existing image path. Because the path stays the
 * same, every product, article and banner using it picks up the new image.
 */
export async function replaceImageAction(
  _prev: FormState & { replaced?: ImageMeta },
  formData: FormData,
): Promise<FormState & { replaced?: ImageMeta }> {
  await requireAdmin();

  const target = String(formData.get("target") ?? "").trim();
  if (!target.startsWith("/")) {
    return { error: "Missing the image to replace." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a replacement image." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      error: `That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`,
    };
  }

  try {
    const replaced = await replaceImage(target, {
      name: file.name,
      type: file.type,
      buffer: Buffer.from(await file.arrayBuffer()),
    });
    // Sizes changed, so the admin listing must not be cached.
    revalidatePath("/admin/images");
    revalidatePath("/", "layout");
    return { ok: true, replaced };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Replace failed.",
    };
  }
}