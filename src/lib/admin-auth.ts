/**
 * Session cookie handling for the admin area.
 *
 * The cryptography lives in `session-core.ts` (no `next/headers`, no
 * `server-only`) so that `src/proxy.ts` can validate a token without pulling in
 * request-bound APIs. This module is the thin, request-bound layer on top.
 */
import "server-only";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  verifySessionToken,
} from "@/lib/session-core";

export {
  checkCredentials,
  hashPassword,
  isConfigured,
  listAdmins,
} from "@/lib/session-core";

export async function createSession(email: string) {
  const token = await createSessionToken(email);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Returns the logged-in admin's email, or null. Does not redirect. */
export async function getSessionEmail(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}