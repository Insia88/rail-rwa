"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Locale = "ko" | "en";

/**
 * Passport toolbar: one primary action (one-page PDF), JSON secondary, copy and
 * share behind a quiet overflow. Light surface, ink pill primary.
 */
export function PassportToolbar({
  shareUrl,
  data,
  filename,
  shareTitle,
  shareText,
  locale = "ko",
  className,
}: {
  shareUrl: string;
  data: unknown;
  filename: string;
  shareTitle: string;
  shareText: string;
  locale?: Locale;
  className?: string;
}) {
  const en = locale === "en";
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const closeMenu = () => detailsRef.current?.removeAttribute("open");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const area = document.createElement("textarea");
      area.value = shareUrl;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    closeMenu();
    window.setTimeout(() => setCopied(false), 1800);
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShared(true);
        window.setTimeout(() => setShared(false), 1800);
      }
    } catch {
      /* user cancelled */
    }
    closeMenu();
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("no-print flex flex-wrap items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex h-10 items-center gap-2 rounded-full bg-graphite px-4 text-[13.5px] font-medium text-white transition-colors hover:bg-graphite/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-porcelain"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
          <path d="M4.5 5.5v-3h7v3M4.5 11H3V6.5h10V11h-1.5" stroke="currentColor" />
          <rect x="4.5" y="9" width="7" height="4.5" stroke="currentColor" />
        </svg>
        {en ? "One-page PDF" : "1페이지 PDF"}
      </button>

      <button
        type="button"
        onClick={downloadJson}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-hairline-2 px-4 text-[13.5px] font-medium text-graphite-2 transition-colors hover:border-graphite hover:text-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-porcelain"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
          <path d="M8 2v8M5.5 7.5 8 10l2.5-2.5M3 12.5h10" stroke="currentColor" />
        </svg>
        JSON
      </button>

      <details ref={detailsRef} className="relative">
        <summary className="inline-flex h-10 cursor-pointer list-none items-center gap-1.5 rounded-full border border-transparent px-3 text-[13.5px] font-medium text-graphite-2 transition-colors hover:border-hairline-2 hover:text-graphite [&::-webkit-details-marker]:hidden">
          {en ? "More" : "더 보기"}
          <span aria-hidden className="text-[10px] text-graphite-3">
            ▾
          </span>
        </summary>
        <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-[16px] border border-hairline bg-surface p-1 shadow-card">
          <button
            type="button"
            onClick={copy}
            className="block w-full rounded-[12px] px-3 py-2 text-left text-[13.5px] text-graphite-2 transition-colors hover:bg-porcelain hover:text-graphite"
          >
            {copied ? (en ? "Copied" : "복사됨") : en ? "Copy link" : "링크 복사"}
          </button>
          <button
            type="button"
            onClick={share}
            className="block w-full rounded-[12px] px-3 py-2 text-left text-[13.5px] text-graphite-2 transition-colors hover:bg-porcelain hover:text-graphite"
          >
            {shared ? (en ? "Link copied" : "복사됨") : en ? "Share" : "공유"}
          </button>
        </div>
      </details>
    </div>
  );
}
