"use client";

import { useEffect, useMemo, useState } from "react";
import type { Inputs, Mode } from "../../lib/calc";
import { computeCore, computePro } from "../../lib/calc";

function money(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return `$${v.toFixed(2)}`;
}

export default function ToolPage() {
  const GUMROAD_URL = "https://breakevencpa.gumroad.com/l/cdpmi";

  // Inputs (defaults)
  const [mode, setMode] = useState<Mode>("leadgen");
  const [monthlyBudget, setMonthlyBudget] = useState<number>(800);

  // Lead gen
  const [closeRate, setCloseRate] = useState<number>(0.2);
  const [revenuePerClose, setRevenuePerClose] = useState<number>(600);

  // Ecommerce (reference only)
  const [conversionRate, setConversionRate] = useState<number>(0.02);
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
    const lines: string[] = [];
    lines.push("DECISION BRIEF");
    lines.push(`Mode: ${mode === "leadgen" ? "Lead Gen" : "Ecommerce"}`);
    lines.push("");

    if (mode === "leadgen") {
      lines.push(`Close rate: ${(closeRate * 100).toFixed(0)}%`);
      lines.push(`Revenue per close: $${revenuePerClose}`);
    } else {
      lines.push(`AOV: $${aov}`);
      lines.push(`Conversion rate: ${(conversionRate * 100).toFixed(1)}% (reference)`);
    }

    lines.push(`Gross margin: ${(grossMargin * 100).toFixed(0)}%`);
    lines.push(`Safety buffer: ${(safetyBuffer * 100).toFixed(0)}%`);
    lines.push(`Monthly budget: $${monthlyBudget}`);
    lines.push("");

    lines.push(`Breakeven CPA: ${money(core.breakevenCPA)}`);
    lines.push(`Target CPA (safe): ${money(core.targetCPA)}`);
    if (core.maxCPL !== null) lines.push(`Max CPL: ${money(core.maxCPL)}`);

    lines.push("");
    lines.push("Risk note:");
    lines.push("This snapshot assumes performance holds.");
    lines.push("Pro shows where it breaks (CPA drift + scaling plan).");

    return lines.join("\n");
  }, [
    mode,
    closeRate,
    revenuePerClose,
    aov,
    conversionRate,
    grossMargin,
    safetyBuffer,
    monthlyBudget,
    core.breakevenCPA,
    core.targetCPA,
    core.maxCPL,
  ]);

  async function copyBrief() {
    await navigator.clipboard.writeText(decisionBrief);
    alert("Copied ✅");
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

  function clearAll() {
    setLicenseKey("");
    setVerifyMsg("");
    setIsPro(false);
    localStorage.removeItem("pro_unlocked");
    localStorage.removeItem("gumroad_license_key");
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Breakeven CPA Calculator</h1>
            <p className="text-zinc-600">
              Demo gives the snapshot. Pro unlocks risk + scaling so you don’t get surprised later.
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
                onClick={() => {
                  if (!isPro) alert("Pro feature 🔒 — unlock with your Gumroad license key.");
                  else copyBrief();
                }}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-white font-semibold hover:bg-zinc-800"
              >
                Copy Decision Brief {isPro ? "" : "🔒"}
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
                    <span className="text-sm font-semibold">Conversion Rate (0–1) (optional)</span>
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
                After purchase, paste your license key to unlock Risk + Scaling + Decision Brief.
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

              {/* New CTA + Clear */}
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <a
                  href={GUMROAD_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-2 text-center font-semibold hover:bg-zinc-50"
                >
                  Buy Pro (CAD $19)
                </a>

                <button
                  onClick={clearAll}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-2 font-semibold hover:bg-zinc-50"
                >
                  Clear
                </button>
              </div>

              <p className="mt-2 text-xs text-zinc-500">
                After purchase, Gumroad gives you a license key on the receipt. Paste it here to unlock.
              </p>
            </div>
          </section>

          {/* Results */}
          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-lg font-bold">Snapshot (Demo)</h2>

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

            <p className="mt-4 text-sm text-zinc-600">
              This snapshot assumes performance holds.{" "}
              <span className="font-semibold">Pro shows where it breaks.</span>
            </p>

            {/* Locked/Unlocked Pro sections */}
            <div className="mt-8 grid gap-4">
              {!isPro ? (
                <>
                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <p className="font-semibold">🔒 Risk Check (Pro)</p>
                    <p className="text-sm text-zinc-600 mt-1">
                      See what happens if CPA drifts +10–30% (and where profitability breaks).
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <p className="font-semibold">🔒 Scaling Plan (Pro)</p>
                    <p className="text-sm text-zinc-600 mt-1">
                      Budget table (0.5×, 1×, 2×, 3×) with profit + risk flags.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <p className="font-semibold">🔒 Decision Brief Export (Pro)</p>
                    <p className="text-sm text-zinc-600 mt-1">
                      Copy a clean, client-ready brief with targets + risk notes.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Risk analysis */}
                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <p className="font-semibold">Risk Check: How fragile is this?</p>
                    <p className="text-sm text-zinc-600 mt-1">
                      If CPA rises, profit can flip. Here’s the stress test.
                    </p>

                    {/* NEW: Risk Verdict line */}
                    <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-3 text-sm">
                      {(() => {
                        const losing = pro!.scenarios.find((s) => s.status === "LOSING");
                        if (losing) {
                          return (
                            <span>
                              <span className="font-semibold">Risk verdict:</span>{" "}
                              Your model turns unprofitable at{" "}
                              <span className="font-semibold">{money(losing.assumedCPA)}</span>{" "}
                              (scenario: {losing.label}). Keep CPA below{" "}
                              <span className="font-semibold">{money(core.targetCPA)}</span>.
                            </span>
                          );
                        }
                        return (
                          <span>
                            <span className="font-semibold">Risk verdict:</span>{" "}
                            You stay profitable through the stress test. Your safe target is{" "}
                            <span className="font-semibold">{money(core.targetCPA)}</span>.
                          </span>
                        );
                      })()}
                    </div>

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

                  {/* Scaling plan */}
                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <p className="font-semibold">Scaling Plan: What budget makes sense?</p>
                    <p className="text-sm text-zinc-600 mt-1">
                      Same assumptions, different budgets. Use this to plan month-to-month spend.
                    </p>

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
                                {r.risk === "LOW"
                                  ? "✅ Low"
                                  : r.risk === "MED"
                                  ? "⚠️ Med"
                                  : "❗ High"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Decision brief */}
                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <p className="font-semibold">Decision Brief (Copy/Paste)</p>
                    <pre className="mt-2 whitespace-pre-wrap rounded-xl border border-zinc-200 bg-white p-3 text-sm">
                      {decisionBrief}
                    </pre>
                    <button
                      onClick={copyBrief}
                      className="mt-3 rounded-xl bg-zinc-900 px-4 py-2 text-white font-semibold hover:bg-zinc-800"
                    >
                      Copy Decision Brief ✅
                    </button>
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
