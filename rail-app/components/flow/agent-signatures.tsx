import type { AgentStep } from "@/lib/types";
import { dateKo } from "@/lib/format";
import { dateEn } from "@/components/en/flow-data";

type Locale = "ko" | "en";

export function AgentSignatures({
  agents,
  issuedAt,
  passportId,
  locale = "ko",
}: {
  agents: AgentStep[];
  issuedAt: string;
  passportId: string;
  locale?: Locale;
}) {
  const en = locale === "en";
  const signatureSeed = passportId.slice(-4);
  const formatDate = en ? dateEn : dateKo;

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {agents.map((agent) => (
          <div key={agent.key} className="border border-ink/20 bg-ink/[0.02] p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[12px] font-semibold tracking-[0.16em] text-ink">
                {agent.agent}
              </p>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-signal">
                Agent signed
              </span>
            </div>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60">
              {agent.role}
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-ink/75">{agent.summary}</p>
            <div className="mt-3 flex items-end justify-between gap-2 border-t border-ink/10 pt-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/55">
                Signature
              </span>
              <span className="text-right font-mono text-[10px] tnum text-ink/65">
                {agent.agent.toLowerCase()}.{signatureSeed} · {formatDate(issuedAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[10px] leading-relaxed text-ink/60">
        {en
          ? "Every number is reproducible by the rule engine — identical inputs issue an identical passport."
          : "모든 수치는 규칙 엔진으로 재현 가능 — 동일 입력은 동일한 여권을 발급합니다."}
      </p>
    </div>
  );
}
