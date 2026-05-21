export type Chemistry = "NTO" | "LFP" | "NMC";

export type ComplianceStatus = "適合" | "要対応" | "審査中";

export type SubscriptionPlan = "Lite" | "Standard" | "Enterprise";

export interface Manufacturer {
  id: string;
  name: string;
  segment: "商用EV" | "電動建機" | "産業機器";
  region: string;
  plan: SubscriptionPlan;
  monthlyFeeJPY: number;
  vehiclesDeployed: number;
  passportsIssued: number;
  cbamCertsYTD: number;
  status: ComplianceStatus;
  avgCfpPerKwh: number;
  onboardedAt: string;
}

export interface CbamRecord {
  id: string;
  manufacturerId: string;
  date: string;
  product: string;
  tonnesCO2: number;
  priceEurPerTonne: number;
  amountJPY: number;
}

export interface VehiclePreset {
  id: string;
  model: string;
  manufacturer: string;
  segment: string;
  capacityKwh: number;
  chemistry: Chemistry;
  renewableShare: number;
  recycledRate: number;
  productionSite: string;
}

export interface CfpBreakdown {
  scope1: number;
  scope2: number;
  scope3: number;
  totalPerKwh: number;
  totalKg: number;
}

export interface MaterialOrigin {
  material: string;
  source: string;
  country: string;
  share: number;
}

export interface Passport {
  passportId: string;
  vehicleId: string;
  model: string;
  manufacturer: string;
  segment: string;
  chemistry: Chemistry;
  capacityKwh: number;
  productionSite: string;
  cfp: CfpBreakdown;
  thresholdPerKwh: number;
  compliant: boolean;
  recycledContent: { material: string; pct: number; min2031: number }[];
  origins: MaterialOrigin[];
  issuedAt: string;
  verifyUrl: string;
}

export interface MonthlyPoint {
  month: string;
  value: number;
}

export interface RevenueMonth {
  month: string;
  passport: number;
  subscription: number;
  battery: number;
  credit: number;
}
