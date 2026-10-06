import { requireAdmin } from "./guard";
import { getProducts, getNews, storeKind } from "@/lib/content-store";
import { storageKind, listLocalImages } from "@/lib/image-store";
import { formatBytes } from "@/lib/image-meta";
import Link from "next/link";
import { AdminPageHeader, AdminCard } from "./ui";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  await requireAdmin();

  const [products, news, images] = await Promise.all([
    getProducts(),
    getNews(),
    listLocalImages("images"),
  ]);

  const productImages = new Set(products.flatMap((p) => p.images));
  const newsImages = new Set(news.map((n) => n.image).filter(Boolean));
  const totalBytes = images.reduce((sum, image) => sum + image.bytes, 0);

  const stats = [
    { label: "Products", value: products.length, href: "/admin/products" },
    { label: "News articles", value: news.length, href: "/admin/news" },
    { label: "Images in library", value: images.length, href: "/admin/images" },
    {
      label: "Images in use",
      value: new Set([...productImages, ...newsImages]).size,
      href: "/admin/images",
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Overview"
        description="Manage your catalogue content and imagery."
        action={
          <Link
            href="/admin/products/new"
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-brand-deep transition-colors hover:bg-brand-dark"
          >
            Add product
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <AdminCard className="transition-colors hover:bg-soft">
              <p className="font-heading text-3xl font-semibold text-ink">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-body">{stat.label}</p>
            </AdminCard>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <AdminCard>
          <h2 className="font-heading text-lg font-semibold text-ink">
            Storage
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-body">Content database</dt>
              <dd>
                <StatusPill
                  ok={storeKind === "d1"}
                  label={storeKind === "d1" ? "Cloudflare D1" : "Local JSON"}
                />
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-body">Image storage</dt>
              <dd>
                <StatusPill
                  ok={storageKind === "r2"}
                  label={storageKind === "r2" ? "Cloudflare R2" : "Local disk"}
                />
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-body">Image library size</dt>
              <dd className="font-medium text-ink">{formatBytes(totalBytes)}</dd>
            </div>
          </dl>

          {(storeKind !== "d1" || storageKind !== "r2") && (
            <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
              Running in local mode: edits are not saved and uploads are written
              to <code>public/uploads</code>. Add the Cloudflare environment
              variables (see <code>ADMIN_SETUP.md</code>) to enable editing.
            </p>
          )}
        </AdminCard>

        <AdminCard>
          <h2 className="font-heading text-lg font-semibold text-ink">
            Quick actions
          </h2>
          <div className="mt-4 grid gap-2.5">
            <QuickLink href="/admin/products/new" label="Add a new product" />
            <QuickLink href="/admin/news/new" label="Add a news article" />
            <QuickLink
              href="/admin/images"
              label="Browse and replace images"
            />
            <QuickLink
              href="/admin/settings"
              label="Change password / site settings"
            />
          </div>
        </AdminCard>
      </div>
    </>
  );
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        ok
          ? "bg-brand-soft text-brand-ink"
          : "bg-amber-100 text-amber-800"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-brand" : "bg-amber-500"}`}
      />
      {label}
    </span>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border border-line px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-soft"
    >
      {label}
      <span aria-hidden className="text-body">
        →
      </span>
    </Link>
  );
}