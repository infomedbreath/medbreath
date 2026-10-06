import { notFound } from "next/navigation";
import { requireAdmin } from "../../guard";
import { getNewsItem } from "@/lib/content-store";
import NewsForm from "../NewsForm";
import { AdminPageHeader } from "../../ui";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();
  const { slug } = await params;

  const item = await getNewsItem(slug);
  if (!item) notFound();

  return (
    <>
      <AdminPageHeader title="Edit article" description={item.title} />
      <NewsForm item={item} />
    </>
  );
}