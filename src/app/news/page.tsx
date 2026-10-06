import type { Metadata } from "next";
import { NewsList, NEWS_BANNER } from "@/components/NewsList";
import { getNews } from "@/lib/content-store";

// News is admin-editable, so this page is rendered per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News",
  description:
    "Company and industry news from MedBreath Medical, covering medical disposables and healthcare exhibitions.",
};

export default async function NewsPage() {
  const news = await getNews();
  return <NewsList title="News" items={news} banner={NEWS_BANNER} />;
}