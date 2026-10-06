"use client";

import { useState } from "react";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [""];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-line bg-white p-8">
        {list[active] && (
          <img
            src={list[active]}
            alt={name}
            className="h-full w-full object-contain"
          />
        )}
      </div>
      {list.length > 1 && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${name} image ${i + 1}`}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white p-1.5 transition-all ${
                i === active
                  ? "ring-2 ring-brand ring-offset-2"
                  : "ring-1 ring-line hover:ring-brand/40"
              }`}
            >
              <img
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
