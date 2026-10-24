"use client";

import {
  motion,
  useReducedMotion,
  useInView,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
  animate,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Fade/slide reveal on scroll — the shared motion primitive for v2. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Staggered children on scroll (pair with <StaggerItem>). */
export function Stagger({
  children,
  className,
  delay = 0,
  step = 0.07,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  step?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once, margin: "-60px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: step, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 16,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? {} : { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Masked line-by-line reveal for display headlines. Server-renderable content, client animation. */
export function MaskedLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.08,
  as: Tag = "span",
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2";
}) {
  const reduce = useReducedMotion();
  return (
    <Tag className={cn("block", className)}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={cn("block", lineClassName)}
            initial={reduce ? false : { y: "108%" }}
            animate={reduce ? undefined : { y: "0%" }}
            transition={{ duration: 0.9, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Number count-up when scrolled into view (respects reduced motion). */
export function CountUp({
  to,
  duration = 0.55,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} className={cn("tnum", className)}>
      {prefix}
      {value.toLocaleString("ko-KR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/** Subtle floating loop for hero objects. */
export function Float({
  children,
  className,
  distance = 6,
  duration = 7,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -distance, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/** Thin scroll-progress line (fixed under the header). */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.4 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-16 z-40 h-px origin-left bg-signal/80"
    />
  );
}

/** Hover tilt for artifact cards (pointer devices only; disabled for reduced motion). */
export function TiltCard({
  children,
  className,
  max = 5,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 180, damping: 22 });
  const sy = useSpring(ry, { stiffness: 180, damping: 22 });
  const rotateX = useTransform(sx, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sy, [-0.5, 0.5], [-max, max]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || e.pointerType === "touch") return;
        const r = el.getBoundingClientRect();
        ry.set((e.clientX - r.left) / r.width - 0.5);
        rx.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
