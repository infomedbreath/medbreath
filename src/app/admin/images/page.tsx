import { requireAdmin } from "../guard";
import { listLocalImages } from "@/lib/image-store";
import { buildImageUsage, describeUsage } from "@/lib/image-usage";
import { formatBytes } from "@/lib/image-meta";
import ImageManager from "./ImageManager";
import { AdminPageHeader } from "../ui";

export const dynamic = "force-dynamic";

export default async function AdminImagesPage() {
  await requireAdmin();

  // Scan public/ once, then annotate each image with where the site uses it.
  const [images, usage] = await Promise.all([
    listLocalImages(),
    buildImageUsage(),
  ]);

  const rows = images.map((image) => {
    const entry = usage.get(image.path);
    return {
      ...image,
      usage: describeUsage(entry),
      usedBy: entry
        ? [...entry.products, ...entry.news, ...entry.categories]
        : [],
    };
  });

  const usedCount = rows.filter((row) => row.usedBy.length > 0).length;
  const totalBytes = rows.reduce((sum, row) => sum + row.bytes, 0);
  const largest = [...rows].sort((a, b) => b.bytes - a.bytes).slice(0, 3);

  return (
    <>
      <AdminPageHeader
        title="Images"
        description="Every image on the website. Replace one and every page using it updates."
      />

      <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total images" value={String(rows.length)} />
        <SummaryCard label="Images in use" value={String(usedCount)} />
        <SummaryCard label="Unused images" value={String(rows.length - usedCount)} />
        <SummaryCard label="Total size" value={formatBytes(totalBytes)} />
      </div>

      {largest.length > 0 && (
        <div className="mb-6 rounded-2xl border border-line bg-white p-5">
          <h2 className="font-heading text-sm font-semibold text-ink">
            Largest files
          </h2>
          <ul className="mt-3 space-y-2">
            {largest.map((row) => (
              <li
                key={row.path}
                className="flex flex-wrap items-center justify-between gap-2 text-sm"
              >
                <span className="truncate text-body">{row.name}</span>
                <span className="text-xs text-body">
                  {row.width} × {row.height} ·{" "}
                  <strong className="font-medium text-ink">
                    {formatBytes(row.bytes)}
                  </strong>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ImageManager images={rows} />
    </>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="font-heading text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-sm text-body">{label}</p>
    </div>
  );
}