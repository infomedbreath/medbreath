/**
 * Content store.
 *
 * The public site reads its data through this module. In production it talks to
 * Cloudflare D1 over the REST API (the filesystem is read-only there), and
 * locally it falls back to the JSON files in `src/data` so development and
 * previews keep working without any Cloudflare account.
 *
 * Every public page goes through `getProducts()` / `getNews()` /
 * `getCategories()` rather than importing the JSON directly, so an edit made
 * in the admin panel is visible on the site immediately.
 */
import "server-only";
import {
  products as seedProducts,
  categories as seedCategories,
  news as seedNews,
  type Product,
  type Category,
  type NewsItem,
} from "@/lib/data";

export type { Product, Category, NewsItem };

export type StoreKind = "d1" | "local";

/**
 * The `/query` suffix is required: the collection endpoint only accepts GET,
 * and POSTing to it answers `405 POST not supported for requested URI`.
 */
function d1Config() {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const database = process.env.CLOUDFLARE_D1_DATABASE_ID;
  if (!account || !token || !database) return null;
  return {
    account,
    token,
    database,
    api: `https://api.cloudflare.com/client/v4/accounts/${account}/d1/database/${database}/query`,
  };
}

export const storeKind: StoreKind = d1Config() ? "d1" : "local";

/* ------------------------------------------------------------------ */
/* D1 REST helpers                                                     */
/* ------------------------------------------------------------------ */

type D1Result<T> = { success: boolean; errors?: unknown[]; result?: T };

/**
 * One entry per statement in `result`, and the rows live in that entry's own
 * `results` array - `result` itself holds envelopes like `{ results, meta }`,
 * so returning it directly would yield rows of `undefined` and every read would
 * silently fall back to the bundled JSON.
 */
type D1Envelope<T> = { results?: T[] };

async function d1Query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const cfg = d1Config();
  if (!cfg) throw new Error("D1 is not configured");

  const res = await fetch(cfg.api, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
  });

  if (!res.ok) {
    throw new Error(`D1 request failed (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as D1Result<D1Envelope<T>[]>;
  if (!json.success) {
    throw new Error(`D1 query failed: ${JSON.stringify(json.errors)}`);
  }
  return (json.result ?? []).flatMap((entry) => entry?.results ?? []);
}

/** D1 stores JSON in a single TEXT column, so rows round-trip through JSON.parse. */
function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string" || !value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/* ------------------------------------------------------------------ */
/* Schema bootstrap                                                    */
/* ------------------------------------------------------------------ */

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS collections (
     key   TEXT PRIMARY KEY,
     value TEXT NOT NULL,
     updated_at TEXT
   )`,
];

/**
 * The bootstrap runs at most once per process, and failures are not cached so
 * a later request can retry.
 *
 * Reads need the table too: `readAll()` selects straight out of `collections`,
 * so on a brand-new database the first visitor would otherwise get
 * "no such table" instead of the seeded JSON fallback.
 */
let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (storeKind !== "d1") return Promise.resolve();
  if (!schemaReady) {
    schemaReady = (async () => {
      for (const statement of SCHEMA_STATEMENTS) {
        await d1Query(statement);
      }
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

/* ------------------------------------------------------------------ */
/* Reads - served from D1 when configured, JSON otherwise               */
/* ------------------------------------------------------------------ */

let cache: {
  key: string;
  at: number;
  products: Product[];
  categories: Category[];
  news: NewsItem[];
} | null = null;

/** Short TTL so admin edits appear on the site without a redeploy. */
const TTL_MS = 5_000;

async function readAll() {
  if (storeKind === "local") {
    return {
      products: seedProducts,
      categories: seedCategories,
      news: seedNews,
    };
  }

  const now = Date.now();
  if (cache && now - cache.at < TTL_MS) {
    return {
      products: cache.products,
      categories: cache.categories,
      news: cache.news,
    };
  }

  await ensureSchema();

  const rows = await d1Query<{ key: string; value: string }>(
    "SELECT key, value FROM collections",
  );
  const byKey = new Map(rows.map((r) => [r.key, r.value]));

  const products = parseJson(byKey.get("products"), seedProducts);
  const categories = parseJson(byKey.get("categories"), seedCategories);
  const news = parseJson(byKey.get("news"), seedNews);

  cache = { key: "all", at: now, products, categories, news };
  return { products, categories, news };
}

export async function getProducts(): Promise<Product[]> {
  return (await readAll()).products;
}

export async function getNews(): Promise<NewsItem[]> {
  return (await readAll()).news;
}

export async function getCategories(): Promise<Category[]> {
  return (await readAll()).categories;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.slug === slug);
}

export async function getProductsByCategory(
  slug: string,
): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.categorySlug === slug);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getNewsItem(
  slug: string,
): Promise<NewsItem | undefined> {
  return (await getNews()).find((n) => n.slug === slug);
}

export async function getNewsByCategory(
  slug: string,
): Promise<NewsItem[]> {
  return (await getNews()).filter((n) => n.categorySlug === slug);
}

export async function getProductSlugs(): Promise<string[]> {
  return (await getProducts()).map((p) => p.slug);
}

export async function getCategorySlugs(): Promise<string[]> {
  return (await getCategories()).map((c) => c.slug);
}

export async function getNewsSlugs(): Promise<string[]> {
  return (await getNews()).map((n) => n.slug);
}

/* ------------------------------------------------------------------ */
/* Writes                                                              */
/* ------------------------------------------------------------------ */

async function writeCollection(key: string, value: unknown) {
  if (storeKind === "local") {
    throw new Error(
      "Local mode is read-only. Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN and CLOUDFLARE_D1_DATABASE_ID to enable editing.",
    );
  }
  await ensureSchema();
  await d1Query(
    `INSERT INTO collections (key, value, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    [key, JSON.stringify(value), new Date().toISOString()],
  );
  cache = null;
}

/** Reads any single collection by key, used by the settings store. */
export async function readCollection<T>(key: string): Promise<T | null> {
  if (storeKind === "local") return null;
  const rows = await d1Query<{ value: string }>(
    "SELECT value FROM collections WHERE key = ?",
    [key],
  );
  const raw = rows[0]?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Writes any single collection by key. Exported for the settings store. */
export const writeCollectionValue = writeCollection;

export async function saveProducts(products: Product[]) {
  await writeCollection("products", products);
}

export async function saveNews(news: NewsItem[]) {
  await writeCollection("news", news);
}

export async function saveCategories(categories: Category[]) {
  await writeCollection("categories", categories);
}

export async function saveProduct(product: Product) {
  const all = await getProducts();
  const index = all.findIndex((p) => p.slug === product.slug);
  if (index === -1) all.unshift(product);
  else all[index] = product;
  await saveProducts(all);
}

export async function deleteProduct(slug: string) {
  const all = await getProducts();
  await saveProducts(all.filter((p) => p.slug !== slug));
}

export async function saveNewsItem(item: NewsItem) {
  const all = await getNews();
  const index = all.findIndex((n) => n.slug === item.slug);
  if (index === -1) all.unshift(item);
  else all[index] = item;
  await saveNews(all);
}

export async function deleteNewsItem(slug: string) {
  const all = await getNews();
  await saveNews(all.filter((n) => n.slug !== slug));
}

/** Recomputes the product count shown on each category tile. */
export async function syncCategoryCounts() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const counts = new Map<string, number>();
  for (const p of products) {
    counts.set(p.categorySlug, (counts.get(p.categorySlug) ?? 0) + 1);
  }
  await saveCategories(
    categories.map((c) => ({ ...c, count: counts.get(c.slug) ?? 0 })),
  );
}

/**
 * One-time copy of the bundled JSON into D1, so the admin has something to edit.
 * Safe to run again: it only writes collections that are still empty.
 */
export async function seedFromJson(): Promise<{
  products: number;
  news: number;
  categories: number;
}> {
  if (storeKind === "local") {
    throw new Error(
      "Seeding only applies in D1 mode. Set the Cloudflare environment variables first.",
    );
  }
  await ensureSchema();

  const rows = await d1Query<{ key: string }>("SELECT key FROM collections");
  const existing = new Set(rows.map((r) => r.key));

  if (!existing.has("products")) await saveProducts(seedProducts);
  if (!existing.has("news")) await saveNews(seedNews);
  if (!existing.has("categories")) await saveCategories(seedCategories);

  return {
    products: seedProducts.length,
    news: seedNews.length,
    categories: seedCategories.length,
  };
}