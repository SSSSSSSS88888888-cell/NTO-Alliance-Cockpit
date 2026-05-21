"use client";

import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Gauge } from "@/components/charts";
import { Badge, Card, ProgressBar, SectionTitle } from "@/components/ui";
import { CFP_THRESHOLD_PER_KWH, computeCfp, issuePassport } from "@/lib/cfp";
import { vehiclePresets } from "@/lib/data";
import type { Chemistry, Passport } from "@/lib/types";

const CHEMS: { key: Chemistry; label: string }[] = [
  { key: "NTO", label: "NTO (東芝SCiB™)" },
  { key: "LFP", label: "LFP" },
  { key: "NMC", label: "NMC" },
];

export function PassportView() {
  const [presetId, setPresetId] = useState(vehiclePresets[0].id);
  const preset = vehiclePresets.find((p) => p.id === presetId)!;

  const [vehicleId, setVehicleId] = useState("JP-EV-000128");
  const [chemistry, setChemistry] = useState<Chemistry>(preset.chemistry);
  const [capacity, setCapacity] = useState(preset.capacityKwh);
  const [renewable, setRenewable] = useState(Math.round(preset.renewableShare * 100));
  const [recycled, setRecycled] = useState(Math.round(preset.recycledRate * 100));
  const [passport, setPassport] = useState<Passport | null>(null);

  function applyPreset(id: string) {
    const p = vehiclePresets.find((x) => x.id === id)!;
    setPresetId(id);
    setChemistry(p.chemistry);
    setCapacity(p.capacityKwh);
    setRenewable(Math.round(p.renewableShare * 100));
    setRecycled(Math.round(p.recycledRate * 100));
  }

  const livePreview = useMemo(
    () => computeCfp({ chemistry, capacityKwh: capacity, renewableShare: renewable / 100, recycledRate: recycled / 100 }),
    [chemistry, capacity, renewable, recycled],
  );

  function issue() {
    setPassport(
      issuePassport({
        vehicleId,
        model: preset.model,
        manufacturer: preset.manufacturer,
        segment: preset.segment,
        chemistry,
        capacityKwh: capacity,
        productionSite: preset.productionSite,
        renewableShare: renewable / 100,
        recycledRate: recycled / 100,
      }),
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-5">
      {/* form */}
      <Card className="space-y-5 p-5 xl:col-span-2">
        <SectionTitle title="バッテリーパスポート発行" hint="車両情報からCFP・原産地・再生材比率を自動算定" />

        <Field label="車両プリセット">
          <select
            value={presetId}
            onChange={(e) => applyPreset(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-niobium"
          >
            {vehiclePresets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.manufacturer} — {p.model}
              </option>
            ))}
          </select>
        </Field>

        <Field label="車両ID">
          <input
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-niobium"
          />
        </Field>

        <Field label="電池化学">
          <div className="grid grid-cols-3 gap-2">
            {CHEMS.map((c) => (
              <button
                key={c.key}
                onClick={() => setChemistry(c.key)}
                className={`rounded-lg border px-2 py-2 text-xs transition ${
                  chemistry === c.key
                    ? "border-niobium bg-niobium/15 text-niobium"
                    : "border-border bg-surface-2 text-muted hover:border-border-strong"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label={`電池容量 — ${capacity} kWh`}>
          <input
            type="range"
            min={20}
            max={300}
            step={1}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="w-full accent-niobium"
          />
        </Field>

        <Field label={`再エネ電力比率 (製造時) — ${renewable}%`}>
          <input type="range" min={0} max={100} value={renewable} onChange={(e) => setRenewable(Number(e.target.value))} className="w-full accent-sky" />
        </Field>

        <Field label={`平均再生材比率 — ${recycled}%`}>
          <input type="range" min={0} max={60} value={recycled} onChange={(e) => setRecycled(Number(e.target.value))} className="w-full accent-indigo" />
        </Field>

        <div className="rounded-xl border border-border bg-surface-2 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">ライブCFPプレビュー</span>
            <span className={livePreview.totalPerKwh <= CFP_THRESHOLD_PER_KWH ? "text-niobium" : "text-brand"}>
              {livePreview.totalPerKwh} kgCO₂e/kWh
            </span>
          </div>
          <div className="mt-2">
            <ProgressBar value={livePreview.totalPerKwh} max={90} tone={livePreview.totalPerKwh <= CFP_THRESHOLD_PER_KWH ? "niobium" : "brand"} />
          </div>
        </div>

        <button
          onClick={issue}
          className="w-full rounded-xl bg-niobium px-4 py-2.5 text-sm font-semibold text-[#04231f] transition hover:brightness-110"
        >
          パスポートを発行 →
        </button>
      </Card>

      {/* result */}
      <Card className="p-5 xl:col-span-3">
        {!passport ? (
          <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
            <div className="mb-3 text-4xl">🔋</div>
            <p className="text-sm text-muted">車両情報を入力し「パスポートを発行」を押すと、<br />EU電池規則準拠のデジタルパスポートが生成されます。</p>
          </div>
        ) : (
          <PassportResult passport={passport} />
        )}
      </Card>
    </div>
  );
}

function PassportResult({ passport }: { passport: Passport }) {
  return (
    <div className="fade-rise space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-semibold text-foreground">{passport.passportId}</span>
            <Badge tone={passport.compliant ? "ok" : "warn"}>{passport.compliant ? "規制適合" : "要対応"}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted">
            {passport.manufacturer} · {passport.model}
          </p>
          <p className="text-xs text-faint">
            車両ID {passport.vehicleId} · {passport.chemistry} · {passport.capacityKwh}kWh · {passport.productionSite}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-white p-2">
          <QRCodeSVG value={passport.verifyUrl} size={92} bgColor="#ffffff" fgColor="#06101f" level="M" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface-2 p-4">
          <p className="mb-1 text-xs text-muted">カーボンフットプリント (ISO 14067)</p>
          <Gauge value={passport.cfp.totalPerKwh} max={90} threshold={passport.thresholdPerKwh} unit="kgCO₂e / kWh" />
          <p className="mt-1 text-center text-xs text-faint">
            EU上限値 {passport.thresholdPerKwh} に対し {passport.compliant ? "適合" : "超過"} · 総排出 {passport.cfp.totalKg.toLocaleString("ja-JP")} kgCO₂e
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface-2 p-4">
          <p className="mb-3 text-xs text-muted">Scope別内訳 (kgCO₂e/kWh)</p>
          <ScopeRow label="Scope 1 — 直接排出" value={passport.cfp.scope1} total={passport.cfp.totalPerKwh} tone="amber" />
          <ScopeRow label="Scope 2 — 電力" value={passport.cfp.scope2} total={passport.cfp.totalPerKwh} tone="sky" />
          <ScopeRow label="Scope 3 — 上流材料・輸送" value={passport.cfp.scope3} total={passport.cfp.totalPerKwh} tone="indigo" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface-2 p-4">
          <p className="mb-3 text-xs text-muted">原材料の原産地証明</p>
          <div className="space-y-2.5">
            {passport.origins.map((o) => (
              <div key={o.material} className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-foreground">{o.material}</span>
                  <span className="ml-2 text-faint">{o.source} · {o.country}</span>
                </div>
                <span className="tabular text-niobium">{Math.round(o.share * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface-2 p-4">
          <p className="mb-3 text-xs text-muted">再生材含有率 (2031年最低比率対比)</p>
          <div className="space-y-3">
            {passport.recycledContent.map((r) => (
              <div key={r.material}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-foreground">{r.material}</span>
                  <span className="tabular text-muted">
                    {Math.max(0, r.pct).toFixed(1)}% <span className="text-faint">/ 最低 {r.min2031}%</span>
                  </span>
                </div>
                <ProgressBar value={Math.max(0, r.pct)} max={Math.max(r.min2031 * 2, 20)} tone={r.pct >= r.min2031 ? "niobium" : "amber"} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-[11px] text-faint">
        検証URL: <span className="font-mono text-sky">{passport.verifyUrl}</span> · ブロックチェーン記録 (デモ)
      </p>
    </div>
  );
}

function ScopeRow({ label, value, total, tone }: { label: string; value: number; total: number; tone: "amber" | "sky" | "indigo" }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-foreground">{label}</span>
        <span className="tabular text-muted">{value}</span>
      </div>
      <ProgressBar value={value} max={total} tone={tone} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-muted">{label}</span>
      {children}
    </label>
  );
}
