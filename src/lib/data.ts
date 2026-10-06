import productsJson from "@/data/products.json";
import categoriesJson from "@/data/categories.json";
import newsJson from "@/data/news.json";

export type Product = {
  slug: string;
  name: string;
  originalId: number | null;
  originalHref: string;
  category: string;
  categorySlug: string;
  categoryOrder: number;
  thumbnail: string;
  images: string[];
  shortDescription: string;
  details: string;
  description: string;
};

export type Category = {
  name: string;
  slug: string;
  count: number;
  image: string;
};

export type NewsItem = {
  slug: string;
  originalHref: string;
  title: string;
  summary: string;
  date: string;
  dateOnly: string;
  category: string;
  categorySlug: string;
  image: string;
  content: string;
};

export const products = productsJson as Product[];
export const categories = categoriesJson as Category[];
export const news = newsJson as NewsItem[];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.categorySlug === slug);
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductByOriginalId(id: number): Product | undefined {
  return products.find((p) => p.originalId === id);
}

export function getNews(slug: string): NewsItem | undefined {
  return news.find((n) => n.slug === slug);
}

export function getNewsByCategory(slug: string): NewsItem[] {
  return news.filter((n) => n.categorySlug === slug);
}

export function productHref(p: Product): string {
  return `/products/${p.categorySlug}/${p.slug}`;
}

export function newsHref(n: NewsItem): string {
  return `/news/${n.slug}`;
}

export const featuredProducts = products.slice(0, 8);
export const popularProducts = products.slice(8, 12);
export const latestNews = news.slice(0, 3);
