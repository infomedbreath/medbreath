import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs, { PageBanner } from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About us",
  description:
    "MedBreath Medical Co., Ltd. specializes in the production and sales of disposable medical products for hospital and home care.",
};

const banner =
  "/images/42a8442c24ad.jpg";

const factoryImages = [
  "/images/bc06f40db29c.jpg",
  "/images/d712c799faa6.jpg",
  "/images/ab1ddd670d62.jpg",
  "/images/ba0bc7ca9d30.jpg",
];

const stats = [
  { value: "2019", label: "Established in Jiangsu" },
  { value: "33+", label: "Product models" },
  { value: "5", label: "Product categories" },
  { value: "40+", label: "Countries served" },
];

const values = [
  {
    title: "Design and service with heart",
    text: "Intimate, responsible service that puts the needs of healthcare providers and patients first.",
  },
  {
    title: "Quality you can trust",
    text: "Our products are FDA, ISO 13485, MDR CE and ANVISA certified for reliable performance.",
  },
  {
    title: "Experienced engineering",
    text: "Engineers with rich experience in rubber, plastic and mechanism support every product.",
  },
  {
    title: "Skilled workforce",
    text: "A group of trained and skilled employees ensures consistent manufacturing quality.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageBanner title="About us" image={banner} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About us" }]} />

      <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            title="Company Profile"
            subtitle={site.legalName}
          />
          <div className="space-y-4 text-[15px] leading-relaxed text-body">
            <p>
              {site.legalName} is a company specializing in the production and
              sales of disposable medical products, dedicated to providing
              hospital and home care solutions. It was established in Shanghai
              in 2011. {site.legalName} was established in July 2019 and is
              mainly engaged in the research and development, production and
              sales of medical consumables.
            </p>
            <p>
              It is located at Jiangxin Road, Jianghai Linkage Development Zone,
              Tongzhou Bay, Jiangsu Province, with a registered capital and a
              modern manufacturing base.
            </p>
            <p>
              The company&apos;s main product range includes urology,
              anesthesia, respiratory and other related products. Our main
              products are endotracheal tubes, reinforced endotracheal tubes,
              tracheotomy tubes, guide wires, laryngeal masks, oxygen masks,
              non-rebreathing masks, nasal oxygen tubes, nebulizer masks,
              suction connection tubes, urinary catheters, stomach tubes and
              more.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img
            src={factoryImages[0]}
            alt="MedBreath factory"
            className="col-span-2 aspect-[16/9] w-full rounded-2xl object-cover"
          />
          {factoryImages.slice(1).map((img, i) => (
            <img
              key={i}
              src={img}
              alt="MedBreath facility"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      </section>

      <section className="bg-brand py-16">
        <div className="container-x grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center text-brand-deep">
              <div className="font-heading text-4xl font-light">{s.value}</div>
              <div className="mt-2 text-sm tracking-wide text-brand-deep/70">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-20">
        <SectionHeading
          title="Why Choose Us"
          subtitle="Committed to quality disposable medical products"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <div
              key={v.title}
              className="rounded-2xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-ink/20 hover:shadow-xl hover:shadow-brand-ink/5"
            >
              <span className="font-heading flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-lg font-semibold text-brand-ink">
                {i + 1}
              </span>
              <h3 className="font-heading mt-5 text-[16px] font-semibold text-ink">
                {v.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-body">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-soft py-20">
        <div className="container-x text-center">
          <SectionHeading
            title="Certifications"
            subtitle="Recognized by international regulatory and quality standards"
          />
          <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-body">
            Our products are FDA, ISO 13485, MDR CE and ANVISA certified. We
            continuously invest in quality management to meet the requirements
            of hospitals and distributors around the world.
          </p>
          <Link
            href="/honor-certificates"
            className="mt-8 inline-block rounded-full bg-brand px-8 py-3 text-sm font-medium text-brand-deep transition-colors hover:bg-brand-dark"
          >
            View certificates
          </Link>
        </div>
      </section>
    </>
  );
}
