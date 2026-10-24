import type { RiskFlag } from "@/lib/types";
import { cn } from "@/lib/cn";
import { SeverityChip } from "./ui";

type Locale = "ko" | "en";

export function RiskFlags({ flags, locale = "ko" }: { flags: RiskFlag[]; locale?: Locale }) {
  const en = locale === "en";

  if (flags.length === 0) {
    return (
      <p className="rounded-[16px] border border-hairline bg-porcelain/60 px-5 py-5 text-[15px] leading-[1.65] text-graphite-2">
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
            "rounded-[16px] border border-hairline bg-porcelain/60 p-5",
            flag.severity === "high" && "border-hairline-2 bg-vermilion-soft/40",
          )}
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <SeverityChip severity={flag.severity} variant="light" locale={locale} />
            <p className="text-[15.5px] font-medium leading-[1.4] text-graphite">{flag.label}</p>
            <span className="ml-auto font-mono text-[12px] tabular-nums text-graphite-3">
              {flag.code}
            </span>
          </div>
          <p className="mt-2.5 text-[14.5px] leading-[1.65] text-graphite-2">{flag.detail}</p>
          <div className="mt-3 border-l-2 border-hairline-2 pl-3">
            <p className="text-[12.5px] text-graphite-3">{en ? "Mitigation" : "완화 조건"}</p>
            <p className="mt-0.5 text-[14px] leading-[1.6] text-graphite-2">{flag.mitigation}</p>
          </div>
          {flag.evidenceIds.length > 0 ? (
            <p className="mt-2.5 font-mono text-[12px] tabular-nums text-graphite-3">
              {en ? "Evidence" : "근거 증거"} · {flag.evidenceIds.join(" · ")}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
