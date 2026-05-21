"use client";

import { useEffect, useState } from "react";
import { ComplianceView } from "@/components/views/ComplianceView";
import { PassportView } from "@/components/views/PassportView";
import { RevenueView } from "@/components/views/RevenueView";
import { SupplyChainView } from "@/components/views/SupplyChainView";
import { PRIMARY_MILESTONE } from "@/lib/data";

type TabId = "supply" | "passport" | "compliance" | "revenue";

const TABS: { id: TabId; label: string; sub: string; icon: React.ReactNode }[] = [
  { id: "supply", label: "サプライチェーン", sub: "Global Flow", icon: <IconGlobe /> },
  { id: "passport", label: "パスポート発行", sub: "Issue", icon: <IconId /> },
  { id: "compliance", label: "コンプライアンス", sub: "Regulation", icon: <IconShield /> },
  { id: "revenue", label: "収益管理", sub: "Revenue", icon: <IconChart /> },
];

export default function Page() {
  const [tab, setTab] = useState<TabId>("supply");

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* sidebar */}
      <aside className="border-b border-border bg-surface/60 backdrop-blur lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/15 text-brand">
            <IconBolt />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight text-foreground">NTO Alliance Cockpit</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-faint">Sojitz × Toshiba × CBMM</p>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:gap-1.5 lg:pb-0">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`group flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition lg:w-full ${
                  active ? "bg-niobium/12 text-niobium" : "text-muted hover:bg-surface-2 hover:text-foreground"
                }`}
              >
                <span className={active ? "text-niobium" : "text-faint group-hover:text-foreground"}>{t.icon}</span>
                <span className="leading-tight">
                  <span className="block text-sm font-medium">{t.label}</span>
                  <span className="hidden text-[10px] uppercase tracking-wider text-faint lg:block">{t.sub}</span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="hidden px-5 pb-5 pt-6 lg:block">
          <div className="rounded-xl border border-border bg-surface-2 p-3">
            <p className="text-[10px] uppercase tracking-wider text-faint">Re-Feed 準拠</p>
            <p className="mt-1 text-lg font-bold text-niobium">
              12.2<span className="ml-0.5 text-xs text-muted">億円 / 年</span>
            </p>
            <p className="mt-1 text-[10px] leading-snug text-muted">中位シナリオ・初年度売上想定</p>
          </div>
        </div>
      </aside>

      {/* main */}
      <main className="flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
          <div>
            <h1 className="text-base font-semibold text-foreground">{TABS.find((t) => t.id === tab)?.label}</h1>
            <p className="text-xs text-faint">ニオブ系次世代電池 × バッテリーパスポート 規制対応プラットフォーム</p>
          </div>
          <Countdown />
        </header>
        <div className="p-6">
          {tab === "supply" && <SupplyChainView />}
          {tab === "passport" && <PassportView />}
          {tab === "compliance" && <ComplianceView />}
          {tab === "revenue" && <RevenueView />}
        </div>
      </main>
    </div>
  );
}

function Countdown() {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date(`${PRIMARY_MILESTONE.date}T00:00:00Z`).getTime();
    setDays(Math.ceil((target - Date.now()) / 86_400_000));
  }, []);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-brand/40 bg-brand/10 px-4 py-2">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
      </span>
      <div className="leading-tight">
        <p className="text-[10px] uppercase tracking-wider text-brand/90">バッテリーパスポート義務化まで</p>
        <p className="tabular text-sm font-bold text-foreground">
          {days === null ? "—" : `あと ${days.toLocaleString("ja-JP")} 日`}
          <span className="ml-2 text-[10px] font-normal text-muted">{PRIMARY_MILESTONE.date} 施行</span>
        </p>
      </div>
    </div>
  );
}

function IconGlobe() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" />
    </svg>
  );
}
function IconId() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="11" r="2" />
      <path d="M13 9h5M13 13h5M5.5 16c.6-1.6 4.4-1.6 5 0" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 4v16h16" />
      <path d="M7 14l3-3 3 3 4-6" />
    </svg>
  );
}
function IconBolt() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L4 14h6l-1 8 9-12h-6z" />
    </svg>
  );
}
