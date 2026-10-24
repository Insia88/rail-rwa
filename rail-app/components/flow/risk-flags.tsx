import type { RiskFlag } from "@/lib/types";
import { cn } from "@/lib/cn";
import { SeverityChip } from "./ui";

type Locale = "ko" | "en";

const accent: Record<RiskFlag["severity"], string> = {
  high: "border-l-signal",
  medium: "border-l-ink/45",
  low: "border-l-ink/25",
};

export function RiskFlags({ flags, locale = "ko" }: { flags: RiskFlag[]; locale?: Locale }) {
  const en = locale === "en";

  if (flags.length === 0) {
    return (
      <p className="border border-ink/20 bg-ink/[0.03] px-4 py-5 text-[14px] leading-relaxed text-ink/75">
        {en
          ? "No risk flags require mitigation on the current evidence."
          : "현재 증거 기준으로 완화가 필요한 리스크 플래그가 발견되지 않았습니다."}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {flags.map((flag) => (
        <li
          key={flag.code}
          className={cn(
            "border border-ink/20 border-l-2 bg-ink/[0.02] p-4",
            accent[flag.severity],
          )}
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <SeverityChip severity={flag.severity} variant="light" locale={locale} />
            <p className="text-[14px] font-semibold text-ink">{flag.label}</p>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60">
              {flag.code}
            </span>
          </div>
          <p className="mt-2.5 text-[13px] leading-relaxed text-ink/75">{flag.detail}</p>
          <div className="mt-3 flex flex-col gap-1 border-l-2 border-ink/40 pl-3 sm:flex-row sm:gap-2.5">
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-signal">
              {en ? "Mitigation" : "완화 조건"}
            </span>
            <p className="text-[13px] leading-relaxed text-ink/75">{flag.mitigation}</p>
          </div>
          {flag.evidenceIds.length > 0 ? (
            <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink/55">
              {en ? "Evidence" : "근거 증거"} · {flag.evidenceIds.join(" · ")}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
