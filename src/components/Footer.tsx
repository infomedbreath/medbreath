import Link from "next/link";
import Logo from "@/components/Logo";
import { site } from "@/data/site";
import { categories } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto">
      {/* CTA band */}
      <div className="bg-brand">
        <div className="container-x flex flex-col items-center justify-between gap-5 py-12 text-center md:flex-row md:text-left">
          <div>
            <p className="text-lg font-normal text-brand-deep/75">
              If you are interested in our products,
            </p>
            <p className="mt-1 font-heading text-3xl font-light text-brand-deep">
              Please contact us immediately!
            </p>
          </div>
          <Link
            href="/contact"
            className="rounded-full bg-white px-8 py-3 text-sm font-medium text-brand-ink transition-colors hover:bg-white/90"
          >
            Contact us
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="footer-gradient text-white/75">
        <div className="container-x grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo light height={40} className="mb-6" />
            <p className="text-sm leading-relaxed">
              {site.tagline}. Dedicated to providing hospital and home care
              solutions worldwide.
            </p>
            <div className="mt-6 flex gap-3">
              {["twitter", "facebook", "linkedin"].map((s) => (
                <span
                  key={s}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white hover:text-brand-ink"
                  aria-label={s}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-base font-medium text-white">
              Contact us
            </h3>
            <ul className="space-y-3 text-sm leading-relaxed">
              <li>
                <span className="text-white/40">Email: </span>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-accent"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <span className="text-white/40">Contact: </span>
                {site.contactPerson}
              </li>
              <li>
                <span className="text-white/40">Phone: </span>
                <a
                  href={`tel:${site.phoneRaw}`}
                  className="transition-colors hover:text-accent"
                >
                  {site.phone}
                </a>
              </li>
              <li className="text-white/55">{site.address}</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-base font-medium text-white">
              Products
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/products/${c.slug}`}
                    className="transition-colors hover:text-accent"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-base font-medium text-white">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products" className="transition-colors hover:text-accent">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/news" className="transition-colors hover:text-accent">
                  News
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-accent">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-accent">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-strip">
        <div className="container-x py-5 text-center text-xs text-white/55">
          © {year} {site.legalName}. All rights reserved. | {site.domain}
        </div>
      </div>
    </footer>
  );
}
