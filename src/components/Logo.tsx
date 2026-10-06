import Link from "next/link";
import { site } from "@/data/site";

export default function Logo({
  className = "",
  height = 44,
  light = false,
}: {
  className?: string;
  height?: number;
  light?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`flex shrink-0 items-center ${className}`}
      aria-label={site.legalName}
      style={{ height }}
    >
      <img
        src={light ? "/logo-light.png" : "/logo.png"}
        alt={site.legalName}
        width={400}
        height={200}
        style={{ height: "100%", width: "auto" }}
        className="object-contain object-left"
      />
    </Link>
  );
}
