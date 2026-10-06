"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  saveNewsAction,
  deleteNewsAction,
  type FormState,
} from "@/app/admin/data-actions";
import type { NewsItem } from "@/lib/content-store";
import SingleImageField from "../images/SingleImageField";
import {
  AdminCard,
  Field,
  FormMessage,
  buttonPrimary,
  buttonSecondary,
  inputClass,
} from "@/app/admin/ui";

const NEWS_TYPES = [
  { slug: "company", label: "Company news" },
  { slug: "industry", label: "Industry news" },
];

export default function NewsForm({ item }: { item?: NewsItem }) {
  const isNew = !item;
  const [state, action, pending] = useActionState<FormState, FormData>(
    saveNewsAction,
    {},
  );
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [delState, delAction, delPending] = useActionState<
    FormState,
    FormData
  >(deleteNewsAction, {});

  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!isNew);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-3">
      {item && <input type="hidden" name="originalSlug" value={item.slug} />}

      <div className="space-y-6 lg:col-span-2">
        <AdminCard>
          <h2 className="font-heading text-lg font-semibold text-ink">Basics</h2>

          <div className="mt-5 space-y-5">
            <Field label="Title">
              <input
                name="title"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
                className={inputClass}
              />
            </Field>

            <Field label="URL slug" hint={`Article page: /news/${slug || "article-slug"}`}>
              <input
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                className={inputClass}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Type">
                <select
                  name="categorySlug"
                  defaultValue={item?.categorySlug ?? "company"}
                  className={inputClass}
                >
                  {NEWS_TYPES.map((type) => (
                    <option key={type.slug} value={type.slug}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Publish date">
                <input
                  name="date"
                  type="date"
                  defaultValue={item?.dateOnly ?? ""}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field
              label="Summary"
              hint="Short teaser shown on the news listing page."
            >
              <textarea
                name="summary"
                rows={4}
                defaultValue={item?.summary ?? ""}
                className={inputClass}
              />
            </Field>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-heading text-lg font-semibold text-ink">
            Cover image
          </h2>
          <div className="mt-5">
            <SingleImageField
              name="image"
              initial={item?.image}
              hint="Shown on the news listing and at the top of the article."
            />
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-heading text-lg font-semibold text-ink">
            Article content
          </h2>
          <div className="mt-5">
            <Field label="Content" hint="HTML is allowed.">
              <textarea
                name="content"
                rows={20}
                defaultValue={item?.content ?? ""}
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
              {pending ? "Saving…" : isNew ? "Create article" : "Save changes"}
            </button>
            <Link
              href="/admin/news"
              className={`${buttonSecondary} block w-full text-center`}
            >
              Cancel
            </Link>
          </div>

          {item && (
            <div className="mt-6 border-t border-line pt-5">
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="text-sm text-red-600 transition-colors hover:text-red-700"
                >
                  Delete article
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-body">
                    Delete <strong>{item.title}</strong>? This removes it from
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