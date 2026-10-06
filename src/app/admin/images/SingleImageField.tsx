"use client";

import { useActionState, useState } from "react";
import { uploadImageAction } from "@/app/admin/image-actions";
import type { FormState } from "@/app/admin/data-actions";
import { sizeSummary, type ImageMeta } from "@/lib/image-meta";
import { buttonSecondary } from "@/app/admin/ui";
import ImageLibraryPicker from "./ImageLibraryPicker";

/**
 * Single-image picker, used where a page has exactly one image (news
 * articles, category tiles, banners). Supports uploading a new file or
 * choosing one that already exists.
 */
export default function SingleImageField({
  name,
  initial,
  hint,
}: {
  name: string;
  initial?: string;
  hint?: string;
}) {
  const [value, setValue] = useState(initial ?? "");
  const [browseOpen, setBrowseOpen] = useState(false);
  const [state, action, pending] = useActionState<
    FormState & { uploaded?: ImageMeta },
    FormData
  >(uploadImageAction, {});

  // A fresh upload becomes the selected image. Folded in during render rather
  // than an effect so the value and the action result never disagree.
  const uploadedPath = state.uploaded?.path;
  const [seenUpload, setSeenUpload] = useState<string | undefined>(undefined);
  if (uploadedPath && uploadedPath !== seenUpload) {
    setSeenUpload(uploadedPath);
    setValue(uploadedPath);
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={value} />

      {value ? (
        <div className="flex items-center gap-4 rounded-xl border border-line bg-white p-3">
          <img
            src={value}
            alt=""
            width={88}
            height={88}
            className="h-20 w-20 shrink-0 rounded-lg border border-line object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">
              {value.split("/").pop()}
            </p>
            {state.uploaded?.path === value && (
              <p className="mt-1 text-xs text-body">
                {sizeSummary(state.uploaded)}
              </p>
            )}
            <button
              type="button"
              onClick={() => setValue("")}
              className="mt-2 text-xs text-red-600 hover:text-red-700"
            >
              Remove image
            </button>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-body">
          No image selected.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
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

      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      {hint && <p className="text-xs text-body">{hint}</p>}

      {browseOpen && (
        <ImageLibraryPicker
          selected={value ? [value] : []}
          onPick={(path) => {
            setValue(path);
            setBrowseOpen(false);
          }}
        />
      )}
    </div>
  );
}
