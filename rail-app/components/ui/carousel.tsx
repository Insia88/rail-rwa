"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * RAIL carousel primitive — spring-driven, drag-to-swipe, auto-advance.
 * Used for the applicant passport reel. No external carousel dependency.
 */
export function Carousel<T>({
  items,
  render,
  className,
  ariaLabel = "캐러셀",
  autoMs = 5600,
  showControls = true,
}: {
  items: T[];
  render: (item: T, index: number) => ReactNode;
  className?: string;
  ariaLabel?: string;
  autoMs?: number;
  showControls?: boolean;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const count = items.length;
  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  useEffect(() => {
    if (reduce || paused || autoMs <= 0 || count < 2) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % count), autoMs);
    return () => window.clearTimeout(t);
  }, [index, paused, autoMs, reduce, count]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (!count) return null;

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(index + 1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(index - 1);
        }
      }}
      className={cn(
        "relative min-w-0 outline-none focus-visible:ring-1 focus-visible:ring-acid/60",
        className,
      )}
    >
      <div className="w-full min-w-0 overflow-hidden">
        <motion.div
          className={cn("flex w-full cursor-grab active:cursor-grabbing", dragging && "select-none")}
          animate={{ x: `${-index * 100}%` }}
          transition={
            reduce
              ? { duration: 0 }
              : dragging
                ? { type: "spring", stiffness: 220, damping: 30, mass: 0.9 }
                : { type: "spring", stiffness: 190, damping: 28, mass: 1 }
          }
          drag={reduce ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false);
            if (info.offset.x < -55) go(index + 1);
            else if (info.offset.x > 55) go(index - 1);
          }}
        >
          {items.map((item, i) => {
            const active = i === index;
            return (
              <motion.div
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${count}`}
                aria-hidden={!active}
                className="w-full shrink-0"
                animate={
                  reduce
                    ? undefined
                    : { opacity: active ? 1 : 0.38, scale: active ? 1 : 0.965, y: active ? 0 : 8 }
                }
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{ pointerEvents: active ? "auto" : "none" }}
              >
                {render(item, i)}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {showControls && count > 1 ? (
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1}번째 지원자로 이동`}
                aria-current={i === index}
                onClick={() => go(i)}
                className="group relative h-5 w-7 focus-visible:outline-none"
              >
                <span
                  className={cn(
                    "absolute left-0 top-1/2 h-px w-full -translate-y-1/2 transition-colors",
                    i === index ? "bg-cream" : "bg-cream/20 group-hover:bg-cream/40",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-signal transition-all duration-500",
                    i === index ? "w-full" : "w-0",
                  )}
                />
              </button>
            ))}
            <span className="ml-2 font-mono text-[10px] tracking-[0.18em] text-cream/40">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="이전 지원자"
              className="flex h-9 w-9 items-center justify-center border border-line-dark text-cream/60 transition-colors hover:border-cream/40 hover:text-cream"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
                <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="다음 지원자"
              className="flex h-9 w-9 items-center justify-center border border-line-dark text-cream/60 transition-colors hover:border-cream/40 hover:text-cream"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
                <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Small wrapper so carousels can announce slide changes to screen readers. */
export function CarouselLive({ label }: { label: string }) {
  return (
    <AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {label}
      </span>
    </AnimatePresence>
  );
}
