"use client";

import { useActionState, useMemo, useState } from "react";
import {
  uploadImageAction,
  replaceImageAction,
} from "@/app/admin/image-actions";
import type { FormState } from "@/app/admin/data-actions";
import { sizeSummary, formatBytes, type ImageMeta } from "@/lib/image-meta";
import { buttonPrimary, buttonSecondary } from "@/app/admin/ui";

/** An image plus a short description of where the site uses it. */
type Row = ImageMeta & { usage: string; usedBy: string[] };

type ReplaceState = FormState & { replaced?: ImageMeta };

export default function ImageManager({ images }: { images: Row[] }) {
  const [rows, setRows] = useState<Row[]>(images);
  const [filter, setFilter] = useState("");
  const [onlyUsed, setOnlyUsed] = useState(false);
  const [sort, setSort] = useState<"name" | "size-desc" | "size-asc">("name");
  const [openCard, setOpenCard] = useState<string | null>(null);

  const [uploadState, uploadAction, uploading] = useActionState<
    FormState & { uploaded?: ImageMeta },
    FormData
  >(uploadImageAction, {});

  const visible = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    let list = rows;

    if (needle) {
      list = list.filter(
        (row) =>
          row.path.toLowerCase().includes(needle) ||
          row.usedBy.some((label) => label.toLowerCase().includes(needle)),
      );
    }
    if (onlyUsed) list = list.filter((row) => row.usedBy.length > 0);

    const sorted = [...list];
    if (sort === "size-desc") sorted.sort((a, b) => b.bytes - a.bytes);
    else if (sort === "size-asc") sorted.sort((a, b) => a.bytes - b.bytes);
    else sorted.sort((a, b) => a.path.localeCompare(b.path));
    return sorted;
  }, [rows, filter, onlyUsed, sort]);

  // A new upload joins the list as soon as the action reports success. Folding
  // it in during render (React's "adjust state on change" pattern) keeps the
  // list and the action result in step without a syncing effect.
  const uploaded = uploadState.uploaded;
  const [seenUpload, setSeenUpload] = useState<string | null>(null);
  if (uploaded && uploaded.path !== seenUpload) {
    setSeenUpload(uploaded.path);
    setRows((current) =>
      current.some((row) => row.path === uploaded.path)
        ? current
        : [{ ...uploaded, usage: "Not used anywhere yet", usedBy: [] }, ...current],
    );
  }

  const totalBytes = rows.reduce((sum, row) => sum + row.bytes, 0);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="rounded-2xl border border-line bg-white p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-56 flex-1">
            <label className="mb-2 block text-sm font-medium text-ink">
              Search
            </label>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filename or product name…"
              className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-ink"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-ink"
            >
              <option value="name">Filename</option>
              <option value="size-desc">Largest first</option>
              <option value="size-asc">Smallest first</option>
            </select>
          </div>

          <label className="flex items-center gap-2 pb-2.5 text-sm text-body">
            <input
              type="checkbox"
              checked={onlyUsed}
              onChange={(e) => setOnlyUsed(e.target.checked)}
              className="h-4 w-4 rounded border-line accent-[var(--brand)]"
            />
            Only images in use
          </label>

          <form action={uploadAction} className="ml-auto flex flex-wrap items-end gap-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Upload new image
              </label>
              <input
                type="file"
                name="file"
                accept=".jpg,.jpeg,.png,.webp,.gif,.avif"
                className="text-sm text-body file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-5 file:py-2.5 file:text-sm file:font-medium file:text-brand-deep"
              />
            </div>
            <button type="submit" disabled={uploading} className={buttonSecondary}>
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </form>
        </div>

        {uploadState.error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {uploadState.error}
          </p>
        )}
        {uploaded && (
          <p className="mt-4 rounded-lg border border-brand/30 bg-brand-soft px-4 py-3 text-sm text-brand-ink">
            Uploaded <strong>{uploaded.name}</strong> ({sizeSummary(uploaded)}).
          </p>
        )}

        <p className="mt-4 border-t border-line pt-4 text-xs text-body">
          {visible.length} of {rows.length} images ·{" "}
          <strong>{formatBytes(totalBytes)}</strong> total · every image shows its
          pixel size and file size
        </p>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white px-6 py-12 text-center text-sm text-body">
          No images match your search.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((row) => (
            <ImageCard
              key={row.path}
              row={row}
              open={openCard === row.path}
              onToggle={() =>
                setOpenCard((current) => (current === row.path ? null : row.path))
              }
              onReplaced={(next) =>
                setRows((current) =>
                  current.map((r) =>
                    r.path === next.path
                      ? { ...r, ...next, usage: r.usage, usedBy: r.usedBy }
                      : r,
                  ),
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ImageCard({
  row,
  open,
  onToggle,
  onReplaced,
}: {
  row: Row;
  open: boolean;
  onToggle: () => void;
  onReplaced: (next: ImageMeta) => void;
}) {
  const [state, action, pending] = useActionState<ReplaceState, FormData>(
    replaceImageAction,
    {},
  );

  const replaced = state.replaced;
  // Propagate the new metadata upward during render, once per replacement.
  const [handled, setHandled] = useState<string | null>(null);
  if (replaced && replaced.path === row.path && handled !== replaced.path) {
    setHandled(replaced.path);
    onReplaced(replaced);
  }

  const isUsed = row.usedBy.length > 0;

  return (
    <div
      className={`flex flex-col rounded-2xl border bg-white p-4 transition-colors ${
        open ? "border-brand" : "border-line"
      }`}
    >
      <div className="relative">
        <img
          src={row.path}
          alt={row.name}
          width={400}
          height={300}
          loading="lazy"
          className="h-36 w-full rounded-xl border border-line bg-soft object-contain"
        />
        {isUsed ? (
          <span className="absolute top-2 left-2 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand-ink">
            In use
          </span>
        ) : (
          <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-body">
            Unused
          </span>
        )}
      </div>

      <p className="mt-3 truncate text-sm font-medium text-ink" title={row.path}>
        {row.name}
      </p>

      <p className="mt-1 text-xs font-medium text-brand-ink">
        {sizeSummary(row)}
      </p>

      <p
        className="mt-1 text-xs text-body"
        title={row.usedBy.join(", ")}
      >
        {row.usage}
      </p>

      <button
        type="button"
        onClick={onToggle}
        className={`${buttonSecondary} mt-4 w-full py-2 text-xs`}
      >
        {open ? "Close" : "Replace image"}
      </button>

      {/* The form stays mounted while the card is closed so that collapsing and
          re-opening does not discard a file the admin already picked. An empty
          file input is rejected by the action, so it is safe to submit. */}
      <form
        action={action}
        className="mt-3 space-y-2 border-t border-line pt-3"
        hidden={!open}
      >
        <input type="hidden" name="target" value={row.path} />
        <input
          type="file"
          name="file"
          accept=".jpg,.jpeg,.png,.webp,.gif,.avif"
          className="w-full text-xs text-body file:mr-2 file:rounded-full file:border-0 file:bg-soft file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ink"
        />
        <button
          type="submit"
          disabled={pending}
          className={`${buttonPrimary} w-full py-2 text-xs`}
        >
          {pending ? "Replacing…" : "Apply new image"}
        </button>

        {state.error && (
          <p role="alert" className="text-xs text-red-600">
            {state.error}
          </p>
        )}
        {replaced && !state.error && (
          <p className="text-xs text-brand-ink">
            Replaced — now {sizeSummary(replaced)}
          </p>
        )}

        <p className="text-[11px] leading-relaxed text-body">
          Replaces the file in place, so{" "}
          {isUsed
            ? `${row.usage.toLowerCase()} update${row.usedBy.length > 1 ? "" : "s"} automatically.`
            : "nothing else is affected yet."}
        </p>
      </form>
    </div>
  );
}
