import Link from "next/link";

export type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <div className="border-b border-line bg-soft">
      <div className="container-x flex flex-wrap items-center gap-x-2 gap-y-1 py-4 text-[13px] text-body">
        <span className="mr-1 text-ink/50">Current position:</span>
        {items.map((c, i) => (
          <span key={i} className="flex items-center gap-2">
            {c.href ? (
              <Link href={c.href} className="transition-colors hover:text-brand-ink">
                {c.label}
              </Link>
            ) : (
              <span className="text-brand-ink">{c.label}</span>
            )}
            {i < items.length - 1 && (
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3 text-ink/30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export function PageBanner({
  title,
  image,
}: {
  title: string;
  image?: string;
}) {
  return (
    <section className="relative flex h-[220px] items-center justify-center overflow-hidden bg-brand-deep md:h-[300px]">
      {image && (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-deep/85 via-brand-deep/55 to-brand-deep/30" />
      <div className="container-x relative text-center">
        <h1 className="font-heading text-3xl font-light tracking-tight text-white md:text-[42px]">
          {title}
        </h1>
        <span className="mx-auto mt-5 block h-[2px] w-14 rounded bg-white/70" />
      </div>
    </section>
  );
}
