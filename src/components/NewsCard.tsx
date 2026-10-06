import Link from "next/link";
import type { NewsItem } from "@/lib/data";
import { newsHref } from "@/lib/data";

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-ink/20 hover:shadow-xl hover:shadow-brand-ink/5">
      <Link
        href={newsHref(item)}
        className="relative block aspect-[16/10] overflow-hidden bg-soft"
      >
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-3 text-xs text-body">
          <span className="inline-block rounded-full bg-soft px-3 py-1 font-medium text-brand-ink">
            {item.category}
          </span>
          <span>{item.dateOnly}</span>
        </div>
        <h3 className="font-heading mb-2 line-clamp-2 text-[17px] font-semibold text-ink transition-colors group-hover:text-brand-ink">
          <Link href={newsHref(item)}>{item.title}</Link>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-body">
          {item.summary}
        </p>
        <Link
          href={newsHref(item)}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-ink"
        >
          Read more
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
