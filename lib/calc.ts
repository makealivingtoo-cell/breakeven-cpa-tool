export type Mode = "leadgen" | "ecom";

export type Inputs = {
  mode: Mode;
  monthlyBudget: number;

  // Lead gen
  closeRate: number; // 0-1
  revenuePerClose: number; // $

  // Ecommerce
  conversionRate: number; // 0-1 (reference only)
  aov: number; // $

  // Shared
  grossMargin: number; // 0-1
  safetyBuffer: number; // 0-1 (e.g. 0.2 = 20%)
};

export type CoreOutputs = {
  profitPerConversion: number; // before ads
  breakevenCPA: number;
  targetCPA: number;
  maxCPL: number | null;
};

export type ScenarioRow = {
  label: string;
  assumedCPA: number;
  profitAtBudget: number;
  status: "SAFE" | "TIGHT" | "LOSING";
};

export type ProOutputs = {
  scenarios: ScenarioRow[];
  scalingTable: Array<{
    budget: number;
    conversions: number;
    profit: number;
    risk: "LOW" | "MED" | "HIGH";
  }>;
};

function clamp01(x: number) {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function statusFromProfit(p: number): "SAFE" | "TIGHT" | "LOSING" {
  if (p > 0) return "SAFE";
  if (p === 0) return "TIGHT";
  return "LOSING";
}

export function computeCore(inputs: Inputs): CoreOutputs {
  const gm = clamp01(inputs.grossMargin);
  const buf = clamp01(inputs.safetyBuffer);

  const revenuePerConversion =
    inputs.mode === "leadgen" ? inputs.revenuePerClose : inputs.aov;

  const profitPerConversion = Math.max(0, revenuePerConversion * gm);

  const breakevenCPA = profitPerConversion;
  const targetCPA = breakevenCPA * (1 - buf);

  const maxCPL =
    inputs.mode === "leadgen"
      ? breakevenCPA * clamp01(inputs.closeRate)
      : null;

  return { profitPerConversion, breakevenCPA, targetCPA, maxCPL };
}

export function profitAtBudget(args: {
  monthlyBudget: number;
  assumedCPA: number;
  profitPerConversion: number;
}) {
  const budget = Math.max(0, args.monthlyBudget);
  const cpa = Math.max(0.01, args.assumedCPA);
  const conversions = budget / cpa;
  const profit = conversions * args.profitPerConversion - budget;
  return { conversions, profit };
}

export function computePro(inputs: Inputs): ProOutputs {
  const core = computeCore(inputs);
  const budget = Math.max(0, inputs.monthlyBudget);

  const scenarioDefs = [
    { label: "Base", mult: 1.0 },
    { label: "CPA +10%", mult: 1.1 },
    { label: "CPA +20%", mult: 1.2 },
    { label: "CPA +30%", mult: 1.3 },
  ];

  const scenarios: ScenarioRow[] = scenarioDefs.map((s) => {
    const assumedCPA = Math.max(0.01, core.targetCPA * s.mult);
    const { profit } = profitAtBudget({
      monthlyBudget: budget,
      assumedCPA,
      profitPerConversion: core.profitPerConversion,
    });

    return {
      label: s.label,
      assumedCPA,
      profitAtBudget: profit,
      status: statusFromProfit(Math.round(profit)),
    };
  });

  const scaleMultipliers = [0.5, 1, 2, 3];
  const scalingTable = scaleMultipliers.map((m) => {
    const b = Math.round(budget * m);
    const { conversions, profit } = profitAtBudget({
      monthlyBudget: b,
      assumedCPA: Math.max(0.01, core.targetCPA),
      profitPerConversion: core.profitPerConversion,
    });

    const risk: "LOW" | "MED" | "HIGH" =
      profit > 0 ? (m <= 1 ? "LOW" : m <= 2 ? "MED" : "HIGH") : "HIGH";

    return { budget: b, conversions, profit, risk };
  });

  return { scenarios, scalingTable };
}
