"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MASK_STROKES } from "@/lib/hero-mask";

type Slide = { title: string; subtitle: string; href: string };

/**
 * The product families highlighted around the hero artwork. Each label repeats
 * a category that is already listed further down the page, so the artwork is
 * decorative and hidden from assistive technology. `delay` staggers the pop-in
 * so the chips do not all appear at once.
 */
const familyBadges = [
  {
    position: "left-0 top-[6%]",
    icon: "lungs",
    label: "Respiratory",
    delay: "1.6s",
  },
  {
    position: "right-0 top-[16%]",
    icon: "airflow",
    label: "Anesthesiology",
    delay: "2s",
  },
  {
    position: "left-[8%] bottom-[12%]",
    icon: "droplet",
    label: "Urology",
    delay: "2.4s",
  },
  {
    position: "right-[8%] bottom-[4%]",
    icon: "iv",
    label: "Infusion",
    delay: "2.8s",
  },
] as const;

export default function Hero({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(id);
  }, [count]);

  if (count === 0) return null;

  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);

  return (
    <section className="relative h-[380px] overflow-hidden bg-brand-deep md:h-[500px] lg:h-[620px]">
      {/* Soft brand lighting, replacing the photographic background. Kept faint
          on purpose: a stronger glow washes out the hero line drawn over it. */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute -top-28 right-[-6%] h-[540px] w-[540px] rounded-full bg-brand/20 blur-[110px]" />
        <div className="absolute bottom-[-24%] left-[-12%] h-[440px] w-[440px] rounded-full bg-brand-ink/25 blur-[120px]" />
      </div>

      <div className="container-x relative flex h-full items-center gap-8">
        {/* Copy. Every slide is pinned to the same cell with `absolute inset-0`
            so only the active one is opaque but none of them add height. Leaving
            them in normal flow stacks all three panels, which overflows the
            fixed-height hero and shoves the artwork off screen. */}
        <div className="relative z-20 h-full w-full shrink-0 md:w-[52%] lg:w-[50%]">
          {slides.map((s, i) => (
            <div
              key={i}
              aria-hidden={i !== index}
              className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ${
                i === index
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-4 opacity-0"
              }`}
            >
              <p className="mb-3 text-sm font-medium tracking-[3px] text-white/75 uppercase">
                {s.subtitle}
              </p>
              <h1 className="font-heading text-3xl font-light leading-tight tracking-tight text-white md:text-5xl">
                {s.title}
              </h1>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={s.href}
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-medium text-brand-ink transition-colors hover:bg-white/90"
                >
                  Learn more
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/70 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-brand-ink"
                >
                  Request a Quote
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mask artwork, drawn as an outline sketch. Shown from md (768px) up, beside
            the copy rather than behind it. z-10 plus the copy's z-20 keeps the
            strokes above the blurred background glows regardless of paint order.

            The source illustration in public/mask.svg is a solid black drawing;
            re-using it as stroke data is what lets it animate in. The nested
            group reproduces its own transform, which flips the artwork upright
            inside the viewBox — the coordinate range runs to roughly 2600, and
            that scale(0.1) brings it back to the 260x280 frame. */}
        <div
          aria-hidden="true"
          className="relative z-10 hidden h-full flex-1 items-center justify-center md:flex"
        >
          <svg
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            className="relative z-10 h-full max-h-[470px] w-full"
          >
            {/* Concentric rings stay dim — depth behind the mask. Removed bottom/outer decorative rings per request. */}
            {/* Rings removed: drawing only mask now */}

            <g transform="translate(0 512) scale(0.1 -0.1)">
              {MASK_STROKES.map((stroke, i) => (
                <path
                  key={i}
                  d={stroke.d}
                  className={stroke.major ? "hero-mask-major" : "hero-mask-fine"}
                  style={{
                    strokeDasharray: stroke.dash,
                    strokeDashoffset: stroke.dash,
                    animationDelay: stroke.delay,
                    animationDuration: stroke.duration,
                  }}
                />
              ))}
            </g>

            {/* Single accent node, kept at the top of the panel. */}
            {/* Dot removed per request */}
          </svg>

          {familyBadges.map((badge) => (
            <span
              key={badge.label}
              style={{ animationDelay: badge.delay }}
              className={`hero-chip ${badge.position}`}
            >
              <BadgeIcon name={badge.icon} />
              {badge.label}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white hover:text-brand-ink md:flex"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white hover:text-brand-ink md:flex"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function BadgeIcon({ name }: { name: (typeof familyBadges)[number]["icon"] }) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-4 w-4 shrink-0",
  };

  switch (name) {
    // Lungs, for the respiratory family.
    case "lungs":
      return (
        <svg {...shared}>
          <path d="M12 4v8" />
          <path d="M12 12c0-2.2-1.5-4-3.3-4S5.4 9.8 4.9 11.6C4.5 13.4 4.5 15 4.5 16.2c0 1.3.9 2.3 2.2 2.3 1.8 0 3.3-1.5 3.3-3.4" />
          <path d="M12 12c0-2.2 1.5-4 3.3-4s3.3 1.8 3.8 3.6c.4 1.8.4 3.4.4 4.6 0 1.3-.9 2.3-2.2 2.3-1.8 0-3.3-1.5-3.3-3.4" />
        </svg>
      );

    // Airflow, for ventilation and anesthesia.
    case "airflow":
      return (
        <svg {...shared}>
          <path d="M3 8h9a3 3 0 1 0-3-3" />
          <path d="M3 12h13a3 3 0 1 1-3 3" />
          <path d="M3 16h7" />
        </svg>
      );

    // A droplet, standing in for urology fluids.
    case "droplet":
      return (
        <svg {...shared}>
          <path d="M12 3s6 6.2 6 10.2A6 6 0 0 1 6 13.2C6 9.2 12 3 12 3Z" />
        </svg>
      );

    // An IV bag, for the infusion system.
    case "iv":
      return (
        <svg {...shared}>
          <path d="M7 3h10a2 2 0 0 1 2 2v11a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V5a2 2 0 0 1 2-2Z" />
          <path d="M5 10h14" />
          <path d="M12 13v2" />
          <path d="M9.5 18.5a2.5 2.5 0 0 1 5 0" />
        </svg>
      );
  }
}