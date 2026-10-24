import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { DemoPathCopy } from "./v4-types";

/**
 * 3-step demo path strip — placed directly under the hero ticker so a first-time
 * visitor knows the three things to do: read the case, run it, open the passport.
 */
export function DemoPath({ copy }: { copy: DemoPathCopy }) {
  return (
    <section
      aria-label={copy.title}
      className="relative overflow-hidden border-b border-line-dark bg-noir-2 text-cream"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <Reveal delay={0.04}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/50">
              {copy.kicker}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-cream/30">
              {copy.title}
            </p>
          </div>
        </Reveal>

        <Stagger className="mt-4 grid gap-2.5 sm:grid-cols-3" step={0.05}>
          {copy.items.map((item) => (
            <StaggerItem key={item.n}>
              <Link
                href={item.href}
                className="group flex h-full flex-col border border-line-dark bg-noir/60 p-4 transition-colors duration-200 hover:border-cream/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-noir-2 sm:p-5"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="type-data text-[18px] leading-none text-cream/30">
                    {item.n}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-cream/30">
                    {item.time}
                  </span>
                </div>
                <p className="mt-2.5 text-[15px] font-bold tracking-[-0.01em] text-cream">
                  {item.title}
                </p>
                <p className="mt-1 text-[11.5px] leading-[1.55] text-cream/45">{item.detail}</p>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.12em] text-cream/35 transition-colors duration-200 group-hover:text-cream">
                  바로 가기
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
