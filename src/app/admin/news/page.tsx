import Link from "next/link";
import { requireAdmin } from "../guard";
import { getNews } from "@/lib/content-store";
import { inspectLocalImage } from "@/lib/image-store";
import { sizeSummary } from "@/lib/image-meta";
import { AdminPageHeader, AdminCard } from "../ui";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  await requireAdmin();
  const { saved, deleted } = await searchParams;

  const items = await getNews();

  const rows = await Promise.all(
    items.map(async (item) => ({
      item,
      meta: item.image ? await inspectLocalImage(item.image) : null,
    })),
  );

  return (
    <>
      <AdminPageHeader
        title="News"
        description={`${items.length} articles.`}
        action={
          <Link
            href="/admin/news/new"
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-brand-deep transition-colors hover:bg-brand-dark"
          >
            Add article
          </Link>
        }
      />

      {saved && (
        <p className="mb-6 rounded-lg border border-brand/30 bg-brand-soft px-4 py-3 text-sm text-brand-ink">
          Saved <strong>{saved}</strong>.
        </p>
      )}
      {deleted && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Article deleted.
        </p>
      )}

      <AdminCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line bg-soft text-xs tracking-wide text-body uppercase">
              <tr>
                <th className="px-5 py-3.5 font-medium">Article</th>
                <th className="px-5 py-3.5 font-medium">Type</th>
                <th className="px-5 py-3.5 font-medium">Date</th>
                <th className="px-5 py-3.5 font-medium">Image size</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {rows.map(({ item, meta }) => (
                <tr
                  key={item.slug}
                  className="border-b border-line last:border-0 hover:bg-soft"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          width={56}
                          height={56}
                          className="h-12 w-12 shrink-0 rounded-lg border border-line object-cover"
                        />
                      ) : (
                        <span className="h-12 w-12 shrink-0 rounded-lg border border-dashed border-line" />
                      )}
                      <div className="min-w-0">
                        <Link
                          href={`/admin/news/${item.slug}`}
                          className="block truncate font-medium text-ink hover:text-brand-ink"
                        >
                          {item.title}
                        </Link>
                        <span className="text-xs text-body">/{item.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-body">{item.category}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-body">
                    {item.dateOnly}
                  </td>
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
                        href={`/news/${item.slug}`}
                        target="_blank"
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-body transition-colors hover:bg-white hover:text-ink"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/news/${item.slug}`}
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
