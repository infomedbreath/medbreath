import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import NewsCard from "@/components/NewsCard";
import { rewriteContent } from "@/lib/images";
import {
  getNews,
  getNewsItem,
  getNewsByCategory,
  type NewsItem,
} from "@/lib/content-store";

// News is admin-editable, so this page is rendered per request.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  if (!item) return { title: "News" };
  return {
    title: item.title,
    description: item.summary,
  };
}

export default async function NewsDetailPage({
  params,
}: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const [allNews, item] = await Promise.all([
    getNews(),
    getNewsItem(slug),
  ]);
  if (!item) notFound();

  const index = allNews.findIndex((n) => n.slug === slug);
  const prev = index > 0 ? allNews[index - 1] : null;
  const next = index < allNews.length - 1 ? allNews[index + 1] : null;

  const related = (await getNewsByCategory(item.categorySlug))
    .filter((n: NewsItem) => n.slug !== item.slug)
    .slice(0, 3);

  const categoryHref = `/news/${item.categorySlug}`;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "News", href: "/news" },
          { label: item.category, href: categoryHref },
          { label: item.title },
        ]}
      />

      <article className="container-x py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-2xl font-semibold leading-snug text-ink md:text-3xl">
            {item.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-body">
            <Link
              href={categoryHref}
              className="rounded-full bg-soft px-3 py-1 font-medium text-brand-ink"
            >
              {item.category}
            </Link>
            <span>{item.dateOnly}</span>
          </div>

          {item.image && (
            <div className="mt-8 overflow-hidden rounded-2xl bg-soft">
              <img
                src={item.image}
                alt={item.title}
                className="w-full object-cover"
              />
            </div>
          )}

          <div
            className="rich-content mt-8"
            dangerouslySetInnerHTML={{ __html: rewriteContent(item.content) }}
          />

          {/* Prev / next */}
          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-line pt-6 text-sm sm:flex-row">
            {prev ? (
              <Link
                href={`/news/${prev.slug}`}
                className="text-body transition-colors hover:text-brand-ink"
              >
                ← Prev: {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/news/${next.slug}`}
                className="text-body transition-colors hover:text-brand-ink sm:text-right"
              >
                Next: {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-soft py-20">
          <div className="container-x">
            <h2 className="font-heading mb-10 text-center text-2xl font-semibold text-ink">
              Related News
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((n) => (
                <NewsCard key={n.slug} item={n} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
