/**
 * Pure authentication primitives: PBKDF2 password hashing, HMAC-signed session
 * tokens, and parsing of the `ADMIN_USERS` env var.
 *
 * Deliberately free of `server-only`, `next/headers` and any Node-only API so
 * that both the admin server actions and `src/proxy.ts` can use it. Uses Web
 * Crypto, which runs on Node and Cloudflare Workers alike.
 */

export const SESSION_COOKIE = "mb_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const ITERATIONS = 210_000;
const KEY_BYTES = 32;

export function isAuthConfigured(): boolean {
  return process.env.ADMIN_SESSION_SECRET ? getSecret() !== null : false;
}

function getSecret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET;
  return s && s.length >= 32 ? s : null;
}

/** Throws with a setup hint when the env is not usable. */
function requireSecret(): string {
  const s = getSecret();
  if (!s) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be a random string of at least 32 characters. Generate one with: openssl rand -base64 32",
    );
  }
  return s;
}

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function signSessionPayload(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(requireSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return base64url(new Uint8Array(sig));
}

/** Constant-time comparison that does not leak length via an early exit. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/* ------------------------------------------------------------------ */
/* Password hashing                                                    */
/* ------------------------------------------------------------------ */

async function pbkdf2(
  password: string,
  salt: string,
  iterations: number,
): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: encoder.encode(salt), iterations, hash: "SHA-256" },
    key,
    KEY_BYTES * 8,
  );
  return new Uint8Array(bits);
}

/**
 * Produces a `pbkdf2.<iterations>.<salt>.<hash>` string for ADMIN_USERS.
 *
 * The separator is a dot, not a dollar sign, because Next.js truncates `.env`
 * values at `$`. `base64url` output never contains a dot, so it is unambiguous.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = base64url(crypto.getRandomValues(new Uint8Array(16)));
  const hash = base64url(await pbkdf2(password, salt, ITERATIONS));
  return `pbkdf2.${ITERATIONS}.${salt}.${hash}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split(".");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;

  const iterations = Number(parts[1]);
  if (!Number.isFinite(iterations) || iterations < 1) return false;

  const actual = base64url(await pbkdf2(password, parts[2], iterations));
  return safeEqual(actual, parts[3]);
}

/* ------------------------------------------------------------------ */
/* Admin list                                                          */
/* ------------------------------------------------------------------ */

export type AdminUser = { email: string; hashes: string[] };

/**
 * Parsed from `ADMIN_USERS`, e.g.
 * `you@gmail.com:pbkdf2.210000.salt.hash`
 *
 * Several hashes per user are allowed, separated by `|`, so a password can be
 * rotated without a gap: any of the listed hashes will sign in.
 */
export function adminUsers(): AdminUser[] {
  const raw = process.env.ADMIN_USERS;
  if (!raw) return [];
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const idx = entry.indexOf(":");
      if (idx === -1) return null;
      return {
        email: entry.slice(0, idx).trim().toLowerCase(),
        hashes: entry
          .slice(idx + 1)
          .split("|")
          .map((h) => h.trim())
          .filter(Boolean),
      };
    })
    .filter((u): u is AdminUser => u !== null);
}

export function isConfigured(): boolean {
  return adminUsers().length > 0 && getSecret() !== null;
}

export function listAdmins(): string[] {
  return adminUsers().map((u) => u.email);
}

/**
 * Returns the admin's email when the credentials match, otherwise null.
 * Every hash for that email is checked so timing does not reveal which
 * password variant matched.
 */
export async function checkCredentials(
  email: string,
  password: string,
): Promise<string | null> {
  const user = adminUsers().find(
    (u) => u.email === email.trim().toLowerCase(),
  );
  if (!user) return null;

  let matched = false;
  for (const hash of user.hashes) {
    if (await verifyPassword(password, hash)) matched = true;
  }
  return matched ? user.email : null;
}

/* ------------------------------------------------------------------ */
/* Session token                                                       */
/* ------------------------------------------------------------------ */

export async function createSessionToken(email: string): Promise<string> {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `${email}.${expiresAt}`;
  return `${payload}.${await signSessionPayload(payload)}`;
}

/** Validates a raw cookie value and returns the admin's email, or null. */
export async function verifySessionToken(
  token: string | undefined,
): Promise<string | null> {
  if (!token || !getSecret()) return null;

  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return null;

  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);
  if (!safeEqual(signature, await signSessionPayload(payload))) return null;

  const dot = payload.lastIndexOf(".");
  if (dot === -1) return null;

  const email = payload.slice(0, dot);
  const expiresAt = Number(payload.slice(dot + 1));
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;

  // The account must still exist in ADMIN_USERS.
  if (!adminUsers().some((u) => u.email === email)) return null;

  return email;
}