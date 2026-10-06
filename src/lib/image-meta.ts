/**
 * Image metadata helpers shared by server and client components.
 *
 * This module must stay free of `server-only` and of Node-only imports,
 * because the admin forms (client components) display these values.
 */

export type ImageMeta = {
  /** Public URL path, e.g. /images/ab12.jpg */
  path: string;
  /** Original filename */
  name: string;
  width: number;
  height: number;
  /** Size in bytes */
  bytes: number;
  /** Lowercase extension without the dot, e.g. "jpg" */
  ext: string;
};

/** Human-readable file size, e.g. "128 KB". */
export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  );
  const value = bytes / 1024 ** i;
  const rounded = value >= 100 || i === 0 ? Math.round(value) : value.toFixed(1);
  return `${rounded} ${units[i]}`;
}

/** Pixel dimensions, or an em dash when the file has no readable header. */
export function dimensionsLabel(image: {
  width: number;
  height: number;
}): string {
  if (!image.width || !image.height) return "—";
  return `${image.width} × ${image.height}`;
}

/** "1200 × 900 · 128 KB" - both sizes the admin asked to see. */
export function sizeSummary(image: {
  width: number;
  height: number;
  bytes: number;
}): string {
  return `${dimensionsLabel(image)} · ${formatBytes(image.bytes)}`;
}