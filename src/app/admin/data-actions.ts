"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "./guard";
import {
  getProducts,
  getNews,
  getCategories,
  saveProduct,
  deleteProduct,
  saveNewsItem,
  deleteNewsItem,
  syncCategoryCounts,
  type Product,
  type NewsItem,
} from "@/lib/content-store";
import { slugify } from "@/lib/slugify";

export type FormState = {
  ok?: boolean;
  error?: string;
};

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function lines(formData: FormData, key: string): string[] {
  return text(formData, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Makes the public site show the new content immediately. */
function revalidatePublic() {
  revalidatePath("/", "layout");
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export async function saveProductAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const existingSlug = text(formData, "originalSlug");
  const name = text(formData, "name");

  if (!name) return { error: "Product name is required." };

  const categorySlug = text(formData, "categorySlug");
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return { error: "Please choose a category." };

  const images = lines(formData, "images");
  if (!images.length) return { error: "Add at least one product image." };

  const all = await getProducts();
  const existing = existingSlug
    ? all.find((p) => p.slug === existingSlug)
    : undefined;

  // Keep the slug stable once a product exists, so its URL never breaks.
  const slug = existing?.slug ?? slugify(text(formData, "slug") || name);

  const product: Product = {
    slug,
    name,
    originalId: existing?.originalId ?? null,
    originalHref: existing?.originalHref ?? "",
    category: category.name,
    categorySlug: category.slug,
    categoryOrder: existing?.categoryOrder ?? 0,
    thumbnail: text(formData, "thumbnail") || images[0],
    images,
    shortDescription: text(formData, "shortDescription"),
    details: text(formData, "details"),
    description: text(formData, "description"),
  };

  try {
    await saveProduct(product);
    await syncCategoryCounts();
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not save product.",
    };
  }

  revalidatePublic();
  redirect(`/admin/products?saved=${encodeURIComponent(product.name)}`);
}

export async function deleteProductAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const slug = text(formData, "originalSlug");
  if (!slug) return { error: "Missing product." };

  try {
    await deleteProduct(slug);
    await syncCategoryCounts();
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not delete product.",
    };
  }

  revalidatePublic();
  redirect("/admin/products?deleted=1");
}

/* ------------------------------------------------------------------ */
/* News                                                                */
/* ------------------------------------------------------------------ */

export async function saveNewsAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const existingSlug = text(formData, "originalSlug");
  const title = text(formData, "title");
  if (!title) return { error: "News title is required." };

  const categorySlug = text(formData, "categorySlug");
  const categoryName =
    categorySlug === "industry" ? "Industry news" : "Company news";

  const all = await getNews();
  const existing = existingSlug
    ? all.find((n) => n.slug === existingSlug)
    : undefined;

  const slug = existing?.slug ?? slugify(text(formData, "slug") || title);

  const date = text(formData, "date");
  const parsed = date ? new Date(date) : new Date();
  const valid = Number.isNaN(parsed.getTime()) ? new Date() : parsed;

  const item: NewsItem = {
    slug,
    originalHref: existing?.originalHref ?? "",
    title,
    summary: text(formData, "summary"),
    date: valid.toISOString().slice(0, 19).replace("T", " "),
    dateOnly: valid.toISOString().slice(0, 10),
    category: categoryName,
    categorySlug,
    image: text(formData, "image"),
    content: text(formData, "content"),
  };

  try {
    await saveNewsItem(item);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not save article.",
    };
  }

  revalidatePublic();
  redirect(`/admin/news?saved=${encodeURIComponent(item.title)}`);
}

export async function deleteNewsAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const slug = text(formData, "originalSlug");
  if (!slug) return { error: "Missing news item." };

  try {
    await deleteNewsItem(slug);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not delete article.",
    };
  }

  revalidatePublic();
  redirect("/admin/news?deleted=1");
}