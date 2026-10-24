"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

/** 1px conic border trail that follows the pointer. No surface lift, no glow. */
const RING_STYLE: CSSProperties = {
  padding: "1px",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  maskComposite: "exclude",
} as CSSProperties;

export function BorderTrail({
  children,
  className,
  tone = "cream",
}: {
  children: ReactNode;
  className?: string;
  tone?: "cream" | "signal";
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [angle, setAngle] = useState(135);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const trail =
    tone === "signal"
      ? `conic-gradient(from ${angle - 32}deg, transparent 0deg, rgba(255,75,31,0.85) 34deg, rgba(255,75,31,0.14) 90deg, transparent 140deg)`
      : `conic-gradient(from ${angle - 32}deg, transparent 0deg, rgba(242,237,226,0.62) 34deg, rgba(242,237,226,0.1) 90deg, transparent 140deg)`;

  return (
    <div
      ref={ref}
      className={cn("group relative", className)}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onPointerMove={(event) => {
        const el = ref.current;
        if (!el || event.pointerType === "touch") return;
        const rect = el.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        setAngle((Math.atan2(dy, dx) * 180) / Math.PI);
      }}
    >
      {children}
      <span
        aria-hidden
        style={{ ...RING_STYLE, background: trail }}
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-[600ms] ease-out motion-reduce:hidden",
          active ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
