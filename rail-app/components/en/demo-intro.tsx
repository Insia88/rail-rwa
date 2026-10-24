import Link from "next/link";

type StepLink = { href: string; label: string };

/**
 * Demo-route header: breadcrumb, one-line purpose and the next step.
 * Used at the top of every `/en` demo route so a first-time reviewer never
 * has to guess where they are in the three-step path.
 */
export function DemoIntro({
  step,
  purpose,
  hint,
  prev,
  next,
}: {
  step: string;
  purpose: string;
  hint: string;
  prev?: StepLink;
  next?: StepLink;
}) {
  return (
    <header className="border-b border-line-dark pb-5">
      <nav
        aria-label="Demo path"
        className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[9px] uppercase tracking-[0.18em]"
      >
        <Link href="/en" className="text-cream/40 transition-colors hover:text-cream">
          RAIL
        </Link>
        <span aria-hidden className="text-cream/20">
          /
        </span>
        <Link href="/en" className="text-cream/40 transition-colors hover:text-cream">
          Demo
        </Link>
        <span aria-hidden className="text-cream/20">
          /
        </span>
        <span className="text-cream">{step}</span>

        <span className="ml-auto flex items-center gap-4">
          {prev ? (
            <Link
              href={prev.href}
              className="text-cream/35 transition-colors hover:text-cream"
            >
              ← {prev.label}
            </Link>
          ) : null}
          {next ? (
            <Link
              href={next.href}
              className="text-signal/85 transition-colors hover:text-signal"
            >
              {next.label} →
            </Link>
          ) : null}
        </span>
      </nav>

      <p className="mt-3 max-w-3xl text-[14.5px] leading-relaxed text-cream/60">{purpose}</p>
      <p className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-cream/30">
        {hint}
      </p>
    </header>
  );
}
