import type { ScoreComponent } from "@/lib/types";
import { ScoreBar } from "@/components/ui/bars";
import { cn } from "@/lib/cn";
import { gradeTone } from "./ui";

type Locale = "ko" | "en";

function barTone(component: ScoreComponent): "ink" | "signal" {
  const ratio = component.max > 0 ? component.score / component.max : 0;
  return ratio >= 0.42 ? "ink" : "signal";
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
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/70">
        <span>{components.length} components · weighted</span>
        <span>
          {en ? "Total" : "합계"}{" "}
          <span className="text-[14px] font-semibold tracking-normal text-ink tnum">
            {score.toFixed(1)}
          </span>
          <span className="tnum"> / {max}</span>
        </span>
      </div>

      <ul>
        {components.map((component) => (
          <li
            key={component.key}
            className="grid gap-2 border-t border-ink/10 py-3.5 sm:grid-cols-[11rem_minmax(0,1fr)_5rem] sm:items-center sm:gap-5"
          >
            <div className="flex items-baseline justify-between gap-3 sm:block">
              <p className="text-[14px] font-semibold text-ink">{component.label}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 sm:mt-0.5">
                {en ? `Weight ${component.max}` : `배점 ${component.max}`}
              </p>
            </div>
            <div className="min-w-0">
              <ScoreBar score={component.score} max={component.max} tone={barTone(component)} />
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink/70">{component.detail}</p>
            </div>
            <p className="text-right font-mono text-[14px] font-semibold tnum text-ink">
              {component.score.toFixed(1)}
              <span className="text-[11px] font-normal text-ink/60"> / {component.max}</span>
            </p>
          </li>
        ))}
      </ul>

      <div className="-mx-5 mt-2 flex items-end justify-between gap-4 bg-ink px-5 py-4 text-paper sm:-mx-7 sm:px-7 md:-mx-9 md:px-9">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/70">
            Total score
          </p>
          <p className="type-data mt-1 text-[44px] font-semibold leading-[0.85] text-paper">
            {score.toFixed(1)}
          </p>
          <p className="mt-1 font-mono text-[10px] tracking-[0.1em] text-paper/70">
            {en ? `out of ${max} · weighted sum` : `${max}점 만점 · 가중 합산`}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/70">
            {en ? "Grade" : "등급"}
          </p>
          <p
            className={cn(
              "font-serif-display text-[56px] italic leading-[0.8]",
              gradeTone(grade, "dark"),
            )}
          >
            {grade}
          </p>
        </div>
      </div>

      <p className="mt-3 font-mono text-[10px] leading-relaxed text-ink/60">
        {en
          ? "Weights are published; the same inputs always produce the same score."
          : "가중치는 공개되어 있고, 같은 입력은 같은 점수를 냅니다."}
      </p>
    </div>
  );
}
