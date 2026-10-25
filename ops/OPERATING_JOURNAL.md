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

## 2026-10-24 evening / 2026-10-25 UTC — Owner chooses no Stripe purchase cap; first outbound preparation
### Owner decision
The owner explicitly chose **no purchase limit** on the Stripe payment link and directed focus to getting customers. We verified the live LRS link still has `restrictions=null`; no Stripe objects were changed, and no further Stripe configuration is required as a routine task.

### Market research
- Researched Saskatoon-area independent home-service contractors using current public business webpages. First two prospects recorded in `ops/PROSPECTS.csv` with exact observations and email publication evidence.
- Anytime Electric: its public Contact Us page visibly includes `(info@mysite.com)` alongside its published company email. This is a plausible visitor-confusion issue; **not evidence of missed leads**. Evidence: https://www.anytimeelectric.ca/contact-us
- J Barry Electrical: the public homepage explains four-step call-to-quote workflow and publishes the owner's business email. Suggested clarifying next-response expectations as a copy experiment, not an asserted performance issue. Evidence: https://jbarryelectrical.ca/
- Regulatory consent policy checked against Innovation Science and Economic Development Canada and CRTC. A public business email may supply narrowly applicable implied consent **only where** it is conspicuously published with no anti-solicitation statement and an offer is relevant to the business role. Sources: https://ised-isde.canada.ca/site/canada-anti-spam-legislation/en/getting-consent-send-email and https://web.crtc.gc.ca/eng/com500/guide.htm
- No previous sent messages found for the two businesses in the authorized mailbox and no entries in our business suppression list.

### Outreach execution
- Gmail send request for Anytime Electric was blocked by the connector/tool's safety checks; **no email was sent**. Do not claim a customer contact or defeat these checks by routing through another send action.
- Draft for Anytime Electric created in the authorized Gmail account, draft ID `r-3409618832371089716`.
- Draft for J Barry Electrical created, draft ID `r-292009120373164387`.
- Both prospects marked `draft_created_not_sent` with no sent-message IDs, no response, and no sale.
- Owner's approved private mailing address appears only in private Gmail drafts as a CASL footer; it is **not stored in public GitHub**.

### Money and experiment evidence
Actual cash spending C$0, revenue collected C$0. E001 has **0 confirmed outbound messages, 0 replies, 0 paid orders**. Drafts and incomplete checkout sessions are not conversions.

### Next actions
Grow qualified public-source prospect pool, publish a helpful organic contractor checklist on our own service site, and collect legitimate inbound requests. Re-evaluate legally and operationally permitted acquisition delivery without retrying tool-blocked send operations. Monitor business email and verified paid Stripe sessions, keeping the existing no-cap link unchanged.

## 2026-10-24 late evening — Target market changed to Toronto/GTA
Owner expressly excluded Saskatchewan businesses as sales targets and chose Toronto/GTA Ontario. Updated CONTROL.json, site homepage, and the contractor checklist to Toronto/GTA. Excluded LRS-SK-001/002 in PROSPECTS.csv; both prior SK Gmail drafts were moved to Trash with API confirmation. No messages had been sent to those leads.

Research on Toronto home-service companies found two business contacts with public-page contact-path ambiguities, tracked as LRS-GTA-001 Urban Plumbing and LRS-GTA-002 Plumbing Toronto; two individually written Gmail drafts were saved and recorded as UNSENT, not leads contacted or qualified replies. Underlying visitor friction is a hypothesis, not verified missed business. No consumer or customer data was accessed.

A manual redeploy of the authorized Render static site was triggered, ID dep-dbend5navr4c73bg0rb0, and initial status was build_in_progress; confirm before reporting the new site version live. Hourly automation updated to target only Toronto/GTA and respect owner's no-purchase-limit decision. Financial ledger remains unchanged: C$0 realized revenue, C$0 spent, zero actual commercial messages sent. Next: verify deploy; individually qualify GTA opportunities and follow CASL gates, then monitor genuine incoming requests.
