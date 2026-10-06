import { getSessionEmail } from "@/lib/admin-auth";
import AdminNav from "./AdminNav";
import LogoutButton from "./LogoutButton";

// Admin pages read the session on every request.
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Shell for the admin area.
 *
 * Note this deliberately does *not* redirect unauthenticated visitors: it also
 * wraps `/admin/login`, which would redirect to itself. Access control lives in
 * two other places instead:
 *
 *   - `src/proxy.ts` rejects unauthenticated admin requests before routing
 *   - every admin page calls `requireAdmin()` itself, which is the real
 *     boundary, since layouts do not re-run on client-side navigation
 *
 * Without a session (the login page) the children render bare.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const email = await getSessionEmail();

  if (!email) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col bg-soft">
      <AdminNav email={email} logout={<LogoutButton />} />
      <main className="container-x flex-1 py-8">{children}</main>
    </div>
  );
}