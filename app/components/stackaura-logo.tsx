"use client";

import Image from "next/image";
import { useId } from "react";

export default function StackauraLogo({ size, className }: { size: number; className?: string }) {
  const filterId = `stackaura-logo-${useId().replace(/:/g, "")}`;

  return (
    <>
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            {/* Remove the dark backdrop while preserving the original lime pixels. */}
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 2 0 0 -0.4" />
          </filter>
        </defs>
      </svg>
      <Image src="/stackaura-logo.png" alt="StackAura" width={size} height={size}
        className={className} style={{ filter: `url(#${filterId})` }} priority />
    </>
  );
}
