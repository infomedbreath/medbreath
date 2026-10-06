import { notFound } from "next/navigation";
import { requireAdmin } from "../../guard";
import { getCategories, getProduct } from "@/lib/content-store";
import ProductForm from "../ProductForm";
import { AdminPageHeader } from "../../ui";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();
  const { slug } = await params;

  const [product, categories] = await Promise.all([
    getProduct(slug),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <>
      <AdminPageHeader
        title="Edit product"
        description={product.name}
      />
      <ProductForm product={product} categories={categories} />
    </>
  );
}