import type {
  CbamRecord,
  Manufacturer,
  MonthlyPoint,
  RevenueMonth,
  VehiclePreset,
} from "./types";

// ---------------------------------------------------------------------------
// Customers (日系商用EV・建機メーカー想定)
// ---------------------------------------------------------------------------
export const manufacturers: Manufacturer[] = [
  {
    id: "isuzu",
    name: "いすゞ自動車",
    segment: "商用EV",
    region: "EU向け輸出",
    plan: "Enterprise",
    monthlyFeeJPY: 1_500_000,
    vehiclesDeployed: 1840,
    passportsIssued: 1620,
    cbamCertsYTD: 36,
    status: "適合",
    avgCfpPerKwh: 41.2,
    onboardedAt: "2025-09",
  },
  {
    id: "hino",
    name: "日野自動車",
    segment: "商用EV",
    region: "EU向け輸出",
    plan: "Enterprise",
    monthlyFeeJPY: 1_350_000,
    vehiclesDeployed: 1310,
    passportsIssued: 1188,
    cbamCertsYTD: 28,
    status: "適合",
    avgCfpPerKwh: 43.0,
    onboardedAt: "2025-10",
  },
  {
    id: "komatsu",
    name: "コマツ",
    segment: "電動建機",
    region: "EU向け輸出",
    plan: "Enterprise",
    monthlyFeeJPY: 1_450_000,
    vehiclesDeployed: 760,
    passportsIssued: 612,
    cbamCertsYTD: 41,
    status: "適合",
    avgCfpPerKwh: 39.4,
    onboardedAt: "2025-08",
  },
  {
    id: "hitachi-kenki",
    name: "日立建機",
    segment: "電動建機",
    region: "EU向け輸出",
    plan: "Standard",
    monthlyFeeJPY: 980_000,
    vehiclesDeployed: 540,
    passportsIssued: 421,
    cbamCertsYTD: 22,
    status: "審査中",
    avgCfpPerKwh: 47.8,
    onboardedAt: "2026-01",
  },
  {
    id: "fuso",
    name: "三菱ふそう",
    segment: "商用EV",
    region: "EU向け輸出",
    plan: "Standard",
    monthlyFeeJPY: 1_050_000,
    vehiclesDeployed: 980,
    passportsIssued: 905,
    cbamCertsYTD: 19,
    status: "適合",
    avgCfpPerKwh: 44.6,
    onboardedAt: "2025-11",
  },
  {
    id: "ud",
    name: "UDトラックス",
    segment: "商用EV",
    region: "EU向け輸出",
    plan: "Lite",
    monthlyFeeJPY: 700_000,
    vehiclesDeployed: 260,
    passportsIssued: 188,
    cbamCertsYTD: 9,
    status: "要対応",
    avgCfpPerKwh: 58.1,
    onboardedAt: "2026-02",
  },
  {
    id: "kubota",
    name: "クボタ",
    segment: "産業機器",
    region: "EU向け輸出",
    plan: "Standard",
    monthlyFeeJPY: 890_000,
    vehiclesDeployed: 430,
    passportsIssued: 357,
    cbamCertsYTD: 14,
    status: "適合",
    avgCfpPerKwh: 45.9,
    onboardedAt: "2025-12",
  },
  {
    id: "tadano",
    name: "タダノ",
    segment: "電動建機",
    region: "EU向け輸出",
    plan: "Lite",
    monthlyFeeJPY: 700_000,
    vehiclesDeployed: 150,
    passportsIssued: 96,
    cbamCertsYTD: 6,
    status: "要対応",
    avgCfpPerKwh: 61.3,
    onboardedAt: "2026-03",
  },
];

// ---------------------------------------------------------------------------
// Battery-passport vehicle presets (発行画面のクイック入力)
// ---------------------------------------------------------------------------
export const vehiclePresets: VehiclePreset[] = [
  {
    id: "elf-ev",
    model: "ELF EV (小型トラック)",
    manufacturer: "いすゞ自動車",
    segment: "商用EV",
    capacityKwh: 40,
    chemistry: "NTO",
    renewableShare: 0.72,
    recycledRate: 0.18,
    productionSite: "東芝 横浜事業所",
  },
  {
    id: "dutro-z",
    model: "デュトロ Z EV",
    manufacturer: "日野自動車",
    segment: "商用EV",
    capacityKwh: 41,
    chemistry: "NTO",
    renewableShare: 0.68,
    recycledRate: 0.15,
    productionSite: "東芝 横浜事業所",
  },
  {
    id: "komatsu-wheel",
    model: "電動ホイールローダ WA-e",
    manufacturer: "コマツ",
    segment: "電動建機",
    capacityKwh: 200,
    chemistry: "NTO",
    renewableShare: 0.8,
    recycledRate: 0.22,
    productionSite: "東芝 横浜事業所",
  },
  {
    id: "hitachi-ze85",
    model: "油圧ショベル ZE85",
    manufacturer: "日立建機",
    segment: "電動建機",
    capacityKwh: 98,
    chemistry: "LFP",
    renewableShare: 0.55,
    recycledRate: 0.1,
    productionSite: "国内協力工場",
  },
  {
    id: "ecanter",
    model: "eCanter (大型仕様)",
    manufacturer: "三菱ふそう",
    segment: "商用EV",
    capacityKwh: 110,
    chemistry: "NTO",
    renewableShare: 0.66,
    recycledRate: 0.16,
    productionSite: "東芝 横浜事業所",
  },
  {
    id: "ud-quon",
    model: "Quon EV (大型トラック)",
    manufacturer: "UDトラックス",
    segment: "商用EV",
    capacityKwh: 240,
    chemistry: "NMC",
    renewableShare: 0.34,
    recycledRate: 0.06,
    productionSite: "海外委託工場",
  },
];

// ---------------------------------------------------------------------------
// CBAM certificate purchase history (代行サービス)
// ---------------------------------------------------------------------------
export const cbamRecords: CbamRecord[] = [
  { id: "cbam-1", manufacturerId: "komatsu", date: "2026-05-12", product: "鋼製フレーム", tonnesCO2: 142, priceEurPerTonne: 78, amountJPY: 1_840_000 },
  { id: "cbam-2", manufacturerId: "isuzu", date: "2026-05-08", product: "アルミ筐体", tonnesCO2: 96, priceEurPerTonne: 78, amountJPY: 1_244_000 },
  { id: "cbam-3", manufacturerId: "hitachi-kenki", date: "2026-04-30", product: "鋼製ブーム", tonnesCO2: 188, priceEurPerTonne: 75, amountJPY: 2_343_000 },
  { id: "cbam-4", manufacturerId: "hino", date: "2026-04-22", product: "鋳鉄部品", tonnesCO2: 74, priceEurPerTonne: 75, amountJPY: 922_000 },
  { id: "cbam-5", manufacturerId: "fuso", date: "2026-04-15", product: "アルミホイール", tonnesCO2: 58, priceEurPerTonne: 74, amountJPY: 713_000 },
  { id: "cbam-6", manufacturerId: "komatsu", date: "2026-03-28", product: "鋼製カウンタウェイト", tonnesCO2: 210, priceEurPerTonne: 72, amountJPY: 2_512_000 },
  { id: "cbam-7", manufacturerId: "kubota", date: "2026-03-19", product: "鋼製シャシ", tonnesCO2: 88, priceEurPerTonne: 72, amountJPY: 1_052_000 },
  { id: "cbam-8", manufacturerId: "isuzu", date: "2026-03-05", product: "アルミ筐体", tonnesCO2: 101, priceEurPerTonne: 70, amountJPY: 1_175_000 },
];

// ---------------------------------------------------------------------------
// Time series — 18ヶ月 (2024-12 〜 2026-05)
// ---------------------------------------------------------------------------
const MONTHS = buildMonths("2024-12", 18);

function buildMonths(start: string, count: number): string[] {
  const [y, m] = start.split("-").map(Number);
  const out: string[] = [];
  const d = new Date(Date.UTC(y, m - 1, 1));
  for (let i = 0; i < count; i++) {
    out.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`);
    d.setUTCMonth(d.getUTCMonth() + 1);
  }
  return out;
}

// Deterministic revenue ramp; trailing-12-month total lands near 12.2億円 (Re-Feed準拠).
export const revenueSeries: RevenueMonth[] = MONTHS.map((month, i) => {
  const t = i / (MONTHS.length - 1);
  const subscribers = Math.round(28 + 54 * t); // 28 → 82社
  const avgFee = 700_000 + 230_000 * t; // ARPU 70万 → 93万
  const subscription = Math.round(subscribers * avgFee);

  const passportsPerMonth = Math.round(120 + 380 * t * t); // 加速度的に増加
  const unit = 50_000 + 30_000 * t;
  const passport = Math.round(passportsPerMonth * unit);

  const battery = Math.round((90_000_000 + 230_000_000 * t) * (0.7 + 0.3 * wave(i)));
  const credit = Math.round(35_000_000 * Math.max(0, t - 0.15) * (0.8 + 0.4 * wave(i + 2)));

  return { month, passport, subscription, battery, credit };
});

function wave(i: number) {
  return (Math.sin(i * 1.3) + 1) / 2;
}

export const cfpTrend: MonthlyPoint[] = MONTHS.slice(6).map((month, i) => ({
  month,
  // 平均CFPが規制閾値に向けて低減していくトレンド (kgCO2e/kWh)
  value: Math.round((58 - i * 1.05 + wave(i) * 1.4) * 10) / 10,
}));

export const passportsIssuedTrend: MonthlyPoint[] = revenueSeries.map((r) => ({
  month: r.month,
  value: Math.round(120 + 380 * Math.pow((MONTHS.indexOf(r.month)) / (MONTHS.length - 1), 2)),
}));

// ---------------------------------------------------------------------------
// Supply-chain map nodes (equirectangular lat/long)
// ---------------------------------------------------------------------------
export interface MapNode {
  id: string;
  label: string;
  sub: string;
  lat: number;
  lng: number;
  kind: "upstream" | "midstream" | "market";
}

export const mapNodes: MapNode[] = [
  { id: "cbmm", label: "CBMM Araxá", sub: "ニオブ原料 / 上流", lat: -19.6, lng: -46.9, kind: "upstream" },
  { id: "toshiba", label: "東芝 横浜事業所", sub: "NTO電池製造 / 中流", lat: 35.45, lng: 139.6, kind: "midstream" },
  { id: "eu", label: "EU 市場", sub: "パスポート義務化 / 需要", lat: 50.8, lng: 6.5, kind: "market" },
];

export interface MapFlow {
  from: string;
  to: string;
  label: string;
}

export const mapFlows: MapFlow[] = [
  { from: "cbmm", to: "toshiba", label: "ニオブ原料供給" },
  { from: "toshiba", to: "eu", label: "NTO電池搭載車輸出" },
];

// ---------------------------------------------------------------------------
// Regulatory milestones (countdown source)
// ---------------------------------------------------------------------------
export interface Milestone {
  date: string;
  label: string;
  detail: string;
}

export const milestones: Milestone[] = [
  { date: "2026-01-01", label: "EU CBAM 本格適用", detail: "鉄鋼・アルミ等の輸入に証明書購入義務" },
  { date: "2027-01-01", label: "再生材使用量表示", detail: "EV用・産業用バッテリーに表示義務" },
  { date: "2027-02-18", label: "バッテリーパスポート義務化", detail: "EV用・産業用2kW以上・LMT用が対象" },
  { date: "2027-07-01", label: "CFP上限値適用", detail: "EV用バッテリーのカーボンフットプリント上限" },
  { date: "2030-01-01", label: "再生材最低比率", detail: "Li/Ni/Co等の最低リサイクル比率" },
];

// 主たるカウントダウン基準: バッテリーパスポート義務化
export const PRIMARY_MILESTONE = milestones[2];

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------
export function toOku(jpy: number): string {
  return (jpy / 1e8).toFixed(2);
}
export function toManYen(jpy: number): string {
  return Math.round(jpy / 1e4).toLocaleString("ja-JP");
}
export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("ja-JP");
}
export function fmtMonth(m: string): string {
  const [, mm] = m.split("-");
  return `${Number(mm)}月`;
}
