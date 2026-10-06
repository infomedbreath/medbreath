"use client";

import { useState } from "react";
import { sizeSummary, type ImageMeta } from "@/lib/image-meta";
import { buttonSecondary } from "@/app/admin/ui";

/**
 * Grid of every image already on the site, each showing its pixel size and
 * file size. Clicking one hands its path back to the caller.
 */
export default function ImageLibraryPicker({
  onPick,
  selected = [],
  emptyHint,
}: {
  onPick: (path: string) => void;
  selected?: string[];
  emptyHint?: string;
}) {
  const [images, setImages] = useState<ImageMeta[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/images");
      if (!res.ok) throw new Error("Could not load the image library.");
      setImages(await res.json());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (images === null) {
    return (
      <div className="rounded-xl border border-line p-6 text-center">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className={buttonSecondary}
          >
            {loading ? "Loading…" : `Load image library${emptyHint ? ` (${emptyHint})` : ""}`}
          </button>
        )}
      </div>
    );
  }

  const needle = filter.toLowerCase();
  const visible = images.filter((image) => image.path.toLowerCase().includes(needle));

  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by filename…"
          className="min-w-48 flex-1 rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-brand-ink"
        />
        <span className="text-xs text-body">
          {visible.length} of {images.length} images
        </span>
        <button type="button" onClick={load} className="text-xs text-brand-ink underline">
          Rescan
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="py-6 text-center text-sm text-body">No images found.</p>
      ) : (
        <div className="grid max-h-96 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-4">
          {visible.map((image) => {
            const isSelected = selected.includes(image.path);
            return (
              <button
                key={image.path}
                type="button"
                onClick={() => onPick(image.path)}
                className={`rounded-lg border p-2 text-left transition-colors ${
                  isSelected
                    ? "border-brand bg-brand-soft"
                    : "border-line hover:bg-soft"
                }`}
              >
                <img
                  src={image.path}
                  alt={image.name}
                  width={200}
                  height={200}
                  loading="lazy"
                  className="mb-2 h-24 w-full rounded object-cover"
                />
                <span className="block truncate text-[11px] font-medium text-ink">
                  {image.name}
                </span>
                <span className="mt-1 block text-[10px] text-body">
                  {sizeSummary(image)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
