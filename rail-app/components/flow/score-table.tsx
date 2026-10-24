import type { ScoreComponent } from "@/lib/types";
import { cn } from "@/lib/cn";
import { gradeTone } from "./ui";

type Locale = "ko" | "en";

function ScoreMeter({ score, max }: { score: number; max: number }) {
  const ratio = max > 0 ? Math.max(0, Math.min(1, score / max)) : 0;
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-hairline">
      <div
        className={cn("h-full rounded-full", ratio >= 0.42 ? "bg-graphite" : "bg-vermilion")}
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}

export function ScoreTable({
  components,
  score,
  grade,
  locale = "ko",
}: {
  components: ScoreComponent[];
  score: number;
  grade: string;
  locale?: Locale;
}) {
  const en = locale === "en";
  const max = components.reduce((acc, component) => acc + component.max, 0);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[13px] text-graphite-3">
        <span>{en ? `${components.length} weighted components` : `${components.length}개 가중 항목`}</span>
        <span>
          {en ? "Total" : "합계"}{" "}
          <span className="font-mono text-[14px] font-medium tabular-nums text-graphite">
            {score.toFixed(1)}
          </span>{" "}
          <span className="font-mono tabular-nums">/ {max}</span>
        </span>
      </div>

      <ul>
        {components.map((component) => (
          <li
            key={component.key}
            className="grid gap-2 border-b border-hairline py-3.5 sm:grid-cols-[11rem_minmax(0,1fr)_5rem] sm:items-center sm:gap-5"
          >
            <div className="flex items-baseline justify-between gap-3 sm:block">
              <p className="text-[15px] font-medium leading-[1.4] text-graphite">
                {component.label}
              </p>
              <p className="text-[12.5px] text-graphite-3 sm:mt-0.5">
                {en ? `Weight ${component.max}` : `배점 ${component.max}`}
              </p>
            </div>
            <div className="min-w-0">
              <ScoreMeter score={component.score} max={component.max} />
              <p className="mt-1.5 text-[14px] leading-[1.6] text-graphite-2">{component.detail}</p>
            </div>
            <p className="text-right font-mono text-[14px] font-medium tabular-nums text-graphite">
              {component.score.toFixed(1)}
              <span className="text-[12px] font-normal text-graphite-3"> / {component.max}</span>
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-end justify-between gap-4 border-t border-hairline-2 pt-4">
        <div>
          <p className="text-[13px] text-graphite-3">{en ? "Total score" : "총점"}</p>
          <p className="mt-1 text-[30px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-graphite">
            {score.toFixed(1)}
          </p>
          <p className="mt-1 text-[12.5px] text-graphite-3">
            {en ? `out of ${max} · weighted sum` : `${max}점 만점 · 가중 합산`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[13px] text-graphite-3">{en ? "Grade" : "등급"}</p>
          <p
            className={cn(
              "mt-1 text-[22px] font-semibold leading-none",
              gradeTone(grade, "light"),
            )}
          >
            {grade}
          </p>
        </div>
      </div>

      <p className="mt-3 text-[12.5px] leading-relaxed text-graphite-3">
        {en
          ? "Weights are published; the same inputs always produce the same score."
          : "가중치는 공개되어 있고, 같은 입력은 같은 점수를 냅니다."}
      </p>
    </div>
  );
}
