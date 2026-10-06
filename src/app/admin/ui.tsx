import { dimensionsLabel, formatBytes, type ImageMeta } from "@/lib/image-meta";

/** A single badge showing pixel size and file size, as requested. */
export function SizeBadge({ image }: { image: ImageMeta }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-soft px-2 py-1 text-[11px] font-medium text-body">
      <span title="Pixel dimensions">{dimensionsLabel(image)}</span>
      <span aria-hidden className="text-line">
        •
      </span>
      <span title="File size on disk">{formatBytes(image.bytes)}</span>
    </span>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-ink">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-body">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-body">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-brand-ink";

export const buttonPrimary =
  "rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-brand-deep transition-colors hover:bg-brand-dark disabled:opacity-50";

export const buttonSecondary =
  "rounded-full border border-line bg-white px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-soft";

export function FormMessage({ state }: { state: { error?: string } }) {
  if (!state.error) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {state.error}
    </p>
  );
}