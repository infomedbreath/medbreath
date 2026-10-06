import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs, { PageBanner } from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import {
  getCategories,
  getCategory,
  getProductsByCategory,
} from "@/lib/content-store";
import { localImage } from "@/lib/images";

// The catalogue is admin-editable, so this page is rendered per request.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/products/[category]">): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategory(category);
  if (!cat) return { title: "Products" };
  return {
    title: cat.name,
    description: `Browse ${cat.name} disposable medical products manufactured by MedBreath Medical.`,
  };
}

export default async function CategoryPage({
  params,
}: PageProps<"/products/[category]">) {
  const { category } = await params;
  const [categories, cat] = await Promise.all([
    getCategories(),
    getCategory(category),
  ]);
  if (!cat) notFound();

  const items = await getProductsByCategory(category);
  const banner = localImage(
    "https://img03.71360.com/w3/ogvow0/20241017/e39ad2c09c5b6e765c2caa7b6dc5270a.jpg",
  );

  return (
    <>
      <PageBanner title={cat.name} image={banner} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: cat.name },
        ]}
      />

      <section className="container-x py-20">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside>
            <h2 className="font-heading mb-4 rounded-xl bg-brand px-5 py-4 text-center text-lg font-medium text-brand-deep">
              Product
            </h2>
            <ul className="overflow-hidden rounded-xl border border-line">
              {categories.map((c) => (
                <li key={c.slug} className="border-b border-line last:border-0">
                  <Link
                    href={`/products/${c.slug}`}
                    className={`block px-5 py-3.5 text-[15px] transition-colors ${
                      c.slug === category
                        ? "bg-brand text-brand-deep"
                        : "text-ink hover:bg-soft hover:text-brand-ink"
                    }`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl bg-brand p-6 text-brand-deep/75">
              <h3 className="font-heading text-base font-medium text-brand-deep">
                Need a quotation?
              </h3>
              <p className="mt-2 text-sm">
                Contact our team for pricing and OEM options.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-medium text-brand-ink transition-colors hover:bg-white/90"
              >
                Contact us
              </Link>
            </div>
          </aside>

          {/* Grid */}
          <div>
            <p className="mb-6 text-sm text-body">
              {items.length} product{items.length === 1 ? "" : "s"} in{" "}
              <span className="font-semibold text-ink">{cat.name}</span>
            </p>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {items.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
