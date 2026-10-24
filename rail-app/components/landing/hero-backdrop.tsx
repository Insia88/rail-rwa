"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Very light hero parallax (0 → 40px) on the rail backdrop.
 * Overscanned vertically so the image never reveals an edge; static under reduced motion.
 */
export function HeroBackdrop({
  image,
  className,
}: {
  image: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const raw = useTransform(scrollY, [0, 900], [0, 40]);
  const y = useSpring(raw, { stiffness: 90, damping: 26, mass: 0.5 });

  return (
    <motion.div
      aria-hidden
      className={cn(
        "pointer-events-none absolute -inset-x-8 -top-14 -bottom-14 bg-cover bg-center",
        className,
      )}
      style={{ backgroundImage: `url(${image})`, y: reduce ? 0 : y }}
    />
  );
}
