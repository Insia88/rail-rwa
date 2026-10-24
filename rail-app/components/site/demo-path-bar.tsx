"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Sticky demo-path bar — makes the product flow legible at a glance:
 * 1 Case → 2 Underwrite → 3 Passport. Visible only on demo routes.
 */
export function DemoPathBar() {
  const pathname = usePathname() || "/";
  const [hidden, setHidden] = useState(false);

  const isEn = pathname.startsWith("/en");
  const rel = isEn ? pathname.slice(3) || "/" : pathname;
  const isDemo = /^\/(underwrite|passport)/.test(rel);
  if (!isDemo || hidden) return null;

  const step = rel.startsWith("/passport") ? 3 : rel === "/underwrite" ? 1 : 2;

  const steps = [
    { n: 1, label: isEn ? "Case" : "사례", href: isEn ? "/en#case" : "/#case" },
    { n: 2, label: isEn ? "Underwrite" : "심사", href: isEn ? "/en/underwrite" : "/underwrite" },
    {
      n: 3,
      label: isEn ? "Passport" : "여권",
      href: isEn ? "/en/passport/hanbit" : "/passport/hanbit",
    },
  ];
  const next = step < 3 ? steps[step] : null;
  const nextHref = step === 3 ? (isEn ? "/en/market" : "/market") : next?.href;
  const nextLabel =
    step === 3 ? (isEn ? "Live market" : "라이브 시장") : next?.label ?? "";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 print:hidden">
      <div className="pointer-events-auto flex max-w-full items-center gap-2 border border-line-dark bg-noir/95 px-2.5 py-1.5 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:gap-3 sm:px-3">
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-cream/35 sm:inline">
          {isEn ? "Demo path" : "데모 경로"}
        </span>
        {steps.map((s) => {
          const active = s.n === step;
          const done = s.n < step;
          return (
            <Link
              key={s.n}
              href={s.href}
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex items-center gap-1.5 px-1.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors",
                active
                  ? "text-cream"
                  : done
                    ? "text-acid/80 hover:text-acid"
                    : "text-cream/40 hover:text-cream/75",
              )}
            >
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center border text-[8px]",
                  active
                    ? "border-signal bg-signal text-noir"
                    : done
                      ? "border-acid/50 text-acid"
                      : "border-cream/20 text-cream/40",
                )}
              >
                {s.n}
              </span>
              <span className={cn("hidden xs:inline sm:inline", active && "inline")}>{s.label}</span>
            </Link>
          );
        })}
        {nextHref ? (
          <Link
            href={nextHref}
            className="ml-1 flex items-center gap-1.5 border border-signal/60 bg-signal/15 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-cream transition-colors hover:bg-signal hover:text-noir"
          >
            <span className="hidden sm:inline">{isEn ? "Next" : "다음"}</span>
            {nextLabel}
            <span aria-hidden>→</span>
          </Link>
        ) : null}
        <button
          type="button"
          aria-label={isEn ? "Hide demo path" : "데모 경로 숨기기"}
          onClick={() => setHidden(true)}
          className="ml-1 px-1 font-mono text-[12px] leading-none text-cream/30 transition-colors hover:text-cream"
        >
          ×
        </button>
      </div>
    </div>
  );
}
