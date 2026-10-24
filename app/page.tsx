"use client";

import { useMemo, useState } from "react";

const PRICE_CAD = 99;
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";

export default function HomePage() {
  const [monthlyLeads, setMonthlyLeads] = useState(40);
  const [avgJob, setAvgJob] = useState(850);
  const [closeRate, setCloseRate] = useState(35);
  const [leakRate, setLeakRate] = useState(15);

  const monthlyLeak = useMemo(() => {
    return monthlyLeads * (leakRate / 100) * (closeRate / 100) * avgJob;
  }, [monthlyLeads, avgJob, closeRate, leakRate]);

  const subject = encodeURIComponent("Lead Recovery Snapshot request");
  const body = encodeURIComponent(
    `Business name:\nWebsite:\nMain service:\nCity/market:\n\nMy calculator estimate: $${Math.round(monthlyLeak).toLocaleString()} CAD/month at risk.`
  );
  const emailHref = contactEmail
    ? `mailto:${contactEmail}?subject=${subject}&body=${body}`
    : "#request";

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <header className="grid gap-10 md:grid-cols-[1.25fr_.75fr] md:items-center">
          <div>
            <div className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
              For home-service businesses
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
              Find the leads you are already paying for — then stop losing them.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              The Lead Recovery Snapshot reviews your public customer journey: local search visibility,
              website conversion friction, inquiry handling, quote follow-up, and trust signals. You get
              a prioritized fix list plus copy you can use immediately.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#calculator" className="rounded-xl bg-emerald-400 px-6 py-3 text-center font-bold text-zinc-950 hover:bg-emerald-300">
                Run the free leak calculator
              </a>
              <a href={emailHref} className="rounded-xl border border-zinc-700 px-6 py-3 text-center font-bold hover:bg-zinc-900">
                Request the C$99 snapshot
              </a>
            </div>
            <p className="mt-3 text-sm text-zinc-500">No retainer. No ad spend. No access to customer data required.</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-7">
            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">What arrives</p>
            <ul className="mt-5 space-y-4 text-zinc-200">
              <li><strong>1.</strong> Public funnel scorecard with evidence</li>
              <li><strong>2.</strong> Top 5 revenue leaks ranked by impact</li>
              <li><strong>3.</strong> Homepage + CTA copy improvements</li>
              <li><strong>4.</strong> Quote follow-up message sequence</li>
              <li><strong>5.</strong> Local/AI visibility quick wins</li>
              <li><strong>6.</strong> 30-day action plan</li>
            </ul>
            <div className="mt-7 rounded-2xl bg-zinc-950 p-5">
              <div className="text-3xl font-black">C$99</div>
              <div className="mt-1 text-sm text-zinc-400">One-time · delivered within 48 hours after intake</div>
            </div>
          </div>
        </header>

        <section id="calculator" className="mt-20 rounded-3xl border border-zinc-800 bg-zinc-900 p-7 md:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">Free calculator</p>
            <h2 className="mt-2 text-3xl font-black">Estimate the value of a small leak.</h2>
            <p className="mt-3 text-zinc-400">
              This is a scenario model, not a promise of recovered revenue. Use your own numbers where possible.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-4">
            <label className="text-sm text-zinc-300">
              Leads / month
              <input type="number" min="0" value={monthlyLeads} onChange={(e) => setMonthlyLeads(Number(e.target.value) || 0)}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100" />
            </label>
            <label className="text-sm text-zinc-300">
              Average job (C$)
              <input type="number" min="0" value={avgJob} onChange={(e) => setAvgJob(Number(e.target.value) || 0)}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100" />
            </label>
            <label className="text-sm text-zinc-300">
              Close rate (%)
              <input type="number" min="0" max="100" value={closeRate} onChange={(e) => setCloseRate(Number(e.target.value) || 0)}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100" />
            </label>
            <label className="text-sm text-zinc-300">
              Potentially lost (%)
              <input type="number" min="0" max="100" value={leakRate} onChange={(e) => setLeakRate(Number(e.target.value) || 0)}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100" />
            </label>
          </div>

          <div className="mt-7 flex flex-col gap-4 rounded-2xl bg-zinc-950 p-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm text-zinc-500">Scenario value at risk / month</div>
              <div className="mt-1 text-4xl font-black text-emerald-300">C${Math.round(monthlyLeak).toLocaleString()}</div>
            </div>
            <a href={emailHref} className="rounded-xl bg-white px-6 py-3 text-center font-bold text-zinc-950 hover:bg-zinc-200">
              Get the C$99 diagnosis
            </a>
          </div>
        </section>

        <section className="mt-20 grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Why this problem</p>
            <h2 className="mt-2 text-3xl font-black">More leads are not always the answer.</h2>
          </div>
          <div className="space-y-4 text-zinc-300">
            <p>Home-service businesses often have enough demand to expose expensive gaps: slow response, weak booking prompts, unclear service-area pages, thin trust proof, and quotes that go silent.</p>
            <p>The snapshot focuses on observable friction and practical fixes. It does not claim to know your internal missed-call rate or revenue unless you provide those numbers.</p>
          </div>
        </section>

        <section className="mt-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Process</p>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {[
              ["1. Intake", "Send your website, primary service, city, and the way customers normally contact you."],
              ["2. Evidence", "We review the public funnel and benchmark the customer journey without pretending private data is visible."],
              ["3. Fix pack", "You receive the ranked findings, rewrite-ready copy, follow-up sequence, and 30-day priority plan."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-zinc-800 p-6">
                <h3 className="font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="request" className="mt-20 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-8 md:p-10">
          <h2 className="text-3xl font-black">Start with evidence, not a retainer.</h2>
          <p className="mt-3 max-w-2xl text-zinc-300">
            The first five paid snapshots are C$99 while the service is being standardized. Scope is fixed so delivery stays fast.
          </p>
          <a href={emailHref} className="mt-6 inline-block rounded-xl bg-emerald-400 px-6 py-3 font-bold text-zinc-950 hover:bg-emerald-300">
            Request a snapshot
          </a>
          {!contactEmail && (
            <p className="mt-3 text-sm text-amber-300">
              Intake email is being connected. The service is not accepting payment until that channel is live.
            </p>
          )}
        </section>

        <footer className="mt-14 border-t border-zinc-900 pt-8 text-sm text-zinc-500">
          <p>Lead Recovery Snapshot · Independent conversion audit for home-service businesses.</p>
          <p className="mt-2">Revenue figures are scenarios, not guarantees. We do not submit fake leads, impersonate customers, or access private systems without permission.</p>
        </footer>
      </div>
    </main>
  );
}
