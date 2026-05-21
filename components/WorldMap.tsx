"use client";

import { useState } from "react";
import { mapFlows, mapNodes, type MapNode } from "@/lib/data";

const VW = 1000;
const VH = 500;

function project(lat: number, lng: number): [number, number] {
  return [((lng + 180) / 360) * VW, ((90 - lat) / 180) * VH];
}

const KIND_COLOR: Record<MapNode["kind"], string> = {
  upstream: "#fbbf24",
  midstream: "#2dd4bf",
  market: "#38bdf8",
};

function arcPath(a: [number, number], b: [number, number]) {
  const [x0, y0] = a;
  const [x1, y1] = b;
  const dist = Math.hypot(x1 - x0, y1 - y0);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2 - dist * 0.22;
  return `M ${x0} ${y0} Q ${cx} ${cy} ${x1} ${y1}`;
}

export function WorldMap() {
  const [active, setActive] = useState<string | null>(null);
  const pos = Object.fromEntries(mapNodes.map((n) => [n.id, project(n.lat, n.lng)]));

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-[#060a13]">
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" role="img" aria-label="グローバル・サプライチェーン地図">
        <defs>
          <radialGradient id="ocean" cx="35%" cy="0%" r="120%">
            <stop offset="0%" stopColor="#0c1830" />
            <stop offset="55%" stopColor="#08101f" />
            <stop offset="100%" stopColor="#05080f" />
          </radialGradient>
          <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={VW} height={VH} fill="url(#ocean)" />

        {/* graticule */}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`v${i}`} x1={(VW / 10) * i} y1={0} x2={(VW / 10) * i} y2={VH} stroke="#13203a" strokeWidth={i === 5 ? 1 : 0.5} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={(VH / 6) * i} x2={VW} y2={(VH / 6) * i} stroke="#13203a" strokeWidth={i === 3 ? 1 : 0.5} />
        ))}

        {/* ambient region hints */}
        <g opacity={0.16} fill="#1c3354">
          {/* South America */}
          <path d="M330 250 q40 -25 70 5 q25 40 5 90 q-15 55 -45 60 q-30 -20 -30 -75 q-10 -55 -0 -80 Z" />
          {/* Eurasia */}
          <path d="M470 95 q120 -35 260 -10 q120 10 175 35 q-30 45 -120 50 q-90 0 -180 25 q-90 -10 -150 -40 q-20 -35 15 -55 Z" />
          {/* Africa */}
          <path d="M480 200 q55 -20 95 10 q20 55 -10 110 q-30 50 -60 30 q-35 -40 -35 -90 q-15 -45 10 -70 Z" />
          {/* North America */}
          <path d="M150 110 q90 -45 175 -10 q-10 45 -55 70 q-15 55 -55 70 q-40 -15 -45 -70 q-30 -35 35 -60 Z" />
          {/* Australia */}
          <path d="M820 330 q55 -20 90 5 q10 35 -25 50 q-45 10 -70 -15 q-15 -25 5 -40 Z" />
        </g>

        {/* flow arcs */}
        {mapFlows.map((f, i) => {
          const d = arcPath(pos[f.from], pos[f.to]);
          return (
            <g key={i}>
              <path d={d} fill="none" stroke="url(#flowGrad)" strokeWidth={1.6} opacity={0.45} />
              <path
                d={d}
                fill="none"
                stroke="url(#flowGrad)"
                strokeWidth={2.4}
                strokeDasharray="6 14"
                style={{ animation: "dash-flow 14s linear infinite" }}
              />
              <circle r={3.2} fill="#e7edf8" filter="url(#glow)">
                <animateMotion dur={`${4 + i}s`} repeatCount="indefinite" path={d} />
              </circle>
            </g>
          );
        })}

        {/* nodes */}
        {mapNodes.map((n) => {
          const [x, y] = pos[n.id];
          const c = KIND_COLOR[n.kind];
          const isActive = active === n.id;
          return (
            <g key={n.id} className="cursor-pointer" onMouseEnter={() => setActive(n.id)} onMouseLeave={() => setActive(null)}>
              <circle cx={x} cy={y} r={10} fill={c} opacity={0.18}>
                <animate attributeName="r" values="10;22;10" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.35;0;0.35" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx={x} cy={y} r={isActive ? 7 : 5.5} fill={c} filter="url(#glow)" />
              <circle cx={x} cy={y} r={2} fill="#06101f" />
              <text x={x} y={y - 16} textAnchor="middle" fontSize={13} fontWeight={700} fill="#e7edf8">
                {n.label}
              </text>
              <text x={x} y={y + 24} textAnchor="middle" fontSize={10} fill={c}>
                {n.sub}
              </text>
            </g>
          );
        })}

        {/* HUD corner ticks */}
        <g stroke="#2dd4bf" strokeWidth={1.5} opacity={0.5}>
          <path d="M14 14 h22 M14 14 v22" fill="none" />
          <path d={`M${VW - 14} 14 h-22 M${VW - 14} 14 v22`} fill="none" />
          <path d={`M14 ${VH - 14} h22 M14 ${VH - 14} v-22`} fill="none" />
          <path d={`M${VW - 14} ${VH - 14} h-22 M${VW - 14} ${VH - 14} v-22`} fill="none" />
        </g>
      </svg>

      <div className="pointer-events-none absolute left-4 top-3 text-[11px] uppercase tracking-[0.2em] text-niobium/70">
        Global Supply Chain · LIVE
      </div>
      <div className="absolute bottom-3 right-4 flex gap-3 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: KIND_COLOR.upstream }} /> 上流 (原料)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: KIND_COLOR.midstream }} /> 中流 (製造)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: KIND_COLOR.market }} /> 需要 (EU)
        </span>
      </div>
    </div>
  );
}
