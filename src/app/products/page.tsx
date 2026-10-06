import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs, { PageBanner } from "@/components/Breadcrumbs";
import { getProducts, getCategories } from "@/lib/content-store";
import { localImage } from "@/lib/images";
import type { Metadata } from "next";

// Renders per request so admin edits appear immediately.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse the full MedBreath catalog of disposable medical products and consumables.",
};

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const params = await searchParams;
  const rawQ = params.q;
  const q = (Array.isArray(rawQ) ? rawQ[0] : rawQ)?.trim().toLowerCase() ?? "";

  const [allProducts, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const filtered = q
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    : allProducts;

  const bannerImage = localImage(
    "https://img03.71360.com/w3/ogvow0/20241017/e39ad2c09c5b6e765c2caa7b6dc5270a.jpg",
  );

  return (
    <>
      <PageBanner title="Products" image={bannerImage} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} />

      <section className="container-x py-20">
        {/* Category filter */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/products"
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              !q ? "bg-brand text-brand-deep" : "bg-soft text-ink hover:bg-brand hover:text-brand-deep"
            }`}
          >
            All Products
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/products/${c.slug}`}
              className="rounded-full bg-soft px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-brand hover:text-brand-deep"
            >
              {c.name}
            </Link>
          ))}
        </div>

        {q && (
          <p className="mb-6 text-center text-sm text-body">
            {filtered.length} result{filtered.length === 1 ? "" : "s"} for{" "}
            <span className="font-semibold text-brand-ink">{q}</span>
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-body">
            <p className="text-lg">No products found.</p>
            <Link href="/products" className="mt-4 inline-block text-brand-ink">
              View all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-soft py-20">
        <div className="container-x">
          <SectionHeading
            title="Product Categories"
            subtitle="Explore our disposable medical consumables by category"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/products/${c.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-ink/20 hover:shadow-xl hover:shadow-brand-ink/5"
              >
                <span className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-soft">
                  {c.image && (
                    <img
                      src={c.image}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                </span>
                <span>
                  <span className="font-heading block text-[17px] font-semibold text-ink transition-colors group-hover:text-brand-ink">
                    {c.name}
                  </span>
                  <span className="mt-1 block text-sm text-body">
                    {c.count} products
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
