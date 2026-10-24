import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Stat({
  value,
  label,
  note,
  tone = "ink",
  className,
}: {
  value: ReactNode;
  label: ReactNode;
  note?: ReactNode;
  tone?: "ink" | "signal" | "verified" | "cream";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span
        className={cn(
          "font-display text-3xl leading-none tracking-[-0.03em] sm:text-[40px]",
          tone === "signal" && "text-signal",
          tone === "verified" && "text-verified",
          tone === "cream" && "text-cream",
          tone === "ink" && "text-ink",
        )}
      >
        {value}
      </span>
      <span className="text-[13px] font-medium text-ink-soft">{label}</span>
      {note ? <span className="text-[11px] leading-relaxed text-muted">{note}</span> : null}
    </div>
  );
}

export function StatRow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-8 border-y border-line py-7 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
