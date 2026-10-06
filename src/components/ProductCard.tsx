import Link from "next/link";
import type { Product } from "@/lib/data";
import { productHref } from "@/lib/data";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={productHref(product)}
      className="product-card group relative block overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-ink/20 hover:shadow-xl hover:shadow-brand-ink/5"
    >
      <div className="relative aspect-square overflow-hidden bg-white p-6">
        {product.thumbnail && (
          <img
            src={product.thumbnail}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="border-t border-line px-4 py-5 text-center">
        <h3 className="font-heading line-clamp-2 min-h-[42px] text-[15px] font-semibold text-ink transition-colors group-hover:text-brand-ink">
          {product.name}
        </h3>
        <p className="mt-1.5 text-xs uppercase tracking-wide text-body">
          {product.category}
        </p>
      </div>
    </Link>
  );
}
