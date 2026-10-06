"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveProductAction, deleteProductAction, type FormState } from "@/app/admin/data-actions";
import type { Product, Category } from "@/lib/content-store";
import ProductImageField from "./ProductImageField";
import {
  AdminCard,
  Field,
  FormMessage,
  buttonPrimary,
  buttonSecondary,
  inputClass,
} from "@/app/admin/ui";

export default function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const isNew = !product;
  const [state, action, pending] = useActionState<FormState, FormData>(
    saveProductAction,
    {},
  );
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!isNew);

  const [delState, delAction, delPending] = useActionState<
    FormState,
    FormData
  >(deleteProductAction, {});

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-3">
      {product && <input type="hidden" name="originalSlug" value={product.slug} />}

      <div className="space-y-6 lg:col-span-2">
        <AdminCard>
          <h2 className="font-heading text-lg font-semibold text-ink">Basics</h2>

          <div className="mt-5 space-y-5">
            <Field label="Product name">
              <input
                name="name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
                className={inputClass}
              />
            </Field>

            <Field
              label="URL slug"
              hint={`Product page: /products/${categories[0]?.slug ?? "category"}/${slug || "product-slug"}`}
            >
              <div className="flex items-center gap-2">
                <input
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  className={inputClass}
                />
              </div>
            </Field>

            <Field label="Category">
              <select
                name="categorySlug"
                required
                defaultValue={product?.categorySlug ?? categories[0]?.slug}
                className={inputClass}
              >
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Main image (thumbnail)">
              <input
                name="thumbnail"
                defaultValue={product?.thumbnail ?? ""}
                placeholder="Leave empty to use the first image below"
                className={inputClass}
              />
            </Field>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-heading text-lg font-semibold text-ink">
            Images
          </h2>
          <p className="mt-1.5 mb-5 text-sm text-body">
            The first image is used as the main image. Reorder, remove, or upload
            new ones.
          </p>
          <ProductImageField name="images" images={product?.images ?? []} />
        </AdminCard>

        <AdminCard>
          <h2 className="font-heading text-lg font-semibold text-ink">
            Description
          </h2>
          <div className="mt-5 space-y-5">
            <Field
              label="Short description"
              hint="Plain text or simple HTML, e.g. - 100% latex free<br/>- Sterile"
            >
              <textarea
                name="shortDescription"
                rows={5}
                defaultValue={product?.shortDescription ?? ""}
                className={inputClass}
              />
            </Field>

            <Field
              label="Details"
              hint="Main body shown on the product page. HTML is allowed."
            >
              <textarea
                name="details"
                rows={14}
                defaultValue={product?.details ?? ""}
                className={`${inputClass} font-mono text-xs`}
              />
            </Field>

            <Field
              label="Extra description"
              hint="Optional second content block, HTML allowed."
            >
              <textarea
                name="description"
                rows={6}
                defaultValue={product?.description ?? ""}
                className={`${inputClass} font-mono text-xs`}
              />
            </Field>
          </div>
        </AdminCard>
      </div>

      <div className="space-y-6">
        <AdminCard className="sticky top-6">
          <FormMessage state={state} />

          <div className="mt-5 space-y-3">
            <button type="submit" disabled={pending} className={`${buttonPrimary} w-full`}>
              {pending ? "Saving…" : isNew ? "Create product" : "Save changes"}
            </button>

            <Link
              href="/admin/products"
              className={`${buttonSecondary} block w-full text-center`}
            >
              Cancel
            </Link>
          </div>

          {product && (
            <div className="mt-6 border-t border-line pt-5">
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="text-sm text-red-600 transition-colors hover:text-red-700"
                >
                  Delete product
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-body">
                    Delete <strong>{product.name}</strong>? This removes it from
                    the site.
                  </p>
                  <FormMessage state={delState} />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      formAction={delAction}
                      disabled={delPending}
                      className="flex-1 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                      {delPending ? "Deleting…" : "Yes, delete"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className={buttonSecondary}
                    >
                      Keep
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </AdminCard>
      </div>
    </form>
  );
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}