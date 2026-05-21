import type { CfpBreakdown, Chemistry, MaterialOrigin, Passport } from "./types";

// Illustrative cradle-to-gate cell-production intensity (kgCO2e / kWh) by chemistry.
// NTO (Toshiba SCiB™ ニオブチタン酸化物) is lowest thanks to long cycle life and
// the niobium chemistry; NMC is highest. Values are demo figures, not certified.
const BASE_INTENSITY: Record<Chemistry, number> = {
  NTO: 48,
  LFP: 62,
  NMC: 79,
};

// EU Battery Regulation CFP ceiling proxy used for the cockpit demo (kgCO2e/kWh).
export const CFP_THRESHOLD_PER_KWH = 70;

const SCOPE_SPLIT = { s1: 0.08, s2: 0.42, s3: 0.5 } as const;

export interface CfpInputs {
  chemistry: Chemistry;
  capacityKwh: number;
  renewableShare: number; // 0..1 share of renewable electricity at the cell plant
  recycledRate: number; // 0..1 average recycled material content
}

export function computeCfp(inputs: CfpInputs): CfpBreakdown {
  const base = BASE_INTENSITY[inputs.chemistry];
  const renewable = clamp01(inputs.renewableShare);
  const recycled = clamp01(inputs.recycledRate);

  const scope1 = base * SCOPE_SPLIT.s1;
  // Renewable power at the plant cuts most of the electricity-driven Scope 2.
  const scope2 = base * SCOPE_SPLIT.s2 * (1 - 0.8 * renewable);
  // Recycled feedstock cuts upstream-material Scope 3.
  const scope3 = base * SCOPE_SPLIT.s3 * (1 - 0.35 * recycled);

  const totalPerKwh = round1(scope1 + scope2 + scope3);
  return {
    scope1: round1(scope1),
    scope2: round1(scope2),
    scope3: round1(scope3),
    totalPerKwh,
    totalKg: Math.round(totalPerKwh * inputs.capacityKwh),
  };
}

function originsFor(chemistry: Chemistry): MaterialOrigin[] {
  const common: MaterialOrigin[] = [
    {
      material: "ニオブ (Nb)",
      source: "CBMM Araxá 鉱山",
      country: "ブラジル",
      share: 0.82,
    },
    {
      material: "チタン (Ti)",
      source: "国内製錬",
      country: "日本",
      share: 0.64,
    },
    {
      material: "リチウム (Li)",
      source: "豪州スポジュメン",
      country: "オーストラリア",
      share: 0.71,
    },
  ];
  if (chemistry === "NMC") {
    common.push(
      { material: "ニッケル (Ni)", source: "精錬輸入", country: "インドネシア", share: 0.58 },
      { material: "コバルト (Co)", source: "認証鉱山", country: "コンゴ民主共和国", share: 0.41 },
    );
  }
  if (chemistry === "LFP") {
    common.push({ material: "リン酸鉄", source: "化成品", country: "日本", share: 0.77 });
  }
  return common;
}

function recycledContentFor(chemistry: Chemistry, recycledRate: number) {
  const r = clamp01(recycledRate);
  // 2031 minimum recycled-content targets under the EU Battery Regulation (illustrative).
  const rows = [
    { material: "リチウム", min2031: 6 },
    { material: "ニッケル", min2031: 6 },
    { material: "コバルト", min2031: 16 },
  ];
  if (chemistry === "NTO") rows.unshift({ material: "ニオブ", min2031: 8 });
  return rows.map((row, i) => ({
    material: row.material,
    min2031: row.min2031,
    pct: Math.round((r * 100 - i * 1.5) * 10) / 10,
  }));
}

let seq = 1042;

export function issuePassport(input: {
  vehicleId: string;
  model: string;
  manufacturer: string;
  segment: string;
  chemistry: Chemistry;
  capacityKwh: number;
  productionSite: string;
  renewableShare: number;
  recycledRate: number;
}): Passport {
  const cfp = computeCfp(input);
  const passportId = `BP-${new Date().getFullYear()}-${String(seq++).padStart(6, "0")}`;
  return {
    passportId,
    vehicleId: input.vehicleId,
    model: input.model,
    manufacturer: input.manufacturer,
    segment: input.segment,
    chemistry: input.chemistry,
    capacityKwh: input.capacityKwh,
    productionSite: input.productionSite,
    cfp,
    thresholdPerKwh: CFP_THRESHOLD_PER_KWH,
    compliant: cfp.totalPerKwh <= CFP_THRESHOLD_PER_KWH,
    recycledContent: recycledContentFor(input.chemistry, input.recycledRate),
    origins: originsFor(input.chemistry),
    issuedAt: new Date().toISOString(),
    verifyUrl: `https://passport.sojitz-nto.example/v/${passportId}`,
  };
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}
function round1(n: number) {
  return Math.round(n * 10) / 10;
}
