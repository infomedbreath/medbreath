/**
 * Maps each image path to the pages that reference it, so the admin knows what
 * a replacement will affect before making the change.
 */
import "server-only";
import { getProducts, getNews, getCategories } from "@/lib/content-store";

export type ImageUsage = {
  products: string[];
  news: string[];
  categories: string[];
  /** Total number of records referencing this image. */
  total: number;
};

export type ImageUsageMap = Map<string, ImageUsage>;

type Bucket = "products" | "news" | "categories";

function addTo(
  map: ImageUsageMap,
  path: string | null | undefined,
  bucket: Bucket,
  label: string,
) {
  if (!path) return;
  const entry = map.get(path) ?? {
    products: [],
    news: [],
    categories: [],
    total: 0,
  };
  // A product with the same image twice still counts as one reference.
  if (entry[bucket].includes(label)) return;
  entry[bucket].push(label);
  entry.total += 1;
  map.set(path, entry);
}

export async function buildImageUsage(): Promise<ImageUsageMap> {
  const [products, news, categories] = await Promise.all([
    getProducts(),
    getNews(),
    getCategories(),
  ]);

  const map: ImageUsageMap = new Map();

  for (const product of products) {
    addTo(map, product.thumbnail, "products", product.name);
    for (const src of product.images) {
      addTo(map, src, "products", product.name);
    }
  }

  for (const item of news) {
    addTo(map, item.image, "news", item.title);
  }

  for (const category of categories) {
    addTo(map, category.image, "categories", category.name);
  }

  return map;
}

/** Short human summary, e.g. "3 products" or "1 product, 2 articles". */
export function describeUsage(usage: ImageUsage | undefined): string {
  if (!usage || usage.total === 0) return "Not used anywhere yet";
  const parts: string[] = [];
  if (usage.products.length) {
    parts.push(`${usage.products.length} product${usage.products.length > 1 ? "s" : ""}`);
  }
  if (usage.news.length) {
    parts.push(`${usage.news.length} article${usage.news.length > 1 ? "s" : ""}`);
  }
  if (usage.categories.length) {
    parts.push(
      `${usage.categories.length} categor${usage.categories.length > 1 ? "ies" : "y"}`,
    );
  }
  return parts.join(", ");
}