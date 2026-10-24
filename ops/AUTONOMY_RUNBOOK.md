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
