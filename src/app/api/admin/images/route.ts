import { NextResponse } from "next/server";
import { getSessionEmail } from "@/lib/admin-auth";
import { listLocalImages } from "@/lib/image-store";

// Image metadata must never be cached - sizes change as files are replaced.
export const dynamic = "force-dynamic";

export async function GET() {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const images = await listLocalImages("images");
  return NextResponse.json(images, {
    headers: { "Cache-Control": "no-store" },
  });
}