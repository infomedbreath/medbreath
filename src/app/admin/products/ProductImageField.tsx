"use client";

import { useActionState, useState } from "react";
import { uploadImageAction } from "@/app/admin/image-actions";
import type { FormState } from "@/app/admin/data-actions";
import { sizeSummary, type ImageMeta } from "@/lib/image-meta";
import { SizeBadge, buttonSecondary } from "@/app/admin/ui";
import ImageLibraryPicker from "../images/ImageLibraryPicker";
import { useImageMeta } from "../images/useImageMeta";

/**
 * Image list for a product. The first entry is the main image. Each row shows
 * the image's pixel size and file size, and rows can be reordered or removed.
 */
export default function ProductImageField({
  name,
  images,
}: {
  name: string;
  images: string[];
}) {
  const [list, setList] = useState<string[]>(images);
  const [state, action, pending] = useActionState<
    FormState & { uploaded?: ImageMeta },
    FormData
  >(uploadImageAction, {});
  const [browseOpen, setBrowseOpen] = useState(false);
  const { meta, loading } = useImageMeta();

  function add(path: string) {
    setList((current) => (current.includes(path) ? current : [...current, path]));
    setBrowseOpen(false);
  }

  function removeAt(index: number) {
    setList((current) => current.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    setList((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  // A successful upload appends itself to the list. Folded in during render
  // (React's "adjust state on change" pattern) rather than in an effect.
  const uploadedPath = state.uploaded?.path;
  const [seenUpload, setSeenUpload] = useState<string | undefined>(undefined);
  if (uploadedPath && uploadedPath !== seenUpload) {
    setSeenUpload(uploadedPath);
    add(uploadedPath);
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={list.join("\n")} />

      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-body">
          No images yet. Upload one below or pick an existing image.
        </p>
      ) : (
        <ul className="space-y-2">
          {list.map((src, index) => {
            const info = meta.get(src);
            return (
              <li
                key={`${src}-${index}`}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-white p-3"
              >
                <img
                  src={src}
                  alt=""
                  width={72}
                  height={72}
                  className="h-16 w-16 shrink-0 rounded-lg border border-line object-cover"
                />
                <div className="min-w-40 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {src.split("/").pop()}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {index === 0 && (
                      <span className="rounded bg-brand-soft px-1.5 py-0.5 text-[11px] font-semibold text-brand-ink">
                        Main image
                      </span>
                    )}
                    {info ? (
                      <span className="text-xs text-body">{sizeSummary(info)}</span>
                    ) : loading ? (
                      <span className="text-xs text-body">Checking size…</span>
                    ) : null}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Move up"
                    className="h-8 w-8 rounded-lg border border-line text-body transition-colors hover:bg-soft disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === list.length - 1}
                    aria-label="Move down"
                    className="h-8 w-8 rounded-lg border border-line text-body transition-colors hover:bg-soft disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    aria-label={`Remove ${src.split("/").pop()}`}
                    className="h-8 w-8 rounded-lg border border-line text-red-600 transition-colors hover:bg-red-50"
                  >
                    ×
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex flex-wrap gap-3">
        <form action={action} className="flex flex-wrap items-center gap-2">
          {/* Remounting on a new upload clears the picked file for free. */}
          <input
            key={seenUpload ?? "empty"}
            type="file"
            name="file"
            accept=".jpg,.jpeg,.png,.webp,.gif,.avif"
            className="text-sm text-body file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-5 file:py-2.5 file:text-sm file:font-medium file:text-brand-deep"
          />
          <button type="submit" disabled={pending} className={buttonSecondary}>
            {pending ? "Uploading…" : "Upload"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setBrowseOpen((v) => !v)}
          className={buttonSecondary}
        >
          {browseOpen ? "Close library" : "Choose existing"}
        </button>
      </div>

      {state.uploaded && !state.error && (
        <div className="flex items-center gap-3 rounded-lg border border-line bg-soft p-3">
          <img
            src={state.uploaded.path}
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 rounded-lg border border-line object-cover"
          />
          <div>
            <p className="text-sm font-medium text-ink">Uploaded</p>
            <p className="mt-0.5 text-xs text-body">
              {sizeSummary(state.uploaded)}
            </p>
          </div>
        </div>
      )}

      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      {browseOpen && (
        <ImageLibraryPicker
          selected={list}
          onPick={add}
          emptyHint="pick one"
        />
      )}
    </div>
  );
}

export { SizeBadge };
