/**
 * Editable site settings (name, contact details, address).
 *
 * Stored in the same `collections` table as the rest of the content, falling
 * back to the values in `src/data/site.ts` when nothing has been saved yet.
 */
import "server-only";
import { site } from "@/data/site";
import {
  storeKind,
  readCollection,
  writeCollectionValue,
} from "@/lib/content-store";

export type SiteSettings = {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  contactPerson: string;
  address: string;
  tagline: string;
  description: string;
};

export const defaultSettings: SiteSettings = {
  name: site.name,
  email: site.email,
  phone: site.phone,
  whatsapp: site.whatsapp,
  contactPerson: site.contactPerson,
  address: site.address,
  tagline: site.tagline,
  description: site.description,
};

const KEY = "settings";

let cached: { at: number; value: SiteSettings } | null = null;
const TTL_MS = 5_000;

export async function getSiteSettings(): Promise<SiteSettings> {
  if (storeKind === "local") return defaultSettings;

  const now = Date.now();
  if (cached && now - cached.at < TTL_MS) return cached.value;

  const stored = await readCollection<Partial<SiteSettings>>(KEY);
  const value: SiteSettings = { ...defaultSettings, ...stored };

  cached = { at: now, value };
  return value;
}

export async function saveSiteSettings(next: SiteSettings) {
  await writeCollectionValue(KEY, next);
  cached = null;
}