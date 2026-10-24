import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Printing the passport: keep the white document surface when a reader saves it
 * as a PDF (browsers otherwise drop backgrounds).
 */
export const printExact = {
  printColorAdjust: "exact",
  WebkitPrintColorAdjust: "exact",
} as unknown as CSSProperties;

/** One numbered section of the white A4 document. */
export function ArtifactSection({
  id,
  labelledBy,
  children,
  className,
}: {
  id?: string;
  labelledBy?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("px-6 py-8 sm:px-10 print-avoid-break", className)}
    >
      {children}
    </section>
  );
}

export function ArtifactHead({
  index,
  title,
  kicker,
  id,
}: {
  index: string;
  title: string;
  kicker: string;
  id: string;
}) {
  return (
    <header className="border-b border-hairline pb-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-[13px] font-medium text-graphite-3">{index}</span>
        <span className="text-[13px] text-graphite-3">{kicker}</span>
      </div>
      <h2
        id={id}
        className="mt-1.5 text-[22px] font-semibold leading-[1.3] tracking-[-0.01em] text-graphite sm:text-[24px]"
      >
        {title}
      </h2>
    </header>
  );
}

export function ArtifactRow({
  label,
  value,
  sub,
  last,
  emphasis,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  last?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 border-b border-hairline py-2.5",
        last && "border-b-0",
      )}
    >
      <dt className="shrink-0 text-[13px] leading-snug text-graphite-3">{label}</dt>
      <dd className="min-w-0 text-right">
        <p
          className={cn(
            "text-[15px] font-medium tracking-[-0.01em] tabular-nums sm:text-[16px]",
            emphasis ? "text-vermilion" : "text-graphite",
          )}
        >
          {value}
        </p>
        {sub ? (
          <p className="mt-0.5 break-words text-[12.5px] leading-relaxed tabular-nums text-graphite-3">
            {sub}
          </p>
        ) : null}
      </dd>
    </div>
  );
}
