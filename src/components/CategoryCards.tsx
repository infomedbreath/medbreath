import Link from "next/link";
import { getCategories, getProducts } from "@/lib/content-store";

export default async function CategoryCards() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <section className="container-x py-20">
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
        {categories.map((c) => {
          const sample = products.find((p) => p.categorySlug === c.slug);
          return (
            <Link
              key={c.slug}
              href={`/products/${c.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
            >
              {c.image && (
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-brand-deep/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-center">
                {sample && (
                  <p className="text-xs text-white/70">{sample.name}</p>
                )}
                <h3 className="font-heading mt-1 text-lg font-medium text-white">
                  {c.name}
                </h3>
                <span className="mx-auto mt-3 block h-[2px] w-8 rounded-full bg-white/70 transition-all duration-300 group-hover:w-16" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
