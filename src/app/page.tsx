import Link from "next/link";
import Hero from "@/components/Hero";
import CategoryCards from "@/components/CategoryCards";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import NewsCard from "@/components/NewsCard";
import { getProducts, getNews, getCategories } from "@/lib/content-store";
import { site } from "@/data/site";

// The catalogue is editable from the admin panel, so this page is rendered per
// request rather than baked at build time.
export const dynamic = "force-dynamic";

// The hero uses drawn artwork rather than photography, so a slide only needs
// copy and a destination.
const heroSlides = [
  {
    title: "Disposable Medical Products & Consumables",
    subtitle: "MedBreath Medical",
    href: "/products",
  },
  {
    title: "Respiratory & Anesthesia Solutions",
    subtitle: "Reliable manufacturer",
    href: "/products/respiratory",
  },
  {
    title: "Urology & Infusion Disposables",
    subtitle: "ISO 13485 · MDR CE · FDA",
    href: "/products/urology",
  },
];

const features = [
  { title: "Certified Quality", text: "FDA, ISO 13485, MDR CE and ANVISA certified products." },
  { title: "OEM & ODM", text: "Custom branding and private label manufacturing." },
  { title: "Global Export", text: "Serving hospitals and distributors worldwide." },
  { title: "Factory Direct", text: "Competitive pricing straight from the source." },
];

export default async function HomePage() {
  const [products, news, categories] = await Promise.all([
    getProducts(),
    getNews(),
    getCategories(),
  ]);

  const featuredProducts = products.slice(0, 8);
  const popularProducts = products.slice(8, 12);
  const latestNews = news.slice(0, 3);

  return (
    <>
      <Hero slides={heroSlides} />

      <CategoryCards />

      {/* Features */}
      <section className="bg-soft py-20">
        <div className="container-x grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-ink">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m20 6-11 11-5-5" />
                </svg>
              </span>
              <div>
                <h3 className="font-heading text-[15px] font-semibold text-ink">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-body">
                  {f.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommend products */}
      <section className="container-x py-20">
        <SectionHeading
          title="Recommend Products"
          subtitle="Popular disposable medical consumables from our catalog"
        />
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-block rounded-full border border-brand-ink px-8 py-3 text-sm font-medium text-brand-ink transition-colors hover:bg-brand hover:text-brand-deep"
          >
            View all products
          </Link>
        </div>
      </section>

      {/* Popular products */}
      <section className="bg-soft py-20">
        <div className="container-x">
          <SectionHeading
            title="Popular Products"
            subtitle="Best sellers trusted by healthcare providers"
          />
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {popularProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          {categories.slice(0, 4).map((c) => (
            <div key={c.slug} className="overflow-hidden rounded-2xl">
              {c.image && (
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              )}
            </div>
          ))}
        </div>
        <div>
          <SectionHeading
            align="left"
            title="About MedBreath Medical"
            subtitle="Established in 2019 · Jiangsu Province, China"
          />
          <div className="space-y-4 text-[15px] leading-relaxed text-body">
            <p>
              {site.legalName} is a company specializing in the production and
              sales of disposable medical products, dedicated to providing
              hospital and home care solutions.
            </p>
            <p>
              Our main product range includes urology, anesthesia, respiratory
              and other related consumables such as endotracheal tubes,
              laryngeal masks, oxygen masks, suction connection tubes, urinary
              catheters and stomach tubes.
            </p>
            <p>
              We have engineers with rich experience in rubber, plastic and
              mechanism as technical support, together with a group of trained
              and skilled employees.
            </p>
          </div>
          <Link
            href="/about"
            className="mt-8 inline-block rounded-full bg-brand px-8 py-3 text-sm font-medium text-brand-deep transition-colors hover:bg-brand-dark"
          >
            More about us
          </Link>
        </div>
      </section>

      {/* News */}
      <section className="bg-soft py-20">
        <div className="container-x">
          <SectionHeading
            title="News"
            subtitle="Latest company and industry updates"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {latestNews.map((n) => (
              <NewsCard key={n.slug} item={n} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/news"
              className="inline-block rounded-full border border-brand-ink px-8 py-3 text-sm font-medium text-brand-ink transition-colors hover:bg-brand hover:text-brand-deep"
            >
              All news
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
