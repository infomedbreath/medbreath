export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  light = false,
}: {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  const isCenter = align === "center";
  return (
    <div className={`mb-12 ${isCenter ? "text-center" : "text-left"}`}>
      <h2
        className={`font-heading text-[26px] font-semibold capitalize tracking-tight md:text-[34px] ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-sm ${light ? "text-white/70" : "text-body"}`}>
          {subtitle}
        </p>
      )}
      <span
        className={`mt-5 block h-[2px] w-12 rounded bg-brand-ink ${
          isCenter ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
