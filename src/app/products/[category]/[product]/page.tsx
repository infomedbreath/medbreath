import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import { rewriteContent } from "@/lib/images";
import {
  getProducts,
  getCategory,
  getProduct,
  getProductsByCategory,
} from "@/lib/content-store";
import { site } from "@/data/site";

// The catalogue is admin-editable, so this page is rendered per request.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/products/[category]/[product]">): Promise<Metadata> {
  const { product } = await params;
  const p = await getProduct(product);
  if (!p) return { title: "Product" };
  return {
    title: p.name,
    description:
      p.description || p.shortDescription.replace(/<[^>]+>/g, " ").slice(0, 150),
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[category]/[product]">) {
  const { category, product } = await params;
  const [allProducts, cat, p] = await Promise.all([
    getProducts(),
    getCategory(category),
    getProduct(product),
  ]);
  if (!p || !cat || p.categorySlug !== category) notFound();

  const related = (await getProductsByCategory(category))
    .filter((x) => x.slug !== p.slug)
    .slice(0, 4);

  const index = allProducts.findIndex((x) => x.slug === p.slug);
  const prev = index > 0 ? allProducts[index - 1] : null;
  const next = index < allProducts.length - 1 ? allProducts[index + 1] : null;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: cat.name, href: `/products/${cat.slug}` },
          { label: p.name },
        ]}
      />

      <section className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <ProductGallery images={p.images} name={p.name} />

          <div>
            <h1 className="font-heading text-2xl font-semibold text-ink md:text-3xl">
              {p.name}
            </h1>
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-brand-ink">
              {cat.name}
            </p>

            <div
              className="rich-content mt-5"
              dangerouslySetInnerHTML={{
                __html: rewriteContent(p.shortDescription),
              }}
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent(
                  p.name,
                )}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-deep transition-colors hover:bg-brand-dark"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                {site.email}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-brand-ink px-6 py-3 text-sm font-medium text-brand-ink transition-colors hover:bg-brand hover:text-brand-deep"
              >
                Message
              </Link>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-16">
          <h2 className="font-heading border-b border-line pb-4 text-xl font-semibold text-ink">
            Product Details
          </h2>
          <div
            className="rich-content mt-6 max-w-none"
            dangerouslySetInnerHTML={{ __html: rewriteContent(p.details) }}
          />
        </div>

        {/* Prev / next */}
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-line pt-6 text-sm sm:flex-row">
          {prev ? (
            <Link
              href={`/products/${prev.categorySlug}/${prev.slug}`}
              className="text-body transition-colors hover:text-brand-ink"
            >
              ← Prev: {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/products/${next.categorySlug}/${next.slug}`}
              className="text-body transition-colors hover:text-brand-ink sm:text-right"
            >
              Next: {next.name} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-soft py-20">
          <div className="container-x">
            <h2 className="font-heading mb-10 text-center text-2xl font-semibold text-ink">
              Related Products
            </h2>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {related.map((r) => (
                <ProductCard key={r.slug} product={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
