import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session-core";

/**
 * Guards the admin area before the request reaches a page, and keeps it out of
 * search engines.
 *
 * This is defence in depth: each admin page also calls `requireAdmin()` itself,
 * because layouts do not re-run on client-side navigation.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin");

  // The login page must stay reachable, otherwise nobody can sign in.
  const isLoginPage = pathname === "/admin/login";

  if (isAdminArea || isAdminApi) {
    const email = await verifySessionToken(
      request.cookies.get(SESSION_COOKIE)?.value,
    );

    if (!email) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (!isLoginPage) {
        const url = new URL("/admin/login", request.url);
        // Remember where they were headed so login can bounce them back.
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }
    }
  }

  const response = NextResponse.next();

  if (isAdminArea || isAdminApi) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "no-store");
  }

  // Baseline hardening for the whole site.
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");

  return response;
}

export const config = {
  // Only admin routes need this; leaving static assets out keeps the proxy cheap.
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};