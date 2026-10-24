"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

type Item = {
  id: string;
  group: "APPLICANTS" | "PAGES" | "DATA";
  label: string;
  hint: string;
  href: string;
};

const ITEMS: Item[] = [
  { id: "hanbit", group: "APPLICANTS", label: "한빛전자 — 수출 중소기업", hint: "B · 1.8억 · 8.55%", href: "/underwrite/hanbit" },
  { id: "kimfreelance", group: "APPLICANTS", label: "김도현 — 프리랜서 개발자", hint: "B+ · 900만 · 8.12%", href: "/underwrite/kimfreelance" },
  { id: "fiberlogic", group: "APPLICANTS", label: "파이버로직 — 딥테크 / IP", hint: "C+ · 5,400만 · 10.18%", href: "/underwrite/fiberlogic" },
  { id: "sejong", group: "APPLICANTS", label: "세종트레이딩 — 중복 담보 거절", hint: "DECLINED · E-DUP-PLEDGE", href: "/underwrite/sejong" },
  { id: "desk", group: "PAGES", label: "지원자 데스크", hint: "APPLICANT DESK", href: "/underwrite" },
  { id: "passport", group: "PAGES", label: "한빛전자 신용 여권", hint: "CREDIT PASSPORT", href: "/passport/hanbit" },
  { id: "market", group: "DATA", label: "RWA 시장 기상도", hint: "LIVE FEEDS", href: "/market" },
  { id: "agents", group: "DATA", label: "에이전트 팀 · 제작 기록", hint: "BUILD LOG", href: "/agents" },
  { id: "nitro", group: "PAGES", label: "For Hashed · Nitro 메모", hint: "SIMON KIM MEMO", href: "/nitro" },
  { id: "feedback", group: "PAGES", label: "피드백 루프", hint: "48H TRIAGE · 7D SHIP", href: "/feedback" },
  { id: "log", group: "PAGES", label: "빌드 로그", hint: "PUBLIC LOG", href: "/log" },
  { id: "en", group: "PAGES", label: "English edition", hint: "GLOBAL", href: "/en" },
  { id: "home", group: "PAGES", label: "홈 — RAIL", hint: "MANIFESTO", href: "/" },
];

const GROUP_ORDER: Item["group"][] = ["APPLICANTS", "PAGES", "DATA"];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = q
      ? ITEMS.filter(
          (it) =>
            it.label.toLowerCase().includes(q) ||
            it.hint.toLowerCase().includes(q) ||
            it.group.toLowerCase().includes(q),
        )
      : ITEMS;
    return GROUP_ORDER.map((g) => ({ group: g, items: items.filter((it) => it.group === g) })).filter(
      (g) => g.items.length > 0,
    );
  }, [query]);

  const flat = useMemo(() => filtered.flatMap((g) => g.items), [filtered]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") close();
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("rail:open-command", onOpen as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("rail:open-command", onOpen as EventListener);
    };
  }, [close]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  const go = (item: Item) => {
    close();
    router.push(item.href);
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center bg-noir/80 px-4 pt-[12vh] backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="RAIL 커맨드 팔레트"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="w-full max-w-xl border border-line-dark bg-noir-2 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-3 border-b border-line-dark px-4 py-3">
          <span className="font-mono text-[10px] tracking-[0.18em] text-acid">RAIL</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((v) => (flat.length ? (v + 1) % flat.length : 0));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((v) => (flat.length ? (v - 1 + flat.length) % flat.length : 0));
              }
              if (e.key === "Enter" && flat[active]) go(flat[active]);
            }}
            placeholder="지원자, 페이지, 데이터 검색"
            aria-label="검색"
            className="w-full bg-transparent text-[15px] text-cream placeholder:text-cream/30 focus:outline-none"
          />
          <span className="hidden border border-line-dark px-1.5 py-0.5 font-mono text-[9px] text-cream/40 sm:block">
            ESC
          </span>
        </div>

        <div className="max-h-[52vh] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center font-mono text-[11px] text-cream/40">
              NO MATCH · 다른 키워드로 검색
            </p>
          ) : (
            filtered.map((group) => (
              <div key={group.group} className="mb-2">
                <p className="px-4 pb-1 pt-2 font-mono text-[9px] tracking-[0.22em] text-cream/35">
                  {group.group}
                </p>
                {group.items.map((item) => {
                  const idx = flat.findIndex((f) => f.id === item.id);
                  const isActive = idx === active;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => go(item)}
                      className={cn(
                        "flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left transition-colors",
                        isActive ? "bg-signal/14 text-cream" : "text-cream/70 hover:bg-white/5",
                      )}
                    >
                      <span className="flex items-center gap-2.5 text-[13px]">
                        {isActive ? <span className="h-1 w-1 rounded-full bg-signal" aria-hidden /> : null}
                        {item.label}
                      </span>
                      <span className="font-mono text-[9px] tracking-[0.14em] text-cream/35">
                        {item.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line-dark px-4 py-2 font-mono text-[9px] tracking-[0.12em] text-cream/35">
          <span>↑↓ 이동 · ↵ 열기 · ESC 닫기</span>
          <span className="text-acid/70">⌘K</span>
        </div>
      </div>
    </div>
  );
}
