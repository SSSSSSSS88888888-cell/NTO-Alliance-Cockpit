"use client";

import { WorldMap } from "@/components/WorldMap";
import { Badge, Card, SectionTitle, Stat } from "@/components/ui";
import { fmtInt, manufacturers } from "@/lib/data";

const stages = [
  {
    tag: "上流",
    title: "CBMM ニオブ原料",
    body: "双日が株主・日本市場総代理店。世界シェア80%超のニオブをトレース付きで供給。",
    accent: "amber" as const,
  },
  {
    tag: "中流",
    title: "東芝 NTO電池製造",
    body: "SCiB™ ニオブチタン酸化物セル。超急速充電10分・長寿命で低CFP。",
    accent: "niobium" as const,
  },
  {
    tag: "搭載・発行",
    title: "バッテリーパスポート",
    body: "車両IDからCFP算定・原産地証明・QR発行。2027/2/18義務化に対応。",
    accent: "sky" as const,
  },
  {
    tag: "継続支援",
    title: "CBAM コンプライアンス",
    body: "CFP月次レポート・再生材比率・CBAM証明書購入代行のサブスク。",
    accent: "indigo" as const,
  },
];

const money = [
  { label: "ニオブ原料", flow: "CBMM → 双日 → 東芝", note: "粗利率 15%" },
  { label: "NTO電池セル", flow: "東芝 → 双日 → メーカー", note: "販売手数料 5–8%" },
  { label: "パスポート発行", flow: "メーカー → 双日", note: "1台あたり 8万円" },
  { label: "CBAM/CFPサブスク", flow: "メーカー → 双日", note: "月100万円 × 150社" },
  { label: "カーボンクレジット", flow: "EFM Sojitz Mgmt → 双日 → メーカー", note: "粗利 25%" },
];

export function SupplyChainView() {
  const totalVehicles = manufacturers.reduce((s, m) => s + m.vehiclesDeployed, 0);
  const totalPassports = manufacturers.reduce((s, m) => s + m.passportsIssued, 0);
  const compliant = manufacturers.filter((m) => m.status === "適合").length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-4">
          <Stat label="提携メーカー" value={fmtInt(manufacturers.length)} unit="社" accent="sky" />
        </Card>
        <Card className="p-4">
          <Stat label="NTO電池搭載車" value={fmtInt(totalVehicles)} unit="台" accent="niobium" delta="▲ 直近四半期 +18%" />
        </Card>
        <Card className="p-4">
          <Stat label="発行済パスポート" value={fmtInt(totalPassports)} unit="件" accent="indigo" />
        </Card>
        <Card className="p-4">
          <Stat label="規制適合率" value={`${Math.round((compliant / manufacturers.length) * 100)}`} unit="%" accent="amber" />
        </Card>
      </div>

      <Card glow className="p-3">
        <WorldMap />
      </Card>

      <Card className="p-5">
        <SectionTitle title="一気通貫スキーム" hint="上流ニオブ → 中流NTO電池 → パスポート発行 → 継続コンプライアンス支援" />
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {stages.map((s, i) => (
            <div key={s.title} className="relative rounded-xl border border-border bg-surface-2 p-4">
              <div className="mb-2 flex items-center justify-between">
                <Badge tone={i === 0 ? "warn" : i === 3 ? "info" : "ok"}>{s.tag}</Badge>
                <span className="tabular text-xs text-faint">0{i + 1}</span>
              </div>
              <p className={`text-sm font-semibold text-${s.accent}`}>{s.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <SectionTitle title="カネの流れ" hint="商材トレード × データサービス × 金融機能の統合パッケージ" />
        <div className="mt-3 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2 text-left text-xs text-muted">
                <th className="px-4 py-2.5 font-medium">収益ライン</th>
                <th className="px-4 py-2.5 font-medium">フロー</th>
                <th className="px-4 py-2.5 text-right font-medium">条件</th>
              </tr>
            </thead>
            <tbody>
              {money.map((m, i) => (
                <tr key={m.label} className={i % 2 ? "bg-surface/40" : ""}>
                  <td className="px-4 py-2.5 font-medium text-foreground">{m.label}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-sky">{m.flow}</td>
                  <td className="px-4 py-2.5 text-right text-niobium">{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
