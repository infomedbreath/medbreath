# MedBreath — Website

A Next.js clone of the Hitec Medical website, rebranded to **MedBreath**. Pages, content,
products, images and layout match the source site; only the brand (HiteCare / Hitec /
hitecmed.com → MedBreath / medbreath.co) has changed.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS v4

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start    # serves the built site (default port 3000)
```

Lint:

```bash
npm run lint
```

## Project structure

```
src/
  app/                          routes (App Router)
    page.tsx                    home
    products/                   /products, /products/[category], /products/[category]/[product]
    news/                       /news, /news/company, /news/industry, /news/[slug]
    about/                      /about
    contact/                    /contact
    honor-certificates/         /honor-certificates
    sitemap.ts                  /sitemap.xml
    robots.ts                   /robots.txt
  components/                   shared UI (Header, Footer, ProductCard, NewsCard, ...)
  data/
    site.ts                     brand, contact and navigation config
    products.json               33 products (5 categories)
    categories.json             5 categories
    news.json                   44 news articles
    image-map.json              original remote URL -> local image path
  lib/
    data.ts                     typed data loaders and helpers
    images.ts                   localImage() and rewriteContent()
public/images/                  all image assets downloaded locally
```

## Rebranding

Content and remote URLs were rewritten at build time:

- `Hitecare` / `Hitec` / `hitecmed.com` → `MedBreath` / `medbreath.co`
- Contact email → `info@medbreath.co`
- All remote image URLs are mapped to local files in `public/images` via `image-map.json`.

To change brand details, edit `src/data/site.ts`.

## Legacy URL redirects

`next.config.ts` permanently redirects the original Hitec URLs to the new routes, for example:

| Original | New |
| --- | --- |
| `/product` | `/products` |
| `/Respiratory` | `/products/respiratory` |
| `/product-item-2.html` | `/products/respiratory/oxygen-mask` |
| `/article.html` | `/news` |
| `/Company-news` | `/news/company` |
| `/p-about.html` | `/about` |
| `/p-contact.html` | `/contact` |
| `/Honor-certificates.html` | `/honor-certificates` |
| `/<news-slug>.html` | `/news/<news-slug>` |

## Deploying to medbreath.co

1. Push this repository to your Git host.
2. Import the project into your hosting provider (Vercel is a good fit for Next.js).
3. Set the production domain to `medbreath.co` and `www.medbreath.co`.
4. Point your DNS records at the host as instructed by the provider.
5. Build command: `npm run build`. Start command: `npm run start` (or use the
   provider's managed Next.js runtime).
6. `site.url` in `src/data/site.ts` is already `https://www.medbreath.co`; update it if you
   prefer the apex domain for canonical URLs and the sitemap.
