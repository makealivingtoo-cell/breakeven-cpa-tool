# Hourly autonomous operations runbook

## Current live status
Scheduled hourly automation **Lead Recovery Operator** is active as of 2026-10-24; this does not mean an always-on server exists. First successful unattended run is pending verification. Daily financial report has a separate daily automation.

## State and source of truth
- `ops/CONTROL.json`: pause, permissions, spending limits
- `ops/OPERATING_JOURNAL.md`: decision journal and timestamped runs
- `ops/LEDGER.csv`: verified money movements and fees, never forecasts as collections
- `ops/EXPERIMENTS.csv`: hypotheses, budgets, thresholds and outcomes
- `ops/DELIVERY_SOP.md`: fulfillment and refund safeguards

## Hourly run procedure
1. Read CONTROL.json first. If `status` is not `active`, do not send, spend, deploy, change third-party state, or accept orders.
2. Read ledger and experiment registry; select one unblocked task worth doing this hour.
3. Perform bounded work. Keep external claims sourced, messages relevant and consent-compliant.
4. Make each prospect and outbound record durable with a unique identifier; check it before sending.
5. Record what actually happened (including failure) to the journal; update only verified financial entries.
6. Escalate incidents and customer delivery deadlines, not routine permission reminders.

## Hard stop rules
- Never spend or commit funds while `maximum_new_outlay_without_new_approval_cad` is 0.
- Never send messages until `allow_outbound_messages` becomes true following specific account authorization and permission verification.
- Never operate live Stripe until `allow_live_payments` is true following specific account authorization and fulfillment readiness.
- Never deploy until `allow_production_deployment` becomes true following workspace selection and cost review.
- Stop any experiment at its decision threshold; do not continue weak campaigns through repetition.
- Do not alter unrelated account resources, existing main branch files, or account-wide settings.

## Recovery
If a run fails, record the error once, check the last successful action identifier, and retry only idempotent steps. Human can pause operations by changing CONTROL.json status to `paused`, or by disabling the hourly automation. To resume, confirm ledger/customer obligations and change status to `active`.

## Stripe account authorization — 2026-10-24
The owner explicitly selected the connected live Stripe account named `swiftscape.org` (context `acct_1QIAkSDIXuiuULNg`) for API usage, **without changing existing things**. Treat this as read-only API permission. Do not create products, payment links, checkouts, customers, refunds, subscriptions, payouts, or other changes in that account until an express, narrower authorization is given. No API keys or secrets are to be extracted, copied, or placed in source control. Use the OAuth-connected Stripe tool for eligible read operations only. Existing `allow_live_payments` remains false.

## Render and Gmail permissions — 2026-10-24
- Render: owner authorized a **new free** static site in workspace `My Workspace` (`tea-d709v18gjchc73d34qs0`). Created `lead-recovery-snapshot` (`srv-dbejq5ks728c73cfj1gg`) with URL `https://lead-recovery-snapshot.onrender.com`. First deployment `dep-dbejq5ks728c73cfj1sg` reached `live`. Source is `lead-recovery-site/index.html` on `lead-recovery-audit`; `autoDeploy=no`. No existing Render services may be edited. Manual deployment is permitted only to repair/maintain this newly created site, subject to budget and scope.
- **Billing risk:** Render's free static sites consume shared workspace pipeline minutes and bandwidth; overage charges are possible if a payment method exists. No monthly hard cap for outbound bandwidth is exposed by this connector. Monitor bandwidth and avoid automatic builds.
- Gmail: owner selected `makealivingtoo@gmail.com` (connected link `link_6abea640378c8191a4539d979d7a71d9`) as the business mailbox; OAuth profile verified. You may read relevant inquiries and send narrow replies to customer-initiated inquiries, with deduplication; never alter unrelated personal messages.
- Cold outreach remains disabled pending documented CASL compliance, including the business sender's lawful mailing address and working opt-out process. Never assume the connected account selection by itself is authorization to send unsolicited messages.
- Stripe `swiftscape.org` remains read-only; site asks for email inquiries and does not charge visitors.


## Superseding owner checkout authorization — 2026-10-24
Later owner authorization supersedes the initial read-only Stripe restriction **only for new Lead Recovery Snapshot product, price, payment link and necessary related checkout safety/monitoring actions**. The owner created the LRS product and supplied its payment URL. Verified live IDs and workflow are in `ops/CONTROL.json` and `ops/PAYMENT_MONITORING.md`. Do not alter any unrelated Stripe resources or account settings.

Before using this payment link: read `ops/PAYMENT_MONITORING.md`. The link is active, at C$99 one time, but **does not have a five-checkout limit**; automatic tax is enabled; signed webhook fulfillment is not configured. Keep the link off public website until those are resolved. For accepted email inquiries, independently verify capacity and complete intake before sharing payment link. Poll checkout sessions hourly, filter strictly by `payment_link`, deduplicate and record any verified paid session. If a paid session exists, prioritize customer follow-up and delivery. Never count a pending checkout as revenue.

CASL cold-email permissions were expanded by owner, but outbound remains conditioned on **per-recipient** evidence, proper sender identification, business relevance, compliance footer and unsubscribe suppression. Do not store the owner's private mailing address in public GitHub. Sending is not a substitute for validation; no claim of prospect contact without Gmail message ID.
