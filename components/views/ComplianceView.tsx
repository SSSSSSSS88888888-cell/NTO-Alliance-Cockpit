"use client";

import { LineChart } from "@/components/charts";
import { Badge, Card, SectionTitle } from "@/components/ui";
import { CFP_THRESHOLD_PER_KWH } from "@/lib/cfp";
import {
  cbamRecords,
  cfpTrend,
  fmtInt,
  fmtMonth,
  manufacturers,
  milestones,
  toManYen,
} from "@/lib/data";
import type { ComplianceStatus } from "@/lib/types";

const statusTone: Record<ComplianceStatus, "ok" | "warn" | "info"> = {
  適合: "ok",
  要対応: "warn",
  審査中: "info",
};

function daysUntil(dateStr: string) {
  const target = new Date(`${dateStr}T00:00:00Z`).getTime();
  return Math.ceil((target - Date.now()) / 86_400_000);
}

export function ComplianceView() {
  const totalCbam = cbamRecords.reduce((s, r) => s + r.amountJPY, 0);

  return (
    <div className="space-y-5">
      {/* milestone countdown strip */}
      <Card className="p-5">
        <SectionTitle title="規制施行カウントダウン" hint="EU電池規則・CBAM・改正資源法の主要マイルストン" />
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {milestones.map((m) => {
            const d = daysUntil(m.date);
            const passed = d < 0;
            const primary = m.date === "2027-02-18";
            return (
              <div
                key={m.date}
                className={`rounded-xl border p-3 ${
                  primary ? "border-brand/50 bg-brand/10" : "border-border bg-surface-2"
                }`}
              >
                <p className="text-[11px] text-faint">{m.date}</p>
                <p className="mt-1 text-xs font-semibold text-foreground">{m.label}</p>
                <p className="mt-2 tabular text-lg font-bold">
                  {passed ? (
                    <span className="text-faint">施行済</span>
                  ) : (
                    <span className={primary ? "text-brand" : "text-niobium"}>あと {fmtInt(d)}日</span>
                  )}
                </p>
                <p className="mt-1 text-[10px] leading-snug text-muted">{m.detail}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* CFP trend */}
        <Card className="p-5">
          <SectionTitle title="提携メーカー平均CFP推移" hint={`EU上限値 ${CFP_THRESHOLD_PER_KWH} kgCO₂e/kWh に対する低減トレンド`} />
          <div className="mt-3">
            <LineChart
              data={cfpTrend.map((p) => p.value)}
              labels={cfpTrend.map((p) => fmtMonth(p.month))}
              threshold={{ value: CFP_THRESHOLD_PER_KWH, label: "EU上限" }}
              unit=""
            />
          </div>
        </Card>

        {/* CBAM history */}
        <Card className="p-5">
          <SectionTitle
            title="CBAM証明書 購入代行履歴"
            hint="EU CBAM 2026/1本格適用に対応"
            right={<span className="tabular text-sm text-niobium">¥{toManYen(totalCbam)}万 / YTD</span>}
          />
          <div className="mt-3 max-h-[230px] overflow-auto rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-surface-2 text-left text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">日付</th>
                  <th className="px-3 py-2 font-medium">メーカー</th>
                  <th className="px-3 py-2 font-medium">対象品目</th>
                  <th className="px-3 py-2 text-right font-medium">t-CO₂</th>
                  <th className="px-3 py-2 text-right font-medium">金額</th>
                </tr>
              </thead>
              <tbody>
                {cbamRecords.map((r, i) => {
                  const mfr = manufacturers.find((m) => m.id === r.manufacturerId);
                  return (
                    <tr key={r.id} className={i % 2 ? "bg-surface/40" : ""}>
                      <td className="px-3 py-2 text-faint">{r.date.slice(5)}</td>
                      <td className="px-3 py-2 text-foreground">{mfr?.name ?? r.manufacturerId}</td>
                      <td className="px-3 py-2 text-muted">{r.product}</td>
                      <td className="px-3 py-2 text-right tabular text-muted">{r.tonnesCO2}</td>
                      <td className="px-3 py-2 text-right tabular text-sky">¥{toManYen(r.amountJPY)}万</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* manufacturer table */}
      <Card className="p-5">
        <SectionTitle title="提携メーカー コンプライアンス状況" hint="サブスク契約・搭載台数・平均CFP・規制適合ステータス" />
        <div className="mt-3 overflow-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-xs text-muted">
              <tr>
                <th className="px-4 py-2.5 font-medium">メーカー</th>
                <th className="px-4 py-2.5 font-medium">セグメント</th>
                <th className="px-4 py-2.5 font-medium">プラン</th>
                <th className="px-4 py-2.5 text-right font-medium">搭載台数</th>
                <th className="px-4 py-2.5 text-right font-medium">発行済</th>
                <th className="px-4 py-2.5 text-right font-medium">平均CFP</th>
                <th className="px-4 py-2.5 text-right font-medium">月額</th>
                <th className="px-4 py-2.5 text-center font-medium">状態</th>
              </tr>
            </thead>
            <tbody>
              {manufacturers.map((m, i) => (
                <tr key={m.id} className={i % 2 ? "bg-surface/40" : ""}>
                  <td className="px-4 py-2.5 font-medium text-foreground">{m.name}</td>
                  <td className="px-4 py-2.5 text-muted">{m.segment}</td>
                  <td className="px-4 py-2.5 text-muted">{m.plan}</td>
                  <td className="px-4 py-2.5 text-right tabular text-muted">{fmtInt(m.vehiclesDeployed)}</td>
                  <td className="px-4 py-2.5 text-right tabular text-muted">{fmtInt(m.passportsIssued)}</td>
                  <td className={`px-4 py-2.5 text-right tabular ${m.avgCfpPerKwh <= CFP_THRESHOLD_PER_KWH ? "text-niobium" : "text-brand"}`}>
                    {m.avgCfpPerKwh.toFixed(1)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular text-sky">¥{toManYen(m.monthlyFeeJPY)}万</td>
                  <td className="px-4 py-2.5 text-center">
                    <Badge tone={statusTone[m.status]}>{m.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
