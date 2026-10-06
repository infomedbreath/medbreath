import type { Metadata } from "next";
import { NewsList, NEWS_BANNER } from "@/components/NewsList";
import { getNewsByCategory } from "@/lib/content-store";

// News is admin-editable, so this page is rendered per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Industry news",
  description: "Industry news and insights on medical disposable products.",
};

export default async function IndustryNewsPage() {
  const items = await getNewsByCategory("industry");

  return (
    <NewsList
      title="Industry news"
      activeCategory="industry"
      items={items}
      banner={NEWS_BANNER}
    />
  );
}