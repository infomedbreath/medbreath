import imageMapJson from "@/data/image-map.json";

const imageMap = imageMapJson as Record<string, string>;

/**
 * Resolve an original (remote) image URL to a locally downloaded asset.
 * Falls back to the original URL when no local copy exists.
 */
export function localImage(url: string | undefined | null): string {
  if (!url) return "";
  if (url.startsWith("/")) return url;
  const base = url.split("?")[0].split("#")[0];
  if (imageMap[base]) return imageMap[base];
  return url;
}

/**
 * Rewrite HTML content coming from the cloned source so that:
 *  - images point to locally downloaded files
 *  - remaining brand/domain references use MedBreath
 */
export function rewriteContent(html: string): string {
  if (!html) return "";
  let out = html;
  out = out.replace(
    /(src|data-original|data-src)="([^"]+)"/gi,
    (_m, attr: string, url: string) => `${attr}="${localImage(url)}"`,
  );
  out = out.replace(
    /url\((['"]?)([^)'"]+)\1\)/gi,
    (_m, q: string, url: string) => `url(${q}${localImage(url)}${q})`,
  );
  out = out
    .replace(/https?:\/\/zh\.hitecare\.com/gi, "/")
    .replace(/https?:\/\/(www\.)?hitecare\.com/gi, "https://www.medbreath.co")
    .replace(/hitecare\.com/gi, "medbreath.co")
    .replace(/hitecmed\.com/gi, "medbreath.co");
  return out;
}
