import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionEmail, isConfigured } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Sign in - Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // Already signed in? Skip the form.
  if (await getSessionEmail()) {
    redirect("/admin");
  }

  const { next } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-soft px-5 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <img
              src="/logo.png"
              alt="MedBreath"
              width={400}
              height={200}
              style={{ height: 44, width: "auto" }}
            />
          </Link>
          <h1 className="font-heading mt-6 text-2xl font-semibold text-ink">
            Admin dashboard
          </h1>
          <p className="mt-2 text-sm text-body">
            Sign in to manage products, news and images.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-8 shadow-sm">
          <LoginForm configured={isConfigured()} next={next} />
        </div>

        <p className="mt-6 text-center text-xs text-body">
          <Link href="/" className="hover:text-brand-ink">
            ← Back to website
          </Link>
        </p>
      </div>
    </main>
  );
}