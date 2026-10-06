export type NavChild = { label: string; href: string };
export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export const site = {
  name: "MedBreath",
  legalName: "MedBreath Medical Co., Ltd.",
  domain: "medbreath.co",
  url: "https://www.medbreath.co",
  themeColor: "#3BB273",
  email: "info@medbreath.co",
  phone: "+92 303 3042000",
  phoneRaw: "+923033042000",
  whatsapp: "+92 303 3042000",
  contactPerson: "Mr. Zaigham Liaqat",
  address:
    "C6, 1st floor, Greenland housing Scheme, Lahore, Punjab, Pakistan",
  tagline: "Your trusted partner in medical equipment and respiratory care",
  description:
    "MedBreath supplies high-quality medical equipment, respiratory care devices, and hospital solutions worldwide.",
} as const;

export const nav: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "News",
    href: "/news",
  },
  {
    label: "Honor Certificates",
    href: "/honor-certificates",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];
