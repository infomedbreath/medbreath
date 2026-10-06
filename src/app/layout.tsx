import type { Metadata, Viewport } from "next";
import { DM_Sans, Open_Sans } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/data/site";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName} - Disposable Medical Products & Consumables`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "disposable medical products",
    "medical consumables",
    "oxygen mask",
    "endotracheal tube",
    "foley catheter",
    "infusion set",
    site.name,
  ],
  openGraph: {
    type: "website",
    siteName: site.legalName,
    title: `${site.legalName} - Disposable Medical Products & Consumables`,
    description: site.description,
    url: site.url,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full ${openSans.variable} ${dmSans.variable}`}
    >
      <body className="flex min-h-full flex-col bg-white font-sans antialiased">
        <TopBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
