"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { CommandTrigger } from "@/components/site/command-trigger";
import { cn } from "@/lib/cn";

const KO_NAV = [
  { href: "/#run", label: "데모" },
  { href: "/#case", label: "사례" },
  { href: "/#passport", label: "여권" },
  { href: "/nitro", label: "For Hashed" },
];

const EN_NAV = [
  { href: "/en#run", label: "Demo" },
  { href: "/en#case", label: "Case" },
  { href: "/en#passport", label: "Passport" },
  { href: "/nitro", label: "For Hashed" },
];

const KO_MOBILE = [
  ...KO_NAV,
  { href: "/feedback", label: "피드백 루프" },
  { href: "/log", label: "빌드 로그" },
  { href: "/en", label: "English edition" },
];

const EN_MOBILE = [
  ...EN_NAV,
  { href: "/feedback", label: "Feedback loop" },
  { href: "/log", label: "Build log" },
  { href: "/", label: "한국어 에디션" },
];

function LangSwitch({ isEn, pathname }: { isEn: boolean; pathname: string }) {
  const rel = isEn ? pathname.replace(/^\/en/, "") || "/" : pathname;
  const koHref = rel;
  // Only routes with a real English mirror keep the path; others fall back to the EN hub.
  const enMirror = /^\/(underwrite|passport|market|agents)(\/|$)/.test(rel);
  const enHref = rel === "/" ? "/en" : enMirror ? `/en${rel}` : "/en";
  return (
    <div
      className="flex h-9 items-center border border-line-dark font-mono text-[10px] uppercase tracking-[0.1em]"
      aria-label="Language"
    >
      <Link
        href={koHref}
        aria-current={!isEn ? "page" : undefined}
        className={
          !isEn
            ? "flex h-full items-center bg-cream px-2.5 text-noir"
            : "flex h-full items-center px-2.5 text-cream/55 transition-colors hover:text-cream"
        }
      >
        KO
      </Link>
      <span className="h-4 w-px bg-line-dark" aria-hidden />
      <Link
        href={enHref}
        aria-current={isEn ? "page" : undefined}
        className={
          isEn
            ? "flex h-full items-center bg-cream px-2.5 text-noir"
            : "flex h-full items-center px-2.5 text-cream/55 transition-colors hover:text-cream"
        }
      >
        EN
      </Link>
    </div>
  );
}

export function Header() {
  const pathname = usePathname() || "/";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const nav = isEn ? EN_NAV : KO_NAV;
  const mobile = isEn ? EN_MOBILE : KO_MOBILE;
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line-darker bg-noir/95 text-cream backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <Logo inverse />
          <span className="hidden items-center gap-1.5 border-l border-line-dark pl-4 font-mono text-[9px] uppercase tracking-[0.18em] text-cream/50 lg:flex">
            <span className="h-1 w-1 rounded-full bg-verified" aria-hidden />
            {isEn ? "Seoul · Global" : "Seoul"}
          </span>
        </div>

        <nav aria-label={isEn ? "Main" : "주요 메뉴"} className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "transition-colors hover:text-cream",
                isEn
                  ? "font-mono text-[11px] uppercase tracking-[0.12em] text-cream/65"
                  : "text-[13px] font-medium tracking-[-0.01em] text-cream/70",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch isEn={isEn} pathname={pathname} />
          <CommandTrigger className="hidden h-9 items-center gap-1.5 border border-line-dark px-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cream/50 transition-colors hover:border-cream/30 hover:text-cream xl:flex" />
          <Button href="/underwrite" size="sm" variant="primary" className="hidden sm:inline-flex">
            {isEn ? "3-min demo" : "3분 데모"}
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={isEn ? "Menu" : "메뉴"}
            className="flex h-9 w-9 items-center justify-center border border-line-dark text-cream/70 transition-colors hover:text-cream md:hidden"
          >
            <span className="relative block h-3 w-4" aria-hidden>
              <span
                className={cn(
                  "absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-200",
                  open && "translate-y-[5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-[6px] h-px w-4 bg-current transition-opacity duration-200",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-[12px] h-px w-4 bg-current transition-transform duration-200",
                  open && "-translate-y-[5px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-line-dark bg-noir/98 px-5 pb-6 pt-3 backdrop-blur-xl md:hidden"
        >
          <nav aria-label={isEn ? "Mobile" : "모바일 메뉴"} className="flex flex-col">
            {mobile.map((n) => (
              <Link
                key={`${n.href}-${n.label}`}
                href={n.href}
                className="flex items-center justify-between border-b border-line-dark/70 py-3 text-[15px] font-medium text-cream/85 transition-colors hover:text-cream"
              >
                {n.label}
                <span aria-hidden className="font-mono text-[11px] text-cream/35">
                  →
                </span>
              </Link>
            ))}
          </nav>
          <Button href="/underwrite" size="sm" className="mt-4 w-full justify-center">
            {isEn ? "Run the 3-minute demo" : "3분 데모 시작"}
          </Button>
        </div>
      ) : null}
    </header>
  );
}
