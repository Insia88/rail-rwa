import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant =
  | "primary"
  | "outline"
  | "ghost"
  | "night"
  | "outline-inverse"
  | "cream"
  | "acid";
type Size = "md" | "sm" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-signal text-cream hover:bg-signal-2 active:translate-y-[1px] shadow-[0_1px_0_0_rgba(7,9,8,0.35)]",
  outline: "border border-ink/80 text-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink-soft hover:text-ink hover:bg-paper-2",
  night: "bg-cream text-noir hover:bg-white",
  "outline-inverse": "border border-cream/35 text-cream hover:border-cream hover:bg-cream hover:text-noir",
  cream: "bg-cream text-noir hover:bg-white active:translate-y-[1px]",
  acid: "bg-acid text-noir hover:bg-[#e6ff86] active:translate-y-[1px]",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm tracking-[-0.01em]",
  sm: "h-9 px-3.5 text-xs tracking-[-0.01em]",
  lg: "h-13 px-7 text-base tracking-[-0.01em]",
};

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  target?: string;
  ariaLabel?: string;
}

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
  target,
  ariaLabel,
}: ButtonProps) {
  const cls = cn(base, variants[variant], sizes[size], className);
  if (href) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel} target={target}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export function ArrowLink({
  href,
  children,
  className,
  inverse,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  inverse?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors",
        inverse
          ? "text-cream/65 hover:text-acid"
          : "text-ink-soft hover:text-signal",
        className,
      )}
    >
      {children}
      <svg
        viewBox="0 0 16 16"
        className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
        fill="none"
        aria-hidden
      >
        <path d="M2 8h11M9.5 4.5 13 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </Link>
  );
}
