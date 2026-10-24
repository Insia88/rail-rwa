import { cn } from "@/lib/cn";

/** Tiny inline SVG sparkline; deterministic, no external chart lib. */
export function Sparkline({
  values,
  width = 140,
  height = 36,
  className,
  stroke = "var(--color-ink)",
  fill = "var(--color-paper-3)",
}: {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
  stroke?: string;
  fill?: string;
}) {
  if (!values.length) return null;
  const pad = 2;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = (width - pad * 2) / Math.max(1, values.length - 1);
  const pts = values.map((v, i) => {
    const x = pad + i * step;
    const y = height - pad - ((v - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${height - pad} L${pts[0][0].toFixed(1)},${height - pad} Z`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("overflow-visible", className)}
      aria-hidden
    >
      <path d={area} fill={fill} opacity={0.55} />
      <path d={line} fill="none" stroke={stroke} strokeWidth={1.4} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={2.4} fill={stroke} />
    </svg>
  );
}
