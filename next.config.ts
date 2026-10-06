import type { NextConfig } from "next";
import products from "./src/data/products.json";
import news from "./src/data/news.json";

const categoryAliases: { source: string; destination: string }[] = [
  { source: "/Respiratory", destination: "/products/respiratory" },
  { source: "/Urology", destination: "/products/urology" },
  { source: "/Anesthesiology", destination: "/products/anesthesiology" },
  { source: "/PVC-Catheters", destination: "/products/pvc-catheters" },
  { source: "/PVC-catheters", destination: "/products/pvc-catheters" },
  { source: "/Infusion-system", destination: "/products/infusion-system" },
];

const staticRedirects = [
  { source: "/product", destination: "/products", permanent: true },
  { source: "/product.html", destination: "/products", permanent: true },
  { source: "/article", destination: "/news", permanent: true },
  { source: "/article.html", destination: "/news", permanent: true },
  { source: "/Company-news", destination: "/news/company", permanent: true },
  { source: "/Industry-news", destination: "/news/industry", permanent: true },
  { source: "/p-about.html", destination: "/about", permanent: true },
  { source: "/p-contact.html", destination: "/contact", permanent: true },
  {
    source: "/Honor-certificates.html",
    destination: "/honor-certificates",
    permanent: true,
  },
  ...categoryAliases.map((c) => ({ ...c, permanent: true })),
];

const productRedirects = products.map((p) => ({
  source: p.originalHref,
  destination: `/products/${p.categorySlug}/${p.slug}`,
  permanent: true,
}));

const newsRedirects = news.map((n) => ({
  source: n.originalHref,
  destination: `/news/${n.slug}`,
  permanent: true,
}));

const nextConfig: NextConfig = {
  async redirects() {
    return [...staticRedirects, ...productRedirects, ...newsRedirects];
  },
};

export default nextConfig;
