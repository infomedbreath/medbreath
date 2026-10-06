import type { Metadata } from "next";
import { NewsList, NEWS_BANNER } from "@/components/NewsList";
import { getNewsByCategory } from "@/lib/content-store";

// News is admin-editable, so this page is rendered per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Company news",
  description: "Latest company news, exhibitions and updates from MedBreath Medical.",
};

export default async function CompanyNewsPage() {
  const items = await getNewsByCategory("company");

  return (
    <NewsList
      title="Company news"
      activeCategory="company"
      items={items}
      banner={NEWS_BANNER}
    />
  );
}