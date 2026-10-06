import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import Breadcrumbs, { PageBanner } from "@/components/Breadcrumbs";
import type { NewsItem } from "@/lib/content-store";
import { localImage } from "@/lib/images";

export function NewsList({
  title,
  items,
  activeCategory,
  banner,
}: {
  title: string;
  items: NewsItem[];
  activeCategory?: string;
  banner: string;
}) {
  const tabs = [
    { label: "All News", href: "/news", key: undefined },
    { label: "Company news", href: "/news/company", key: "company" },
    { label: "Industry news", href: "/news/industry", key: "industry" },
  ];

  return (
    <>
      <PageBanner title={title} image={banner} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "News", href: "/news" },
          ...(activeCategory ? [{ label: activeCategory }] : []),
        ]}
      />

      <section className="container-x py-20">
        <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
          {tabs.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                activeCategory === t.key
                  ? "bg-brand text-brand-deep"
                  : "bg-soft text-ink hover:bg-brand hover:text-brand-deep"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="py-20 text-center text-body">No news found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((n) => (
              <NewsCard key={n.slug} item={n} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export const NEWS_BANNER = localImage(
  "https://img03.71360.com/w3/ogvow0/20241017/e39ad2c09c5b6e765c2caa7b6dc5270a.jpg",
);


