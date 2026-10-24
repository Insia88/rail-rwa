import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  className,
  inverse,
}: {
  children: ReactNode;
  className?: string;
  inverse?: boolean;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.24em]",
        inverse ? "text-cream/55" : "text-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionLabel({
  index,
  kicker,
  title,
  sub,
  inverse,
  className,
  align = "left",
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  sub?: ReactNode;
  inverse?: boolean;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "font-mono text-[10px] tracking-[0.2em]",
            inverse ? "text-signal" : "text-signal",
          )}
        >
          {index}
        </span>
        <span className={cn("h-px w-8", inverse ? "bg-cream/25" : "bg-line-strong")} aria-hidden />
        <Eyebrow inverse={inverse}>{kicker}</Eyebrow>
      </div>
      <h2
        className={cn(
          "font-display text-3xl leading-[1.22] tracking-[-0.02em] sm:text-4xl lg:text-[44px]",
          inverse ? "text-cream" : "text-ink",
        )}
      >
        {title}
      </h2>
      {sub ? (
        <p
          className={cn(
            "max-w-2xl text-[15px] leading-relaxed",
            align === "center" && "mx-auto",
            inverse ? "text-cream/65" : "text-ink-soft",
          )}
        >
          {sub}
        </p>
      ) : null}
    </div>
  );
}

export function Hairline({ className, strong }: { className?: string; strong?: boolean }) {
  return (
    <div
      className={cn("h-px w-full", strong ? "bg-line-strong" : "bg-line", className)}
      aria-hidden
    />
  );
}

export function NumberTag({ n, inverse }: { n: string; inverse?: boolean }) {
  return (
    <span
      className={cn(
        "font-mono text-[10px] tracking-[0.18em]",
        inverse ? "text-cream/40" : "text-line-strong",
      )}
    >
      {n}
    </span>
  );
}
