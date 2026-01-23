export default function HomePage() {
  const GUMROAD_URL = "https://breakevencpa.gumroad.com/l/cdpmi";

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Hero */}
        <header className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700">
            <span className="font-semibold">Breakeven CPA Tool</span>
            <span className="text-zinc-400">•</span>
            <span>Demo + Pro unlock</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Know your <span className="underline decoration-zinc-300">breakeven CPA</span> before you burn ad spend.
          </h1>

          <p className="max-w-2xl text-lg text-zinc-600">
            Demo gives you the snapshot. Pro shows the risk (CPA drift) + a scaling plan so you
            can spend with confidence.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/tool"
              className="rounded-2xl bg-zinc-900 px-6 py-3 text-center font-semibold text-white hover:bg-zinc-800"
            >
              Try the demo
            </a>

            <a
              href={GUMROAD_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-zinc-300 px-6 py-3 text-center font-semibold hover:bg-zinc-50"
            >
              Unlock Pro (CAD $19)
            </a>
          </div>

          <p className="text-sm text-zinc-500">
            After purchase, Gumroad gives you a license key. Paste it in the tool to unlock Pro.
          </p>
        </header>

        {/* Value props */}
        <section className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-lg font-bold">Demo Snapshot</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Instantly calculate breakeven CPA and a safer target CPA based on margin and buffer.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-lg font-bold">Pro Risk Check</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Stress test profitability if CPA drifts +10–30%. Know exactly where it breaks.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-lg font-bold">Pro Scaling Plan</h2>
            <p className="mt-2 text-sm text-zinc-600">
              A budget table (0.5×, 1×, 2×, 3×) showing conversions, profit, and risk level.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-14 rounded-2xl border border-zinc-200 p-8">
          <h2 className="text-xl font-bold">How it works</h2>

          <ol className="mt-4 grid gap-4 text-sm text-zinc-700 md:grid-cols-3">
            <li className="rounded-2xl border border-zinc-200 p-4">
              <p className="font-semibold">1) Run the demo</p>
              <p className="mt-1 text-zinc-600">
                Enter margin + revenue assumptions. Get breakeven CPA and a safe target CPA.
              </p>
            </li>

            <li className="rounded-2xl border border-zinc-200 p-4">
              <p className="font-semibold">2) Unlock Pro</p>
              <p className="mt-1 text-zinc-600">
                Purchase once on Gumroad and copy your license key from the receipt.
              </p>
            </li>

            <li className="rounded-2xl border border-zinc-200 p-4">
              <p className="font-semibold">3) Spend confidently</p>
              <p className="mt-1 text-zinc-600">
                Paste the key in the tool to unlock risk + scaling + decision brief export.
              </p>
            </li>
          </ol>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="/tool"
              className="rounded-2xl bg-zinc-900 px-6 py-3 text-center font-semibold text-white hover:bg-zinc-800"
            >
              Open the tool
            </a>

            <a
              href={GUMROAD_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-zinc-300 px-6 py-3 text-center font-semibold hover:bg-zinc-50"
            >
              Buy Pro (CAD $19)
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-14 text-sm text-zinc-500">
          <p>
            Tip: Pro is for when you want to avoid “it worked last week, why is it losing now?”
          </p>
        </footer>
      </div>
    </main>
  );
}
