"use client";

import { useId } from "react";

const PALETTE = {
  niobium: "#2dd4bf",
  sky: "#38bdf8",
  indigo: "#818cf8",
  brand: "#f0513c",
  amber: "#fbbf24",
  green: "#34d399",
  grid: "#1f2c45",
  axis: "#5e6f90",
};

type SeriesKey = "passport" | "subscription" | "battery" | "credit";

const SERIES_META: { key: SeriesKey; label: string; color: string }[] = [
  { key: "subscription", label: "コンプライアンス・サブスク", color: PALETTE.niobium },
  { key: "passport", label: "パスポート発行", color: PALETTE.sky },
  { key: "battery", label: "NTO電池販売手数料", color: PALETTE.indigo },
  { key: "credit", label: "カーボンクレジット", color: PALETTE.amber },
];

export function StackedAreaChart({
  data,
  labels,
  height = 240,
}: {
  data: { passport: number; subscription: number; battery: number; credit: number }[];
  labels: string[];
  height?: number;
}) {
  const gid = useId();
  const W = 720;
  const H = height;
  const pad = { l: 48, r: 12, t: 16, b: 26 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  const totals = data.map((d) => d.passport + d.subscription + d.battery + d.credit);
  const max = Math.max(...totals) * 1.08;

  const x = (i: number) => pad.l + (innerW * i) / (data.length - 1);
  const y = (v: number) => pad.t + innerH - (innerH * v) / max;

  // cumulative stacks (bottom→top): subscription, passport, battery, credit
  const order: SeriesKey[] = ["subscription", "passport", "battery", "credit"];
  let baseline = data.map(() => 0);
  const bands = order.map((key) => {
    const lower = baseline.slice();
    const upper = data.map((d, i) => lower[i] + d[key]);
    baseline = upper;
    const top = upper.map((v, i) => `${x(i)},${y(v)}`).join(" ");
    const bottom = lower
      .map((v, i) => `${x(data.length - 1 - i)},${y(v)}`)
      .reverse()
      .join(" ");
    const color = SERIES_META.find((s) => s.key === key)!.color;
    return { key, color, path: `${top} ${bottom}` };
  });

  const yTicks = 4;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const v = (max / yTicks) * i;
        return (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke={PALETTE.grid} strokeWidth={1} />
            <text x={pad.l - 8} y={y(v) + 3} textAnchor="end" fontSize={9} fill={PALETTE.axis}>
              {(v / 1e8).toFixed(1)}
            </text>
          </g>
        );
      })}
      <text x={6} y={pad.t} fontSize={9} fill={PALETTE.axis}>
        億円
      </text>
      {bands.map((b, i) => (
        <polygon key={b.key} points={b.path} fill={b.color} opacity={0.34} stroke={b.color} strokeWidth={i === bands.length - 1 ? 1.5 : 0.8} />
      ))}
      {labels.map((lab, i) =>
        i % 3 === 0 || i === labels.length - 1 ? (
          <text key={`${gid}-${i}`} x={x(i)} y={H - 8} textAnchor="middle" fontSize={9} fill={PALETTE.axis}>
            {lab}
          </text>
        ) : null,
      )}
    </svg>
  );
}

export function StackLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {SERIES_META.map((s) => (
        <span key={s.key} className="inline-flex items-center gap-1.5 text-[11px] text-muted">
          <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />
          {s.label}
        </span>
      ))}
    </div>
  );
}

export function LineChart({
  data,
  labels,
  threshold,
  height = 200,
  unit = "",
}: {
  data: number[];
  labels: string[];
  threshold?: { value: number; label: string };
  height?: number;
  unit?: string;
}) {
  const W = 720;
  const H = height;
  const pad = { l: 40, r: 14, t: 16, b: 26 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const hi = Math.max(...data, threshold?.value ?? 0) * 1.12;
  const lo = Math.min(...data) * 0.8;
  const x = (i: number) => pad.l + (innerW * i) / (data.length - 1);
  const y = (v: number) => pad.t + innerH - (innerH * (v - lo)) / (hi - lo);
  const line = data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `${pad.l},${pad.t + innerH} ${line} ${pad.l + innerW},${pad.t + innerH}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      {Array.from({ length: 4 }).map((_, i) => {
        const v = lo + ((hi - lo) / 3) * i;
        return (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke={PALETTE.grid} />
            <text x={pad.l - 7} y={y(v) + 3} textAnchor="end" fontSize={9} fill={PALETTE.axis}>
              {Math.round(v)}
            </text>
          </g>
        );
      })}
      {threshold && (
        <g>
          <line x1={pad.l} x2={W - pad.r} y1={y(threshold.value)} y2={y(threshold.value)} stroke={PALETTE.brand} strokeDasharray="5 4" strokeWidth={1.4} />
          <text x={W - pad.r} y={y(threshold.value) - 5} textAnchor="end" fontSize={9} fill={PALETTE.brand}>
            {threshold.label} {threshold.value}{unit}
          </text>
        </g>
      )}
      <polygon points={area} fill={PALETTE.niobium} opacity={0.12} />
      <polyline points={line} fill="none" stroke={PALETTE.niobium} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={2.4} fill={PALETTE.niobium} />
      ))}
      {labels.map((lab, i) =>
        i % 2 === 0 || i === labels.length - 1 ? (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize={9} fill={PALETTE.axis}>
            {lab}
          </text>
        ) : null,
      )}
    </svg>
  );
}

export function Donut({
  segments,
  size = 168,
  centerLabel,
  centerSub,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  centerLabel?: string;
  centerSub?: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = size / 2;
  const stroke = 18;
  const radius = r - stroke / 2 - 2;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${r} ${r})`}>
          {segments.map((s, i) => {
            const frac = s.value / total;
            const len = frac * circ;
            const dash = `${len} ${circ - len}`;
            const el = (
              <circle
                key={i}
                cx={r}
                cy={r}
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeDasharray={dash}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
        </g>
        {centerLabel && (
          <text x={r} y={r - 2} textAnchor="middle" fontSize={20} fontWeight={700} fill="#e7edf8">
            {centerLabel}
          </text>
        )}
        {centerSub && (
          <text x={r} y={r + 16} textAnchor="middle" fontSize={10} fill="#93a3c2">
            {centerSub}
          </text>
        )}
      </svg>
      <div className="flex flex-col gap-1.5">
        {segments.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-2 text-xs text-muted">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
            <span className="text-foreground">{s.label}</span>
            <span className="tabular text-faint">{Math.round((s.value / total) * 100)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Gauge({
  value,
  max,
  threshold,
  unit = "",
}: {
  value: number;
  max: number;
  threshold: number;
  unit?: string;
}) {
  const W = 220;
  const H = 130;
  const cx = W / 2;
  const cy = H - 10;
  const radius = 92;
  const toXY = (frac: number) => {
    const a = Math.PI * (1 - frac);
    return [cx + radius * Math.cos(a), cy - radius * Math.sin(a)];
  };
  const arc = (f0: number, f1: number) => {
    const [x0, y0] = toXY(f0);
    const [x1, y1] = toXY(f1);
    const large = f1 - f0 > 0.5 ? 1 : 0;
    return `M ${x0} ${y0} A ${radius} ${radius} 0 ${large} 1 ${x1} ${y1}`;
  };
  const vFrac = Math.min(1, value / max);
  const tFrac = Math.min(1, threshold / max);
  const ok = value <= threshold;
  const [nx, ny] = toXY(vFrac);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[260px]">
      <path d={arc(0, 1)} fill="none" stroke={PALETTE.grid} strokeWidth={14} strokeLinecap="round" />
      <path d={arc(0, tFrac)} fill="none" stroke={PALETTE.green} strokeWidth={14} strokeLinecap="round" opacity={0.45} />
      <path d={arc(tFrac, 1)} fill="none" stroke={PALETTE.brand} strokeWidth={14} strokeLinecap="round" opacity={0.4} />
      <path d={arc(0, vFrac)} fill="none" stroke={ok ? PALETTE.niobium : PALETTE.brand} strokeWidth={14} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#e7edf8" strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={4} fill="#e7edf8" />
      <text x={cx} y={cy - 28} textAnchor="middle" fontSize={26} fontWeight={700} fill={ok ? PALETTE.niobium : PALETTE.brand} className="tabular">
        {value.toFixed(1)}
      </text>
      <text x={cx} y={cy - 12} textAnchor="middle" fontSize={9} fill={PALETTE.axis}>
        {unit}
      </text>
    </svg>
  );
}

export function MiniBars({
  data,
  color = PALETTE.sky,
  height = 60,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const W = 200;
  const max = Math.max(...data) || 1;
  const bw = W / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="w-full">
      {data.map((v, i) => {
        const h = (v / max) * (height - 6);
        return <rect key={i} x={i * bw + 1.5} y={height - h} width={bw - 3} height={h} rx={1.5} fill={color} opacity={0.35 + 0.65 * (v / max)} />;
      })}
    </svg>
  );
}
