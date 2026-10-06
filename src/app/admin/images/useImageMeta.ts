"use client";

import { useEffect, useState } from "react";
import type { ImageMeta } from "@/lib/image-meta";

/**
 * Loads the image library once and exposes a path -> metadata lookup, so
 * forms can show each image's pixel size and file size without re-uploading.
 */
export function useImageMeta(): {
  meta: Map<string, ImageMeta>;
  loading: boolean;
} {
  const [meta, setMeta] = useState<Map<string, ImageMeta>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/images")
      .then((res) => (res.ok ? res.json() : []))
      .then((images: ImageMeta[]) => {
        if (cancelled) return;
        setMeta(new Map(images.map((image) => [image.path, image])));
      })
      .catch(() => {
        /* Sizes are supplementary - a failure must not break the form. */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { meta, loading };
}