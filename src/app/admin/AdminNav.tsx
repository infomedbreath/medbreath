"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/images", label: "Images" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminNav({
  email,
  logout,
}: {
  email: string;
  logout: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <header className="border-b border-line bg-white">
      <div className="container-x flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex shrink-0 items-center gap-2">
            <img
              src="/logo.png"
              alt="MedBreath"
              width={400}
              height={200}
              style={{ height: 30, width: "auto" }}
            />
            <span className="rounded-md bg-brand-soft px-2 py-0.5 text-[11px] font-semibold tracking-wide text-brand-ink uppercase">
              Admin
            </span>
          </Link>

          <nav className="hidden gap-1 md:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href, link.exact)
                    ? "bg-brand-soft text-brand-ink"
                    : "text-body hover:bg-soft hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hidden text-sm text-body transition-colors hover:text-brand-ink sm:block"
          >
            View site
          </Link>
          <span
            className="hidden max-w-[180px] truncate text-sm text-body lg:block"
            title={email}
          >
            {email}
          </span>
          {logout}
        </div>
      </div>

      <nav className="container-x flex gap-1 overflow-x-auto border-t border-line py-2 md:hidden">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive(link.href, link.exact)
                ? "bg-brand-soft text-brand-ink"
                : "text-body"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}