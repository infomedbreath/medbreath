"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./guard";
import { checkCredentials, hashPassword } from "@/lib/admin-auth";
import { getSiteSettings, saveSiteSettings } from "@/lib/settings-store";
import type { FormState } from "./data-actions";

export type SettingsState = FormState & { done?: string };

/** Changes the signed-in admin's password. */
export async function changePasswordAction(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const email = await requireAdmin();

  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!(await checkCredentials(email, current))) {
    return { error: "Your current password is not correct." };
  }
  if (next.length < 10) {
    return { error: "The new password must be at least 10 characters long." };
  }
  if (next !== confirm) {
    return { error: "The new passwords do not match." };
  }
  if (await checkCredentials(email, next)) {
    return { error: "The new password is the same as the old one." };
  }

  // The new hash has to be written into ADMIN_USERS, which is an environment
  // variable - this build cannot change it, so tell the admin exactly what to do.
  const hash = await hashPassword(next);
  return {
    done:
      `New password hashed successfully. Set ADMIN_USERS="${email}:${hash}" in your environment, then redeploy.`,
  };
}

export async function saveSettingsAction(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  await requireAdmin();

  const current = await getSiteSettings();
  const next = {
    ...current,
    name: String(formData.get("name") ?? current.name).trim(),
    email: String(formData.get("email") ?? current.email).trim(),
    phone: String(formData.get("phone") ?? current.phone).trim(),
    whatsapp: String(formData.get("whatsapp") ?? current.whatsapp).trim(),
    contactPerson: String(formData.get("contactPerson") ?? current.contactPerson).trim(),
    address: String(formData.get("address") ?? current.address).trim(),
    tagline: String(formData.get("tagline") ?? current.tagline).trim(),
    description: String(formData.get("description") ?? current.description).trim(),
  };

  if (!next.name) return { error: "Site name is required." };

  try {
    await saveSiteSettings(next);
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Could not save settings.",
    };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { done: "Settings saved." };
}

/**
 * Copies the bundled JSON into D1 once, so the admin has something to edit.
 * The form data is unused, but a Server Action must accept it.
 */
export async function seedAction(
  _prev: SettingsState,
  _formData: FormData,
): Promise<SettingsState> {
  await requireAdmin();
  const { ensureSchema, seedFromJson } = await import("@/lib/content-store");
  try {
    await ensureSchema();
    const result = await seedFromJson();
    revalidatePath("/", "layout");
    return {
      done: `Seeded the database from the JSON files: ${result.products} products, ${result.news} articles, ${result.categories} categories.`,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not seed the database.",
    };
  }
}