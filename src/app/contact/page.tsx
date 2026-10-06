import type { Metadata } from "next";
import Breadcrumbs, { PageBanner } from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Contact MedBreath Medical Co., Ltd. for disposable medical products, OEM/ODM projects and quotations.",
};

const banner = "/images/42a8442c24ad.jpg";

const details = [
  {
    label: "Address",
    value: site.address,
    href: undefined,
  },
  {
    label: "Contact person",
    value: site.contactPerson,
    href: undefined,
  },
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    label: "Phone / WhatsApp",
    value: site.phone,
    href: `tel:${site.phoneRaw}`,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageBanner title="Contact us" image={banner} />
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Contact us" }]}
      />

      <section className="container-x py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-ink">
              Get in touch with us
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-body">
              If you are interested in our products, please contact us
              immediately. We are glad to provide quotations, samples and
              OEM/ODM support.
            </p>

            <ul className="mt-8 space-y-5">
              {details.map((d) => (
                <li key={d.label} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-ink">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                    </svg>
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-body">
                      {d.label}
                    </span>
                    {d.href ? (
                      <a
                        href={d.href}
                        className="text-[15px] text-ink transition-colors hover:text-brand-ink"
                      >
                        {d.value}
                      </a>
                    ) : (
                      <span className="text-[15px] text-ink">{d.value}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-soft p-6 md:p-8">
            <h2 className="font-heading text-xl font-semibold text-ink">
              Send us a message
            </h2>
            <p className="mb-6 mt-2 text-sm text-body">
              Fill in the form and we will get back to you as soon as possible.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="container-x pb-20">
        <div className="flex h-[320px] items-center justify-center rounded-2xl border border-line bg-soft text-body">
          <div className="text-center">
            <svg
              viewBox="0 0 24 24"
              className="mx-auto h-10 w-10 text-brand-ink"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <p className="font-heading mt-3 font-semibold text-ink">
              {site.legalName}
            </p>
            <p className="mt-1 text-sm">{site.address}</p>
          </div>
        </div>
      </section>
    </>
  );
}
