import type { Metadata } from "next";
import Breadcrumbs, { PageBanner } from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Honor certificates",
  description:
    "MedBreath Medical certificates: MDR CE, ISO 13485 and manufacturer production license.",
};

const banner = "/images/42a8442c24ad.jpg";

const certificates = [
  {
    image: "/images/84c0f7ec6e84.jpg",
    name: "MedBreath Medical - MDR CE",
  },
  {
    image: "/images/8bdf52bceec6.jpg",
    name: "MedBreath Medical - ISO 13485",
  },
  {
    image: "/images/4f23bb0afa94.jpg",
    name: "MedBreath Medical - ISO 13485",
  },
  {
    image: "/images/88d317b6902d.jpg",
    name: "MedBreath Medical - Manufacturer Production License",
  },
];

export default function HonorCertificatesPage() {
  return (
    <>
      <PageBanner title="Honor certificates" image={banner} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "About us", href: "/about" },
          { label: "Honor certificates" },
        ]}
      />

      <section className="container-x py-20">
        <SectionHeading
          title="Our Certificates"
          subtitle="Quality and compliance recognized around the world"
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {certificates.map((c) => (
            <div
              key={c.name}
              className="group rounded-2xl border border-line bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-ink/20 hover:shadow-xl hover:shadow-brand-ink/5"
            >
              <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl bg-soft p-3">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="font-heading mt-5 text-center text-sm font-medium text-ink">
                {c.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
