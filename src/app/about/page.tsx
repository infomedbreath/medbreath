import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs, { PageBanner } from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Learn about Medbreath (Private) Limited, a Lahore-based healthcare trading company supplying medical devices, respiratory care products and healthcare solutions.",
};

const banner = "/images/42a8442c24ad.jpg";

const businessAreas = [
  {
    title: "Medical devices & hospital equipment",
    text: "Supply and distribution of medical equipment and devices for hospitals, clinics, diagnostic centres and other healthcare facilities.",
  },
  {
    title: "Respiratory care products",
    text: "Respiratory care products used in oxygen therapy, breathing support and patient respiratory management.",
  },
  {
    title: "Anesthesia & airway management",
    text: "Disposable products used in anesthesia delivery, airway management and related clinical procedures.",
  },
  {
    title: "Medical disposable products",
    text: "Marketing and distribution of essential single-use medical consumables for healthcare institutions and clinical environments.",
  },
  {
    title: "Import & distribution",
    text: "Sourcing medical products from international manufacturers and developing distribution channels for the Pakistani healthcare market.",
  },
  {
    title: "OEM & private-label products",
    text: "Exploring partnerships with qualified manufacturers to develop products under our own brands, subject to applicable regulatory requirements and quality standards.",
  },
];

const portfolio = [
  "Anesthesia breathing circuits",
  "Oxygen masks and oxygen therapy accessories",
  "Nebulizer masks and kits",
  "Airway management consumables",
  "Endotracheal tubes and related accessories",
  "Suction catheters and suction accessories",
  "Respiratory care disposables",
  "Medical tubing and connectors",
  "Hospital medical disposable supplies",
  "Selected medical devices and hospital equipment",
];

const reasons = [
  {
    title: "Customer-focused service",
    text: "We work to understand the requirements of healthcare institutions and medical professionals.",
  },
  {
    title: "Reliable sourcing",
    text: "We build relationships with qualified local and international manufacturers.",
  },
  {
    title: "Competitive solutions",
    text: "We work to offer suitable products at competitive market prices.",
  },
  {
    title: "Professional relationships",
    text: "We value transparent communication with our suppliers and customers.",
  },
  {
    title: "Growing product portfolio",
    text: "We aim to expand our range in response to market demand and healthcare needs.",
  },
  {
    title: "Long-term partnerships",
    text: "We focus on sustainable relationships with hospitals, distributors and healthcare suppliers.",
  },
];

const customers = [
  "Public and private hospitals",
  "Clinics and healthcare centres",
  "Medical equipment dealers",
  "Healthcare distributors and wholesalers",
  "Medical procurement organizations",
  "Institutional and corporate healthcare buyers",
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-body">
          <span
            aria-hidden="true"
            className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-ink"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageBanner title="About us" image={banner} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About us" }]} />

      <section className="container-x py-16 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-ink">
            Medical Devices · Respiratory Care · Healthcare Solutions
          </p>
          <h1 className="font-heading mt-4 text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            Medbreath (Private) Limited
          </h1>
          <p className="mt-4 text-sm font-medium text-body">
            Company Profile · Head Office: Lahore, Punjab, Pakistan
          </p>
          <span className="mx-auto mt-6 block h-[2px] w-14 rounded bg-brand-ink" />
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-8 rounded-3xl border border-line bg-white p-7 shadow-sm md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-ink">
              About Us
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-body">
              <p>
                Medbreath (Private) Limited is a Lahore-based healthcare trading
                company dedicated to the supply, distribution, import and
                marketing of medical devices, hospital equipment and medical
                disposable products.
              </p>
              <p>
                We aim to support hospitals, clinics, healthcare institutions
                and medical professionals with reliable healthcare products
                that meet the evolving needs of the medical industry.
              </p>
              <p>
                With a focus on quality, professional service and customer
                satisfaction, we strive to build strong relationships with
                healthcare providers, manufacturers and business partners in
                Pakistan and international markets.
              </p>
              <p>
                We are committed to making essential medical products
                accessible to healthcare facilities while building a
                reputation for trust, reliability and long-term business
                partnerships.
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-brand-soft p-6 md:min-w-56 md:text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink">
              Head Office
            </p>
            <p className="font-heading mt-2 text-lg font-semibold text-ink">
              Lahore
            </p>
            <p className="mt-1 text-sm text-body">Punjab, Pakistan</p>
          </div>
        </div>
      </section>

      <section className="bg-soft py-16 md:py-20">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-line bg-white p-7 md:p-9">
            <h2 className="font-heading text-2xl font-semibold text-ink">
              Our Vision
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-body">
              To become a trusted and recognized name in Pakistan&apos;s
              healthcare industry by providing quality medical products,
              dependable services and innovative healthcare solutions.
            </p>
          </article>
          <article className="rounded-2xl border border-line bg-white p-7 md:p-9">
            <h2 className="font-heading text-2xl font-semibold text-ink">
              Our Mission
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-body">
              To deliver reliable medical devices and healthcare consumables to
              hospitals, clinics and healthcare professionals through
              responsible sourcing, efficient distribution, competitive pricing
              and professional customer support.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-body">
              We aim to develop lasting partnerships with leading manufacturers
              and contribute to the advancement of healthcare services in
              Pakistan.
            </p>
          </article>
        </div>
      </section>

      <section className="container-x py-16 md:py-20">
        <SectionHeading
          title="Our Core Business Areas"
          subtitle="Healthcare supply and distribution focused on the needs of our market"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {businessAreas.map((area, index) => (
            <article
              key={area.title}
              className="rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-ink/20 hover:shadow-xl hover:shadow-brand-ink/5"
            >
              <span className="font-heading flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-sm font-semibold text-brand-ink">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-heading mt-5 text-lg font-semibold text-ink">
                {area.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
                {area.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-soft py-16 md:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              title="Our Product Portfolio"
              subtitle="Products we intend to supply and distribute"
            />
            <BulletList items={portfolio} />
            <p className="mt-6 text-sm leading-relaxed text-body">
              Product availability and supply are subject to manufacturer
              agreements, applicable approvals and regulatory requirements.
            </p>
          </div>
          <div className="rounded-3xl bg-brand-deep p-7 text-white md:p-10">
            <h2 className="font-heading text-2xl font-semibold">
              Quality Commitment
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-white/75">
              <p>
                At Medbreath, quality and patient safety are important
                considerations in our product sourcing and business operations.
              </p>
              <p>
                We aim to work with responsible manufacturers, review relevant
                product documentation and support compliance with applicable
                standards and regulatory requirements.
              </p>
              <p>
                We are committed to transparency in our business dealings and
                to prioritizing product reliability, traceability and customer
                satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16 md:py-20">
        <SectionHeading
          title="Why Choose Medbreath?"
          subtitle="Building a dependable healthcare supply business through service and partnership"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <article
              key={reason.title}
              className="rounded-2xl border border-line bg-white p-6"
            >
              <span className="font-heading flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-sm font-semibold text-brand-ink">
                {index + 1}
              </span>
              <h3 className="font-heading mt-4 text-base font-semibold text-ink">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
                {reason.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-soft py-16 md:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              title="Our Customers & Business Partners"
              subtitle="We aim to serve healthcare organizations throughout Pakistan"
            />
            <BulletList items={customers} />
          </div>
          <div className="space-y-8">
            <article>
              <h2 className="font-heading text-2xl font-semibold text-ink">
                Our Business Approach
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-body">
                We believe successful healthcare supply depends on trust,
                product quality, competitive pricing and dependable service.
                Our approach focuses on understanding customer needs, sourcing
                suitable products, maintaining professional supplier
                relationships and developing a distribution network that
                supports Pakistan&apos;s healthcare sector.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-body">
                We also seek opportunities to collaborate with international
                manufacturers interested in entering or expanding within the
                Pakistani market.
              </p>
            </article>
            <article className="border-t border-line pt-7">
              <h2 className="font-heading text-2xl font-semibold text-ink">
                Our Commitment to the Future
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-body">
                Medbreath (Private) Limited is committed to building a
                sustainable healthcare business through continuous improvement,
                responsible product sourcing and strategic partnerships. As we
                grow, our goal is to expand our product range, strengthen our
                distribution capabilities and become a dependable partner for
                healthcare providers and medical-product manufacturers.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="container-x py-16 md:py-20">
        <div className="rounded-3xl bg-brand-deep px-7 py-10 text-white md:px-12 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-medium text-accent">Contact Us</p>
              <h2 className="font-heading mt-2 text-2xl font-semibold md:text-3xl">
                Medbreath (Private) Limited
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Lahore, Punjab, Pakistan
              </p>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75">
                Business inquiries: Medical Devices · Respiratory Care ·
                Anesthesia Consumables · Medical Disposables · Import &
                Distribution
              </p>
            </div>
            <div className="space-y-3 text-sm">
              <a
                href="tel:+923033042000"
                className="block text-white transition-colors hover:text-accent"
              >
                Phone / WhatsApp: +92 303 3042000
              </a>
              <a
                href="mailto:info@medbreath.co"
                className="block text-white transition-colors hover:text-accent"
              >
                info@medbreath.co
              </a>
              <a
                href="https://medbreath.co/"
                className="block text-white transition-colors hover:text-accent"
              >
                https://medbreath.co/
              </a>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-heading text-lg font-medium">
              Your Trusted Partner in Medical Supplies & Healthcare Solutions
            </p>
            <Link
              href="/contact"
              className="inline-flex w-fit items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-deep transition-colors hover:bg-brand-dark"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
