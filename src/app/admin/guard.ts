import "server-only";

import { redirect } from "next/navigation";
import { getSessionEmail } from "@/lib/admin-auth";

/**
 * Page-level auth guard. Layouts do not re-run on client-side navigation, so
 * every admin page must call this itself.
 */
export async function requireAdmin(): Promise<string> {
  const email = await getSessionEmail();
  if (!email) redirect("/admin/login");
  return email;
}