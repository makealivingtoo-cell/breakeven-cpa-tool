"use client";

import { useEffect, useMemo, useState } from "react";
import { computeCore, computePro, Inputs, Mode } from "@/lib/calc";

function money(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return `$${v.toFixed(2)}`;
}

function pct01(x: number, digits = 0) {
  const v = Number.isFinite(x) ? x : 0;
  return `${(v * 100).toFixed(digits)}%`;
}

function clamp01(x: number) {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function generateDemoBrief(inputs: Inputs, core: ReturnType<typeof computeCore>) {
  const lines: string[] = [];
  lines.push("AD PROFITABILITY SNAPSHOT");
  lines.push(`Funnel type: ${inputs.mode === "leadgen" ? "Lead Gen" : "Ecommerce"}`);
  lines.push("");

  if (inputs.mode === "leadgen") {
    lines.push(`Close rate: ${pct01(inputs.closeRate, 0)}`);
    lines.push(`Revenue per close: $${Math.round(inputs.revenuePerClose)}`);
  } else {
    lines.push(`AOV: $${Math.round(inputs.aov)}`);
    lines.push(`Conversion rate: ${pct01(inputs.conversionRate, 1)} (reference)`);
  }

  lines.push(`Gross margin: ${pct01(inputs.grossMargin, 0)}`);
  lines.push(`Safety buffer: ${pct01(inputs.safetyBuffer, 0)}`);
  lines.push(`Monthly budget modeled: $${Math.round(inputs.monthlyBudget)}`);
  lines.push("");

  lines.push(`Breakeven CPA: ${money(core.breakevenCPA)}`);
  lines.push(`Target CPA (safe): ${money(core.targetCPA)}`);
  if (core.maxCPL !== null) lines.push(`Max CPL: ${money(core.maxCPL)}`);

  lines.push("");
  lines.push("Next step:");
  lines.push("Use the Target CPA as your guardrail when judging campaign performance.");

  return lines.join("\n");
}

function generateProBrief(
  inputs: Inputs,
  core: ReturnType<typeof computeCore>,
  pro: ReturnType<typeof computePro>
) {
  const lines: string[] = [];

  lines.push("PAID ADS PROFITABILITY REPORT");
  lines.push(`Funnel type: ${inputs.mode === "leadgen" ? "Lead Gen" : "Ecommerce"}`);
  lines.push(`Monthly budget modeled: $${Math.round(inputs.monthlyBudget)}`);
  lines.push("");

  // Unit economics framing
  lines.push("UNIT ECONOMICS");
  if (inputs.mode === "leadgen") {
    lines.push(`• Close rate: ${pct01(inputs.closeRate, 0)}`);
    lines.push(`• Revenue per close: $${Math.round(inputs.revenuePerClose)}`);
  } else {
    lines.push(`• AOV: $${Math.round(inputs.aov)}`);
    lines.push(`• Conversion rate: ${pct01(inputs.conversionRate, 1)} (reference)`);
  }
  lines.push(`• Gross margin: ${pct01(inputs.grossMargin, 0)}`);
  lines.push(`• Profit per conversion (before ads): ${money(core.profitPerConversion)}`);
  lines.push("");

  // Targets
  lines.push("EFFICIENCY TARGETS");
  lines.push(`• Breakeven CPA: ${money(core.breakevenCPA)}`);
  lines.push(`• Recommended Target CPA (safe): ${money(core.targetCPA)}`);
  if (core.maxCPL !== null) lines.push(`• Max CPL (based on close rate): ${money(core.maxCPL)}`);
  lines.push("");

  // Risk: find first losing scenario and "breaks at"
  const sorted = [...pro.scenarios].sort((a, b) => a.assumedCPA - b.assumedCPA);
  const firstLosing = sorted.find((s) => s.profitAtBudget < 0);
  const breaksAt = firstLosing ? firstLosing.assumedCPA : null;

  lines.push("RISK ASSESSMENT (CPA DRIFT)");
  for (const s of sorted) {
    const status =
      s.profitAtBudget > 0 ? "SAFE" : s.profitAtBudget === 0 ? "TIGHT" : "LOSING";
    lines.push(`• ${s.label}: CPA ${money(s.assumedCPA)} → Profit $${s.profitAtBudget.toFixed(0)} (${status})`);
  }
  if (breaksAt !== null) {
    lines.push(`• Break-even zone flips negative above ~${money(breaksAt)} (at this budget & assumptions).`);
  } else {
    lines.push("• No break detected in this stress range (still monitor CPA closely).");
  }
  lines.push("");

  // Scaling summary
  lines.push("SCALING OUTLOOK");
  for (const r of pro.scalingTable) {
    lines.push(
      `• Budget $${r.budget}: Profit $${r.profit.toFixed(0)} | Conversions ${r.conversions.toFixed(1)} | Risk ${r.risk}`
    );
  }
  lines.push("");

  // Verdict
  const buf = clamp01(inputs.safetyBuffer);
  const verdict =
    breaksAt !== null && core.targetCPA > breaksAt
      ? "NO-GO"
      : "GO (with guardrails)";

  lines.push("VERDICT");
  lines.push(
    verdict === "NO-GO"
      ? `NO-GO: Your safe target CPA (${money(core.targetCPA)}) is above the break threshold (~${money(
          breaksAt!
        )}). Improve economics or lower CPA before scaling.`
      : `GO (with guardrails): Keep CPA ≤ ${money(core.targetCPA)} (includes ~${Math.round(
          buf * 100
        )}% buffer). Scale only if CPA stays stable.`
  );

  lines.push("");
  lines.push(`Generated: ${new Date().toLocaleString()}`);

  return lines.join("\n");
}

export default function ToolPage() {
  // Inputs (defaults)
  const [mode, setMode] = useState<Mode>("leadgen");
  const [monthlyBudget, setMonthlyBudget] = useState<number>(800);

  // Lead gen
  const [closeRate, setCloseRate] = useState<number>(0.2);
  const [revenuePerClose, setRevenuePerClose] = useState<number>(600);

  // Ecommerce
  const [conversionRate, setConversionRate] = useState<number>(0.02); // optional reference
  const [aov, setAov] = useState<number>(85);

  // Shared
  const [grossMargin, setGrossMargin] = useState<number>(0.45);
  const [safetyBuffer, setSafetyBuffer] = useState<number>(0.2);

  // Pro unlock state
  const [isPro, setIsPro] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("pro_unlocked");
    const savedKey = localStorage.getItem("gumroad_license_key");
    if (saved === "1") setIsPro(true);
    if (savedKey) setLicenseKey(savedKey);
  }, []);

  function applyPreset(preset: "local" | "ecom") {
    if (preset === "local") {
      setMode("leadgen");
      setMonthlyBudget(800);
      setCloseRate(0.2);
      setRevenuePerClose(600);
      setGrossMargin(0.45);
      setSafetyBuffer(0.2);
    } else {
      setMode("ecom");
      setMonthlyBudget(1000);
      setAov(85);
      setConversionRate(0.02);
      setGrossMargin(0.35);
      setSafetyBuffer(0.2);
    }
  }

  const inputs: Inputs = useMemo(
    () => ({
      mode,
      monthlyBudget,
      closeRate,
      revenuePerClose,
      conversionRate,
      aov,
      grossMargin,
      safetyBuffer,
    }),
    [
      mode,
      monthlyBudget,
      closeRate,
      revenuePerClose,
      conversionRate,
      aov,
      grossMargin,
      safetyBuffer,
    ]
  );

  const core = useMemo(() => computeCore(inputs), [inputs]);
  const pro = useMemo(() => (isPro ? computePro(inputs) : null), [inputs, isPro]);

  const decisionBrief = useMemo(() => {
    if (!isPro || !pro) return generateDemoBrief(inputs, core);
    return generateProBrief(inputs, core, pro);
  }, [isPro, pro, inputs, core]);

  async function copyBrief() {
    await navigator.clipboard.writeText(decisionBrief);
    alert("Copied ✅");
  }

  async function downloadPdf() {
    if (!isPro) {
      alert("PDF export is a Pro feature 🔒");
      return;
    }

    // Dynamic import keeps bundle light
    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF({
      unit: "pt",
      format: "letter",
    });

    const margin = 48;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - margin * 2;

    doc.setFont("times", "normal");
    doc.setFontSize(12);

    const lines = doc.splitTextToSize(decisionBrief, usableWidth);
    let y = margin;

    for (const line of lines) {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 16;
    }

    doc.save("paid-ads-profitability-report.pdf");
  }

  async function verifyLicense() {
    setVerifyMsg("");
    const key = licenseKey.trim();
    if (!key) {
      setVerifyMsg("Enter your license key first.");
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch("/api/gumroad/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: key }),
      });

      const data = await res.json();

      if (data?.ok) {
        setIsPro(true);
        localStorage.setItem("pro_unlocked", "1");
        localStorage.setItem("gumroad_license_key", key);
        setVerifyMsg("Unlocked ✅ Pro is active on this device.");
      } else {
        setIsPro(false);
        localStorage.removeItem("pro_unlocked");
        setVerifyMsg(data?.message || "Invalid license key.");
      }
    } catch {
      setVerifyMsg("Verification failed. Try again.");
    } finally {
      setVerifying(false);
    }
  }

  function lockPro() {
    setIsPro(false);
    localStorage.removeItem("pro_unlocked");
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Breakeven CPA Calculator</h1>
            <p className="text-zinc-600">
              Get CPA guardrails + a real report you can save (copy or PDF).
            </p>
          </div>

          <div className="flex flex-col gap-2 md:items-end">
            <div className="flex gap-2">
              <a
                href="/"
                className="rounded-xl border border-zinc-300 px-4 py-2 font-semibold hover:bg-zinc-50"
              >
                Back
              </a>

              <button
                onClick={copyBrief}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-white font-semibold hover:bg-zinc-800"
              >
                Copy Brief ✅
              </button>

              <button
                onClick={downloadPdf}
                className={`rounded-xl border px-4 py-2 font-semibold ${
                  isPro
                    ? "border-zinc-300 hover:bg-zinc-50"
                    : "border-zinc-200 text-zinc-400 cursor-not-allowed"
                }`}
                disabled={!isPro}
                title={isPro ? "Download PDF" : "Unlock Pro to export PDF"}
              >
                Download PDF {isPro ? "" : "🔒"}
              </button>
            </div>

            <div className="text-sm text-zinc-500">
              {isPro ? "Pro unlocked ✅" : "Demo mode"}
              {isPro && (
                <button onClick={lockPro} className="ml-3 underline hover:text-zinc-700">
                  lock
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Mode toggle + presets */}
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setMode("leadgen")}
              className={`rounded-xl px-4 py-2 font-semibold border ${
                mode === "leadgen"
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              Lead Gen
            </button>
            <button
              onClick={() => setMode("ecom")}
              className={`rounded-xl px-4 py-2 font-semibold border ${
                mode === "ecom"
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              Ecommerce
            </button>
          </div>

          <div className="flex flex-wrap gap-2 md:ml-auto">
            <button
              onClick={() => applyPreset("local")}
              className="rounded-xl border border-zinc-300 px-4 py-2 font-semibold hover:bg-zinc-50"
            >
              Preset: Local Lead Gen
            </button>
            <button
              onClick={() => applyPreset("ecom")}
              className="rounded-xl border border-zinc-300 px-4 py-2 font-semibold hover:bg-zinc-50"
            >
              Preset: Ecommerce Store
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Inputs */}
          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-lg font-bold">Inputs</h2>

            <div className="mt-4 grid gap-4">
              <label className="grid gap-1">
                <span className="text-sm font-semibold">Monthly Ad Budget ($)</span>
                <input
                  type="number"
                  className="rounded-xl border border-zinc-300 px-3 py-2"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-semibold">Gross Margin (0–1)</span>
                <input
                  type="number"
                  step="0.01"
                  className="rounded-xl border border-zinc-300 px-3 py-2"
                  value={grossMargin}
                  onChange={(e) => setGrossMargin(Number(e.target.value))}
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-semibold">Safety Buffer (0–1)</span>
                <input
                  type="number"
                  step="0.01"
                  className="rounded-xl border border-zinc-300 px-3 py-2"
                  value={safetyBuffer}
                  onChange={(e) => setSafetyBuffer(Number(e.target.value))}
                />
              </label>

              {mode === "leadgen" ? (
                <>
                  <label className="grid gap-1">
                    <span className="text-sm font-semibold">Close Rate (0–1)</span>
                    <input
                      type="number"
                      step="0.01"
                      className="rounded-xl border border-zinc-300 px-3 py-2"
                      value={closeRate}
                      onChange={(e) => setCloseRate(Number(e.target.value))}
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-sm font-semibold">Revenue per Closed Deal ($)</span>
                    <input
                      type="number"
                      className="rounded-xl border border-zinc-300 px-3 py-2"
                      value={revenuePerClose}
                      onChange={(e) => setRevenuePerClose(Number(e.target.value))}
                    />
                  </label>
                </>
              ) : (
                <>
                  <label className="grid gap-1">
                    <span className="text-sm font-semibold">Average Order Value ($)</span>
                    <input
                      type="number"
                      className="rounded-xl border border-zinc-300 px-3 py-2"
                      value={aov}
                      onChange={(e) => setAov(Number(e.target.value))}
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-sm font-semibold">Conversion Rate (0–1) (reference)</span>
                    <input
                      type="number"
                      step="0.001"
                      className="rounded-xl border border-zinc-300 px-3 py-2"
                      value={conversionRate}
                      onChange={(e) => setConversionRate(Number(e.target.value))}
                    />
                  </label>
                </>
              )}
            </div>

            {/* License unlock */}
            <div className="mt-8 rounded-2xl border border-zinc-200 p-4">
              <p className="font-semibold">Unlock Pro (Gumroad License Key)</p>
              <p className="text-sm text-zinc-600 mt-1">
                Paste your license key to unlock Risk + Scaling + Report export (PDF).
              </p>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2"
                  placeholder="Enter license key..."
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                />
                <button
                  onClick={verifyLicense}
                  disabled={verifying}
                  className="rounded-xl bg-zinc-900 px-4 py-2 text-white font-semibold hover:bg-zinc-800 disabled:opacity-60"
                >
                  {verifying ? "Verifying..." : "Unlock"}
                </button>
              </div>

              {verifyMsg && <p className="mt-2 text-sm text-zinc-700">{verifyMsg}</p>}
            </div>
          </section>

          {/* Results */}
          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-lg font-bold">Snapshot</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 p-4">
                <p className="text-sm text-zinc-600">Breakeven CPA</p>
                <p className="text-2xl font-bold">{money(core.breakevenCPA)}</p>
              </div>

              <div className="rounded-2xl border border-zinc-200 p-4">
                <p className="text-sm text-zinc-600">Target CPA (safe)</p>
                <p className="text-2xl font-bold">{money(core.targetCPA)}</p>
              </div>

              {core.maxCPL !== null && (
                <div className="rounded-2xl border border-zinc-200 p-4 sm:col-span-2">
                  <p className="text-sm text-zinc-600">Max CPL (Lead Gen)</p>
                  <p className="text-2xl font-bold">{money(core.maxCPL)}</p>
                </div>
              )}
            </div>

            {/* Pro sections */}
            <div className="mt-8 grid gap-4">
              {!isPro ? (
                <>
                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <p className="font-semibold">🔒 Risk Check</p>
                    <p className="text-sm text-zinc-600 mt-1">
                      Stress test profit if CPA drifts +10–30%.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <p className="font-semibold">🔒 Scaling Plan</p>
                    <p className="text-sm text-zinc-600 mt-1">
                      Budget table (0.5×, 1×, 2×, 3×) with profit + risk flags.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <p className="font-semibold">🔒 Report Export</p>
                    <p className="text-sm text-zinc-600 mt-1">
                      Copy a clean report + download a PDF.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Risk */}
                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <p className="font-semibold">Risk Check (CPA drift)</p>
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="text-zinc-600">
                          <tr>
                            <th className="text-left py-2">Scenario</th>
                            <th className="text-right py-2">Assumed CPA</th>
                            <th className="text-right py-2">Profit @ Budget</th>
                            <th className="text-right py-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pro!.scenarios.map((r) => (
                            <tr key={r.label} className="border-t">
                              <td className="py-2">{r.label}</td>
                              <td className="py-2 text-right">{money(r.assumedCPA)}</td>
                              <td className="py-2 text-right">{`$${r.profitAtBudget.toFixed(0)}`}</td>
                              <td className="py-2 text-right font-semibold">
                                {r.status === "SAFE"
                                  ? "✅ Safe"
                                  : r.status === "TIGHT"
                                  ? "⚠️ Tight"
                                  : "❌ Losing"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Scaling */}
                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <p className="font-semibold">Scaling Plan</p>
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="text-zinc-600">
                          <tr>
                            <th className="text-left py-2">Budget</th>
                            <th className="text-right py-2">Conversions</th>
                            <th className="text-right py-2">Profit</th>
                            <th className="text-right py-2">Risk</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pro!.scalingTable.map((r) => (
                            <tr key={r.budget} className="border-t">
                              <td className="py-2">{`$${r.budget}`}</td>
                              <td className="py-2 text-right">{r.conversions.toFixed(1)}</td>
                              <td className="py-2 text-right">{`$${r.profit.toFixed(0)}`}</td>
                              <td className="py-2 text-right font-semibold">
                                {r.risk === "LOW" ? "✅ Low" : r.risk === "MED" ? "⚠️ Med" : "❗ High"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Report */}
                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <p className="font-semibold">Profitability Report (Copy/PDF)</p>
                    <pre className="mt-2 whitespace-pre-wrap rounded-xl border border-zinc-200 bg-white p-3 text-sm">
                      {decisionBrief}
                    </pre>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={copyBrief}
                        className="rounded-xl bg-zinc-900 px-4 py-2 text-white font-semibold hover:bg-zinc-800"
                      >
                        Copy Report ✅
                      </button>
                      <button
                        onClick={downloadPdf}
                        className="rounded-xl border border-zinc-300 px-4 py-2 font-semibold hover:bg-zinc-50"
                      >
                        Download PDF ✅
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
