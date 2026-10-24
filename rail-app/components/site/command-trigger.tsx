"use client";

export function CommandTrigger({ className }: { className?: string }) {
  return (
    <button
      type="button"
      aria-label="커맨드 팔레트 열기 (⌘K)"
      onClick={() => window.dispatchEvent(new CustomEvent("rail:open-command"))}
      className={className}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="4.2" stroke="currentColor" strokeWidth="1.3" />
        <path d="m10.2 10.2 3 3" stroke="currentColor" strokeWidth="1.3" />
      </svg>
      <span className="hidden xl:inline">SEARCH</span>
      <kbd className="border border-line-dark px-1 py-0.5 font-mono text-[8px] tracking-[0.08em] text-cream/35">
        ⌘K
      </kbd>
    </button>
  );
}
