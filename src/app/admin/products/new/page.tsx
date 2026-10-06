import { requireAdmin } from "../../guard";
import { getCategories } from "@/lib/content-store";
import ProductForm from "../ProductForm";
import { AdminPageHeader } from "../../ui";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await getCategories();

  return (
    <>
      <AdminPageHeader
        title="New product"
        description="Add a product to the catalogue. It appears on the site as soon as you save."
      />
      {categories.length === 0 ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          No categories found. Seed the database first by setting the Cloudflare
          environment variables and saving once.
        </p>
      ) : (
        <ProductForm categories={categories} />
      )}
    </>
  );
}