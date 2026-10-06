"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  checkCredentials,
  createSession,
  destroySession,
  isConfigured,
} from "@/lib/admin-auth";

export type LoginState = { error?: string };

/** Only allow same-site relative paths as a post-login destination. */
function safeNext(value: FormDataEntryValue | null): string {
  const raw = String(value ?? "");
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/admin";
  // Never bounce back into the login form itself.
  return raw.startsWith("/admin/login") ? "/admin" : raw;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isConfigured()) {
    return {
      error:
        "Admin access is not set up yet. Add ADMIN_USERS and ADMIN_SESSION_SECRET to your environment variables.",
    };
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const matched = await checkCredentials(email, password);
  if (!matched) {
    // Deliberately vague: do not reveal whether the email exists.
    return { error: "Incorrect email or password." };
  }

  await createSession(matched);
  redirect(next);
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/** Refreshes the public pages that read from the content store. */
export async function refreshSite() {
  revalidatePath("/", "layout");
}