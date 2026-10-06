import Link from "next/link";
import { requireAdmin } from "../guard";
import { getProducts, getCategories } from "@/lib/content-store";
import { inspectLocalImage } from "@/lib/image-store";
import { sizeSummary } from "@/lib/image-meta";
import { AdminPageHeader, AdminCard } from "../ui";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { saved } = await searchParams;

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const categoryNames = new Map(categories.map((c) => [c.slug, c.name]));

  // Read the size of each product's main image so the list shows it.
  const withSizes = await Promise.all(
    products.map(async (product) => {
      const meta = await inspectLocalImage(product.thumbnail);
      return { product, meta };
    }),
  );

  return (
    <>
      <AdminPageHeader
        title="Products"
        description={`${products.length} products across ${categories.length} categories.`}
        action={
          <Link
            href="/admin/products/new"
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-brand-deep transition-colors hover:bg-brand-dark"
          >
            Add product
          </Link>
        }
      />

      {saved && (
        <p className="mb-6 rounded-lg border border-brand/30 bg-brand-soft px-4 py-3 text-sm text-brand-ink">
          Saved <strong>{saved}</strong>.
        </p>
      )}

      <AdminCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line bg-soft text-xs tracking-wide text-body uppercase">
              <tr>
                <th className="px-5 py-3.5 font-medium">Product</th>
                <th className="px-5 py-3.5 font-medium">Category</th>
                <th className="px-5 py-3.5 font-medium">Images</th>
                <th className="px-5 py-3.5 font-medium">Main image size</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {withSizes.map(({ product, meta }) => (
                <tr
                  key={product.slug}
                  className="border-b border-line last:border-0 hover:bg-soft"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.thumbnail}
                        alt=""
                        width={56}
                        height={56}
                        className="h-12 w-12 shrink-0 rounded-lg border border-line object-cover"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/admin/products/${product.slug}`}
                          className="block truncate font-medium text-ink hover:text-brand-ink"
                        >
                          {product.name}
                        </Link>
                        <span className="text-xs text-body">/{product.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-body">
                    {categoryNames.get(product.categorySlug) ?? product.category}
                  </td>
                  <td className="px-5 py-4 text-body">{product.images.length}</td>
                  <td className="px-5 py-4 text-body">
                    {meta ? (
                      <span className="whitespace-nowrap">
                        {sizeSummary(meta)}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/${product.categorySlug}/${product.slug}`}
                        target="_blank"
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-body transition-colors hover:bg-white hover:text-ink"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/products/${product.slug}`}
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-white"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </>
  );
}
