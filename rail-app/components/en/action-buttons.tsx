"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

const BASE =
  "inline-flex h-9 items-center gap-2 border border-cream/20 bg-transparent px-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/70 transition-colors hover:border-cream hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal";

const COPY_ICON = (
  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
    <rect x="5.5" y="5.5" width="8" height="8" stroke="currentColor" />
    <path d="M10.5 5.5v-3h-8v8h3" stroke="currentColor" />
  </svg>
);

export function CopyLinkButton({
  text,
  label = "Copy link",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={cn(BASE, className)}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const area = document.createElement("textarea");
          area.value = text;
          document.body.appendChild(area);
          area.select();
          document.execCommand("copy");
          area.remove();
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }}
    >
      {COPY_ICON}
      {copied ? "Copied" : label}
    </button>
  );
}

export function PrintPdfButton({
  className,
  label = "Print · PDF",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button type="button" className={cn(BASE, className)} onClick={() => window.print()}>
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
        <path d="M4.5 5.5v-3h7v3M4.5 11H3V6.5h10V11h-1.5" stroke="currentColor" />
        <rect x="4.5" y="9" width="7" height="4.5" stroke="currentColor" />
      </svg>
      {label}
    </button>
  );
}

export function SharePassportButton({
  title,
  text,
  className,
}: {
  title: string;
  text: string;
  className?: string;
}) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={cn(BASE, className)}
      onClick={async () => {
        const url = window.location.href;
        try {
          if (navigator.share) {
            await navigator.share({ title, text, url });
          } else {
            await navigator.clipboard.writeText(url);
            setDone(true);
            window.setTimeout(() => setDone(false), 1800);
          }
        } catch {
          /* user cancelled */
        }
      }}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
        <path d="M8 10.5V2M5.5 4.5 8 2l2.5 2.5M3 9v4.5h10V9" stroke="currentColor" />
      </svg>
      {done ? "Link copied" : "Share"}
    </button>
  );
}

export function DownloadJsonButton({
  data,
  filename,
  className,
  label = "JSON",
}: {
  data: unknown;
  filename: string;
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      className={cn(BASE, className)}
      onClick={() => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = filename;
        anchor.click();
        URL.revokeObjectURL(url);
      }}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
        <path d="M8 2v8M5.5 7.5 8 10l2.5-2.5M3 12.5h10" stroke="currentColor" />
      </svg>
      {label}
    </button>
  );
}
