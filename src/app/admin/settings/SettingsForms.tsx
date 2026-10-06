"use client";

import { useActionState } from "react";
import {
  changePasswordAction,
  saveSettingsAction,
  seedAction as seedDatabaseAction,
  type SettingsState,
} from "@/app/admin/settings-actions";
import type { SiteSettings } from "@/lib/settings-store";
import {
  AdminCard,
  Field,
  FormMessage,
  buttonPrimary,
  buttonSecondary,
  inputClass,
} from "@/app/admin/ui";

export default function SettingsForms({
  settings,
  email,
  isD1,
  storeKind,
}: {
  settings: SiteSettings;
  email: string;
  isD1: boolean;
  storeKind: string;
}) {
  const [siteState, siteAction, sitePending] = useActionState<
    SettingsState,
    FormData
  >(saveSettingsAction, {});
  const [pwState, pwAction, pwPending] = useActionState<
    SettingsState,
    FormData
  >(changePasswordAction, {});
  const [seedState, seedAction, seedPending] = useActionState<
    SettingsState,
    FormData
  >(seedDatabaseAction, {});

  return (
    <div className="space-y-6">
      {/* Site details */}
      <form action={siteAction}>
        <AdminCard>
          <h2 className="font-heading text-lg font-semibold text-ink">
            Site details
          </h2>
          <p className="mt-1.5 mb-5 text-sm text-body">
            These appear in the header, footer and contact section.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Site name">
              <input name="name" defaultValue={settings.name} className={inputClass} />
            </Field>
            <Field label="Contact person">
              <input
                name="contactPerson"
                defaultValue={settings.contactPerson}
                className={inputClass}
              />
            </Field>
            <Field label="Email">
              <input name="email" type="email" defaultValue={settings.email} className={inputClass} />
            </Field>
            <Field label="Phone">
              <input name="phone" defaultValue={settings.phone} className={inputClass} />
            </Field>
            <Field label="WhatsApp">
              <input name="whatsapp" defaultValue={settings.whatsapp} className={inputClass} />
            </Field>
            <Field label="Tagline" >
              <input name="tagline" defaultValue={settings.tagline} className={inputClass} />
            </Field>
          </div>

          <div className="mt-5 space-y-5">
            <Field label="Address">
              <textarea
                name="address"
                rows={2}
                defaultValue={settings.address}
                className={inputClass}
              />
            </Field>
            <Field label="SEO description" hint="Used for meta description and social previews.">
              <textarea
                name="description"
                rows={3}
                defaultValue={settings.description}
                className={inputClass}
              />
            </Field>
          </div>

          {siteState.error && <FormMessage state={siteState} />}
          {siteState.done && (
            <p className="mt-5 rounded-lg border border-brand/30 bg-brand-soft px-4 py-3 text-sm text-brand-ink">
              {siteState.done}
            </p>
          )}

          <button
            type="submit"
            disabled={sitePending || !isD1}
            className={`${buttonPrimary} mt-5`}
          >
            {sitePending ? "Saving…" : "Save site details"}
          </button>
          {!isD1 && (
            <p className="mt-3 text-xs text-body">
              Running on local JSON, so these are read-only here. Connect
              Cloudflare D1 to make them editable.
            </p>
          )}
        </AdminCard>
      </form>

      {/* Password */}
      <form action={pwAction}>
        <AdminCard>
          <h2 className="font-heading text-lg font-semibold text-ink">
            Password
          </h2>
          <p className="mt-1.5 mb-5 text-sm text-body">
            Signed in as <strong>{email}</strong>. New passwords need at least 10
            characters.
          </p>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Current password">
              <input
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
                className={inputClass}
              />
            </Field>
            <Field label="New password">
              <input
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                className={inputClass}
              />
            </Field>
            <Field label="Confirm new password">
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={inputClass}
              />
            </Field>
          </div>

          {pwState.error && <FormMessage state={pwState} />}
          {pwState.done && (
            <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
              {pwState.done}
            </p>
          )}

          <button type="submit" disabled={pwPending} className={`${buttonPrimary} mt-5`}>
            {pwPending ? "Checking…" : "Generate new password hash"}
          </button>
        </AdminCard>
      </form>

      {/* Database */}
      {isD1 && (
        <form action={seedAction}>
          <AdminCard>
            <h2 className="font-heading text-lg font-semibold text-ink">
              Database
            </h2>
            <p className="mt-1.5 mb-5 text-sm text-body">
              Connected to Cloudflare D1 ({storeKind}). If the admin shows your
              original products but saving is unavailable, seed the database
              once with the bundled content.
            </p>

            {seedState.error && <FormMessage state={seedState} />}
            {seedState.done && (
              <p className="mb-5 rounded-lg border border-brand/30 bg-brand-soft px-4 py-3 text-sm text-brand-ink">
                {seedState.done}
              </p>
            )}

            <button type="submit" disabled={seedPending} className={buttonSecondary}>
              {seedPending ? "Seeding…" : "Seed database from JSON files"}
            </button>
          </AdminCard>
        </form>
      )}
    </div>
  );
}