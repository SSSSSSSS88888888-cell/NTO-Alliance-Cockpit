import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface/80 backdrop-blur-sm ${
        glow ? "shadow-[0_0_40px_-12px_rgba(45,212,191,0.25)]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  hint,
  right,
}: {
  title: string;
  hint?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-sm font-semibold tracking-wide text-foreground">{title}</h3>
        {hint && <p className="mt-0.5 text-xs text-faint">{hint}</p>}
      </div>
      {right}
    </div>
  );
}

export function Stat({
  label,
  value,
  unit,
  delta,
  accent = "niobium",
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  accent?: "niobium" | "sky" | "indigo" | "brand" | "amber";
}) {
  const accentText: Record<string, string> = {
    niobium: "text-niobium",
    sky: "text-sky",
    indigo: "text-indigo",
    brand: "text-brand",
    amber: "text-amber",
  };
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={`tabular text-2xl font-semibold ${accentText[accent]}`}>{value}</span>
        {unit && <span className="text-xs text-faint">{unit}</span>}
      </div>
      {delta && <span className="text-[11px] text-green">{delta}</span>}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "ok" | "warn" | "info" | "neutral";
}) {
  const tones: Record<string, string> = {
    ok: "bg-green/15 text-green border-green/30",
    warn: "bg-amber/15 text-amber border-amber/30",
    info: "bg-sky/15 text-sky border-sky/30",
    neutral: "bg-surface-3 text-muted border-border-strong",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  max = 100,
  tone = "niobium",
}: {
  value: number;
  max?: number;
  tone?: "niobium" | "sky" | "amber" | "brand" | "indigo";
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const tones: Record<string, string> = {
    niobium: "bg-niobium",
    sky: "bg-sky",
    amber: "bg-amber",
    brand: "bg-brand",
    indigo: "bg-indigo",
  };
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
      <div className={`h-full rounded-full ${tones[tone]}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
