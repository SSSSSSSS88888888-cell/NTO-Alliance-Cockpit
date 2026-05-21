"use client";

import { Donut, StackLegend, StackedAreaChart } from "@/components/charts";
import { Card, SectionTitle, Stat } from "@/components/ui";
import { fmtInt, fmtMonth, revenueSeries, toOku } from "@/lib/data";

const COLORS = {
  subscription: "#2dd4bf",
  passport: "#38bdf8",
  battery: "#818cf8",
  credit: "#fbbf24",
};

export function RevenueView() {
  const last12 = revenueSeries.slice(-12);
  const sum = (k: "passport" | "subscription" | "battery" | "credit") =>
    last12.reduce((s, m) => s + m[k], 0);

  const ttmPassport = sum("passport");
  const ttmSub = sum("subscription");
  const ttmBattery = sum("battery");
  const ttmCredit = sum("credit");
  const ttmTotal = ttmPassport + ttmSub + ttmBattery + ttmCredit;

  const latest = revenueSeries[revenueSeries.length - 1];
  const prev = revenueSeries[revenueSeries.length - 2];
  const latestTotal = latest.passport + latest.subscription + latest.battery + latest.credit;
  const prevTotal = prev.passport + prev.subscription + prev.battery + prev.credit;
  const mom = ((latestTotal - prevTotal) / prevTotal) * 100;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card glow className="p-4">
          <Stat label="TTM 売上 (直近12ヶ月)" value={`${toOku(ttmTotal)}`} unit="億円" accent="niobium" delta="Re-Feed準拠 12.2億円 ライン" />
        </Card>
        <Card className="p-4">
          <Stat label="当月売上" value={`${toOku(latestTotal)}`} unit="億円" accent="sky" delta={`前月比 ${mom >= 0 ? "+" : ""}${mom.toFixed(1)}%`} />
        </Card>
        <Card className="p-4">
          <Stat label="サブスクMRR比率" value={`${Math.round((ttmSub / ttmTotal) * 100)}`} unit="%" accent="indigo" />
        </Card>
        <Card className="p-4">
          <Stat label="想定粗利率 (加重)" value="28" unit="%" accent="amber" />
        </Card>
      </div>

      <Card className="p-5">
        <SectionTitle
          title="月次売上構成 (4収益ライン)"
          hint="2024-12 〜 2026-05 · 商材トレード × データサービス × クレジット"
          right={<StackLegend />}
        />
        <div className="mt-4">
          <StackedAreaChart data={revenueSeries} labels={revenueSeries.map((r) => fmtMonth(r.month))} />
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5">
          <SectionTitle title="TTM 収益構成" hint="直近12ヶ月の売上ミックス" />
          <div className="mt-4">
            <Donut
              centerLabel={`${toOku(ttmTotal)}`}
              centerSub="億円 / TTM"
              segments={[
                { label: "コンプライアンス・サブスク", value: ttmSub, color: COLORS.subscription },
                { label: "パスポート発行", value: ttmPassport, color: COLORS.passport },
                { label: "NTO電池販売手数料", value: ttmBattery, color: COLORS.battery },
                { label: "カーボンクレジット", value: ttmCredit, color: COLORS.credit },
              ]}
            />
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <SectionTitle title="収益ライン別 KPI" hint="直近12ヶ月実績と単価前提" />
          <div className="mt-3 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface-2 text-left text-xs text-muted">
                <tr>
                  <th className="px-4 py-2.5 font-medium">収益ライン</th>
                  <th className="px-4 py-2.5 text-right font-medium">TTM売上</th>
                  <th className="px-4 py-2.5 text-right font-medium">構成比</th>
                  <th className="px-4 py-2.5 font-medium">単価前提</th>
                </tr>
              </thead>
              <tbody>
                <KpiRow color={COLORS.subscription} name="コンプライアンス・サブスク" v={ttmSub} total={ttmTotal} note="月70〜150万円 × 80社" />
                <KpiRow color={COLORS.passport} name="パスポート発行" v={ttmPassport} total={ttmTotal} note="5〜8万円 / 台" />
                <KpiRow color={COLORS.battery} name="NTO電池販売手数料" v={ttmBattery} total={ttmTotal} note="車両単価の5〜8%" />
                <KpiRow color={COLORS.credit} name="カーボンクレジット" v={ttmCredit} total={ttmTotal} note="5,000円 / t-CO₂ (EFM経由)" />
              </tbody>
              <tfoot>
                <tr className="border-t border-border-strong bg-surface-2">
                  <td className="px-4 py-2.5 font-semibold text-foreground">合計</td>
                  <td className="px-4 py-2.5 text-right tabular font-semibold text-niobium">{toOku(ttmTotal)}億円</td>
                  <td className="px-4 py-2.5 text-right text-faint">100%</td>
                  <td className="px-4 py-2.5 text-faint">初年度Re-Feed準拠</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-faint">
            ※ 月次発行件数 {fmtInt(120)}→{fmtInt(500)}件、サブスク契約 28→82社の成長を前提とした中位シナリオ。
          </p>
        </Card>
      </div>
    </div>
  );
}

function KpiRow({ color, name, v, total, note }: { color: string; name: string; v: number; total: number; note: string }) {
  return (
    <tr>
      <td className="px-4 py-2.5">
        <span className="inline-flex items-center gap-2 font-medium text-foreground">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} />
          {name}
        </span>
      </td>
      <td className="px-4 py-2.5 text-right tabular text-foreground">{toOku(v)}億円</td>
      <td className="px-4 py-2.5 text-right tabular text-muted">{Math.round((v / total) * 100)}%</td>
      <td className="px-4 py-2.5 text-muted">{note}</td>
    </tr>
  );
}
