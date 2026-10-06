import { requireAdmin } from "../../guard";
import NewsForm from "../NewsForm";
import { AdminPageHeader } from "../../ui";

export const dynamic = "force-dynamic";

export default async function NewNewsPage() {
  await requireAdmin();

  return (
    <>
      <AdminPageHeader
        title="New article"
        description="Publish a company or industry news article."
      />
      <NewsForm />
    </>
  );
}