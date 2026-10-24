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
  const formatDate = en ? dateEn : dateKo;
  const signatureSeed = passportId.slice(-4);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {agents.map((agent) => (
          <div key={agent.key} className="rounded-[16px] border border-hairline p-4">
            <p className="text-[15px] font-semibold leading-tight text-graphite">{agent.agent}</p>
            <p className="mt-0.5 text-[13px] leading-snug text-graphite-3">{agent.role}</p>
            <p className="mt-2 text-[13.5px] leading-[1.6] text-graphite-2">{agent.summary}</p>
            <p className="mt-3 border-t border-hairline pt-2 font-mono text-[11.5px] tabular-nums text-graphite-3">
              {agent.agent.toLowerCase()}.{signatureSeed} · {formatDate(issuedAt)}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[12.5px] leading-relaxed text-graphite-3">
        {en
          ? "Every number is reproducible by the rule engine — identical inputs issue an identical passport."
          : "모든 수치는 규칙 엔진으로 재현 가능 — 동일 입력은 동일한 여권을 발급합니다."}
      </p>
    </div>
  );
}
