"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/logo";

import { cn } from "@/lib/cn";

const KO_NAV = [
  { href: "/#demo", label: "데모" },
  { href: "/#case", label: "사례" },
  { href: "/#passport", label: "여권" },
  { href: "/nitro", label: "For Hashed" },
];

const EN_NAV = [
  { href: "/en#demo", label: "Demo" },
  { href: "/en#case", label: "Case" },
  { href: "/en#passport", label: "Passport" },
  { href: "/nitro", label: "For Hashed" },
];

const KO_MOBILE = [
  ...KO_NAV,
  { href: "/feedback", label: "피드백 루프" },
  { href: "/log", label: "빌드 로그" },
  { href: "/en", label: "English" },
];

const EN_MOBILE = [
  ...EN_NAV,
  { href: "/feedback", label: "Feedback loop" },
  { href: "/log", label: "Build log" },
  { href: "/", label: "한국어" },
];

function LangSwitch({ isEn, pathname }: { isEn: boolean; pathname: string }) {
  const rel = isEn ? pathname.replace(/^\/en/, "") || "/" : pathname;
  const koHref = rel;
  const enMirror = /^\/(underwrite|passport|market|agents)(\/|$)/.test(rel);
  const enHref = rel === "/" ? "/en" : enMirror ? `/en${rel}` : "/en";
  return (
    <div className="flex h-9 items-center rounded-full bg-black/[0.04] p-0.5 text-[12px] font-medium">
      <Link
        href={koHref}
        aria-current={!isEn ? "page" : undefined}
        className={cn(
          "flex h-8 items-center rounded-full px-3 transition-colors",
          !isEn ? "bg-surface text-graphite shadow-sm" : "text-graphite-2 hover:text-graphite",
        )}
      >
        KO
      </Link>
      <Link
        href={enHref}
        aria-current={isEn ? "page" : undefined}
        className={cn(
          "flex h-8 items-center rounded-full px-3 transition-colors",
          isEn ? "bg-surface text-graphite shadow-sm" : "text-graphite-2 hover:text-graphite",
        )}
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-porcelain/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between gap-4 px-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-5">
          <Logo inverse={false} />
          <span className="hidden text-[12px] font-medium text-graphite-3 lg:block">
            Credit infrastructure · Seoul
          </span>
        </div>

        <nav aria-label={isEn ? "Main" : "주요 메뉴"} className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-[13px] font-medium text-graphite-2 transition-colors hover:text-graphite"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch isEn={isEn} pathname={pathname} />

          <Link
            href="/underwrite"
            className="hidden h-9 items-center rounded-full bg-graphite px-4 text-[13px] font-semibold text-white transition-opacity hover:opacity-85 sm:inline-flex"
          >
            {isEn ? "Run the demo" : "3분 데모"}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={isEn ? "Menu" : "메뉴"}
            className="flex h-9 w-9 items-center justify-center rounded-full text-graphite transition-colors hover:bg-black/[0.04] md:hidden"
          >
            <span className="relative block h-3 w-4" aria-hidden>
              <span
                className={cn(
                  "absolute left-0 top-0 h-[1.5px] w-4 rounded bg-current transition-transform duration-200",
                  open && "translate-y-[5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-[6px] h-[1.5px] w-4 rounded bg-current transition-opacity duration-200",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-[12px] h-[1.5px] w-4 rounded bg-current transition-transform duration-200",
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
          className="border-t border-hairline bg-porcelain px-5 pb-6 pt-2 md:hidden"
        >
          <nav aria-label={isEn ? "Mobile" : "모바일 메뉴"} className="flex flex-col">
            {mobile.map((n) => (
              <Link
                key={`${n.href}-${n.label}`}
                href={n.href}
                className="flex items-center justify-between border-b border-hairline py-3.5 text-[16px] font-medium text-graphite"
              >
                {n.label}
                <span aria-hidden className="text-graphite-3">→</span>
              </Link>
            ))}
          </nav>
          <Link
            href="/underwrite"
            className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-graphite text-[14px] font-semibold text-white"
          >
            {isEn ? "Run the 3-minute demo" : "3분 데모 시작"}
          </Link>
        </div>
      ) : null}
    </header>
  );
}
