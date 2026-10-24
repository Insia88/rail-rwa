import { cn } from "@/lib/cn";

type BarTone = "ink" | "signal" | "verified" | "cream" | "acid";

const fills: Record<BarTone, string> = {
  ink: "bg-ink",
  signal: "bg-signal",
  verified: "bg-verified",
  cream: "bg-cream",
  acid: "bg-acid",
};

export function ScoreBar({
  score,
  max,
  className,
  tone = "ink",
  track = "paper",
}: {
  score: number;
  max: number;
  className?: string;
  tone?: BarTone;
  track?: "paper" | "dark";
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (score / max) * 100)) : 0;
  return (
    <div
      className={cn("h-[5px] w-full", track === "dark" ? "bg-cream/10" : "bg-paper-3", className)}
      aria-hidden
    >
      <div
        className={cn("h-full transition-[width] duration-700", fills[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function ShareBar({
  pct,
  className,
  tone = "ink",
  track = "paper",
}: {
  pct: number;
  className?: string;
  tone?: BarTone;
  track?: "paper" | "dark";
}) {
  const w = Math.min(100, Math.max(0, pct));
  return (
    <div
      className={cn("h-[3px] w-full", track === "dark" ? "bg-cream/10" : "bg-paper-3", className)}
      aria-hidden
    >
      <div className={cn("h-full", fills[tone])} style={{ width: `${w}%` }} />
    </div>
  );
}

export function ProgressRail({
  steps,
  current,
  className,
  inverse,
}: {
  steps: string[];
  current: number;
  className?: string;
  inverse?: boolean;
}) {
  return (
    <ol className={cn("flex items-center gap-2", className)}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "font-mono text-[9px] uppercase tracking-[0.16em]",
                done
                  ? inverse
                    ? "text-acid"
                    : "text-verified"
                  : active
                    ? "text-signal"
                    : inverse
                      ? "text-cream/30"
                      : "text-muted/60",
              )}
            >
              {s}
            </span>
            <span
              className={cn(
                "h-px flex-1",
                done
                  ? inverse
                    ? "bg-acid/70"
                    : "bg-verified"
                  : active
                    ? "bg-signal"
                    : inverse
                      ? "bg-cream/15"
                      : "bg-line",
              )}
              aria-hidden
            />
          </li>
        );
      })}
    </ol>
  );
}
