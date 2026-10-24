import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/motion";
import { cn } from "@/lib/cn";

type Tone = "dark" | "light" | "orange";

const KICKER: Record<Tone, string> = {
  dark: "text-cream/45",
  light: "text-ink/45",
  orange: "text-ink/60",
};

const RULE: Record<Tone, string> = {
  dark: "bg-line-dark",
  light: "bg-ink/20",
  orange: "bg-ink/40",
};

const INDEX: Record<Tone, string> = {
  dark: "text-cream/30",
  light: "text-ink/35",
  orange: "text-ink/55",
};

const TITLE: Record<Tone, string> = {
  dark: "text-cream",
  light: "text-ink",
  orange: "text-ink",
};

const SUB: Record<Tone, string> = {
  dark: "text-cream/55",
  light: "text-ink/60",
  orange: "text-ink/75",
};

/** Standalone mono label (hero masthead, closing). */
export function SectionKicker({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em]",
        KICKER[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * v3 chapter grammar: 2-digit chapter + mono eyebrow + hairline +
 * 40–56px sentence-case H2 + one-sentence sub. Hangul tracking is relaxed
 * (-0.015em / 1.15); Latin tracking stays tight.
 */
export function SectionHead({
  index,
  kicker,
  title,
  sub,
  tone = "dark",
  className,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  sub?: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <div className="flex items-center gap-3">
        <span className={cn("font-mono text-[10px] tracking-[0.18em]", INDEX[tone])}>{index}</span>
        <span className={cn("h-px w-10", RULE[tone])} aria-hidden />
        <span
          className={cn(
            "font-mono text-[10px] uppercase tracking-[0.16em]",
            KICKER[tone],
          )}
        >
          {kicker}
        </span>
      </div>
      <h2
        className={cn(
          "mt-6 max-w-4xl text-[clamp(2rem,3.6vw,3.4rem)] font-extrabold leading-[1.15] tracking-[-0.015em]",
          TITLE[tone],
        )}
      >
        {title}
      </h2>
      {sub ? (
        <p className={cn("mt-5 max-w-xl text-[15px] leading-[1.7] sm:text-base", SUB[tone])}>
          {sub}
        </p>
      ) : null}
    </Reveal>
  );
}
