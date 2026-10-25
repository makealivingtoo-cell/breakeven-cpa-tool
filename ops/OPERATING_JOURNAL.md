# Operating Journal

## 2026-10-24 — Launch decision
### What we tried and why
Evaluated low-cost models that could reach first revenue without inventory, paid ads, or recurring infrastructure. Chose a productized lead-recovery audit for home-service businesses because it can be fulfilled from public information plus customer-provided context, has near-zero marginal tooling cost, and can be demonstrated before scaling.

### Evidence
Current industry material consistently emphasizes missed/slowly handled inquiries, follow-up, and local visibility as material home-service growth problems. Treat benchmark percentages as directional only; customer-specific claims require customer data.

### Cost
C$0 spent. C$0 committed.

### What happened
- Created isolated Git branch `lead-recovery-audit`.
- Built landing-page copy and interactive scenario calculator.
- Defined C$99 pilot offer and 48-hour fulfillment promise.
- Stripe capability connected, but live account selection still requires explicit human selection.
- Render workspace visible but deployment actions require explicit workspace confirmation.

### What evidence supports
Start with direct validation before buying a domain, ads, or software. The first meaningful signal is qualified replies or paid purchase attempts.

### Next change
Complete delivery template + intake + payment link + deploy. Then run a small compliant outreach batch to owner-operated home-service firms with obvious public funnel gaps.


## 2026-10-24 — Unattended operation scheduled
### Action
Created hourly `Lead Recovery Operator` scheduled task (24/7 hourly, no open chat required) and retained daily reporting. Added `ops/CONTROL.json` and an autonomy runbook for spending control, duplicate prevention, pause/resume, and account authorization boundaries.

### Observed result
Scheduling succeeded; first hourly unattended run has not yet been verified. No claim of continuous in-process execution or live customer acquisition.

### Cost
C$0 new outlay; C$0 collected.

### Next action
Run the first unattended cycle; verify its journal write. Continue independent research and asset refinement while specific sender, Stripe, and Render account selection remain unconfirmed.

## 2026-10-24 — Stripe account permission confirmed
### Action
Verified via the connected Stripe account-list API that the accessible live account is `swiftscape.org` (context `acct_1QIAkSDIXuiuULNg`). User authorized use of this account for API access while explicitly preserving existing things. Updated `ops/CONTROL.json` for read-only API access and retained the no-live-payment-writes gate.

### Result and constraints
Account API connection verified; no existing Stripe resources edited and no Stripe mutations performed. No API secret accessed or exported. Product creation and live checkout remain disabled until separately authorized. Render and email permissions remain unset.

### Cost and next action
C$0 spent or committed; C$0 revenue collected. Continue unblocked research and landing-page refinement. Deploy and outreach only after specific resource/account permission is confirmed.

## 2026-10-24 — Render deployment and business Gmail selected
### Authorized scope
The owner authorized one new free Render deployment in existing `My Workspace` and selected `makealivingtoo@gmail.com` as the business sender. Gmail OAuth profile confirmed as `makealivingtoo@gmail.com`. Unsolicited sales messages remain disabled until lawful sender-identification/opt-out details are documented. Customer-initiated inquiries may be replied to by the selected business account.

### Completed
- Created self-contained static site `lead-recovery-site/index.html` on the business GitHub branch, with calculator and `mailto` inquiry.
- Created new Render static-site service `lead-recovery-snapshot`, ID `srv-dbejq5ks728c73cfj1gg`, in workspace `tea-d709v18gjchc73d34qs0`.
- Service uses build command `test -f lead-recovery-site/index.html` and publish path `lead-recovery-site`; dependency installation bypass and automatic deployment disabled to minimize shared pipeline usage.
- Render deploy `dep-dbejq5ks728c73cfj1sg` returned status `live`; service URL is https://lead-recovery-snapshot.onrender.com.
- No existing Render service was edited. External HTTP fetch could not verify due to network/DNS restrictions in the execution environment; Render deployment API is the verified evidence.

### Financials and risks
- New paid commitments: C$0; total verified revenue C$0.
- Render documentation says free static sites share workspace bandwidth and pipeline-minute allowances, with potential overage billing if a payment method is present. There is no per-site hard bandwidth-spend cap exposed by the connected tools. Keep manual deployments, monitor utilization, and raise an alert if usage rises unexpectedly.

### Next action
Verify public visitor accessibility through an available browser; set up compliant cold outreach only after required legal identification/unsubscribe details are available. Validate qualified demand and prepare checkout flow while honoring read-only Stripe restriction.

## 2026-10-24 — Payment link verified
Stripe read-only query matched the owner-provided live payment link to the C$99 one-time Lead Recovery Snapshot price. No completed checkout sessions were found. The link is active but currently has no five-purchase limit and has automatic tax enabled. Added PAYMENT_MONITORING.md and updated CONTROL.json; hourly monitoring instructions updated. No spending or revenue reported. Public website payment promotion remains held pending capacity/tax/fulfillment validation.
