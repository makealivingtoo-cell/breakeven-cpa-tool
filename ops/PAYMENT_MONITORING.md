# Lead Recovery Snapshot — payment-link intake and reconciliation

## Account and link verified on 2026-10-24
- Live Stripe account: `swiftscape.org`, context `acct_1QIAkSDIXuiuULNg`
- Business product: `prod_VVHyCLTlo5i4wQ`, one-time price `price_1UUHOcDIXuiuULNgqxx4apWT`
- Checkout link: `plink_1UUHe4DIXuiuULNgCfdf2Uxn`
- URL: https://buy.stripe.com/6oU7sLf2cfTUeL46r59bO00
- Stripe line-item readback verified quantity 1, C$99.00 (9900 cents CAD), correct product.
- Link was active on verification, but has **no completed-session restriction**, no required custom intake fields, and `automatic_tax.enabled=true`. Actual tax registration and checkout tax behavior not yet checked.
- No completed or pending sessions for this payment link were found in the initial read.
- Do not infer revenue or create orders from link existence.

## Safe selling process
1. Website advertises the C$99 offer and requests an **email inquiry first**. Do not add a public pay-now button until link cap, tax, and automated/adequately responsive payment detection are checked.
2. Confirm the customer's scope, service area, site URL, and capacity; accept only up to five open paid pilots. Keep all messages scoped to this business mailbox.
3. Send the payment URL only to accepted customers, with instructions to include the business name, website, service area, primary service, and preferred inquiry channel. Explain 48-hour delivery begins after both confirmed payment and complete intake.
4. If a payment occurs, record only the matched link/session into `ops/ORDERS.csv` (customer data should be minimized in public GitHub; avoid storing personal addresses and sensitive data). Treat **payment_status='paid'** as paid; never count open/unpaid sessions as revenue.
5. Obtain settled fee details from the related PaymentIntent/charge and balance transaction, if available. Do not assume zero Stripe fees. Update `ops/LEDGER.csv` only from verified transactions.
6. Deliver sourced recommendations and handle refund deadlines per `ops/DELIVERY_SOP.md`.
7. Honor refunds and remove/suppress customer data in accordance with retention obligations.

## Hourly watch procedure
- Read `ops/CONTROL.json` first; stop if paused.
- Use Stripe `GetCheckoutSessions` with `payment_link=plink_1UUHe4DIXuiuULNgCfdf2Uxn`, `limit=100`. Paginate if needed. Inspect **each** new session and `payment_status`. Deduplicate by session ID and any prior order reference.
- Include sessions with `status=complete` and `payment_status=paid`; asynchronous payments can arrive later and need follow-up checks. If sessions are unpaid/expired/unknown, log as such but do not fulfill.
- For a paid session, cross-check customer contact from Stripe Checkout and business intake from customer-initiated Gmail. Start 48-hour SLA only after intake has all required fields and payment is confirmed.
- Email the customer about any missing intake via a narrow service reply, subject to approved sender scope. Do not send broad marketing.
- **Do not mix swiftscape.org's unrelated payments with business revenue**. Filter by exact payment link and price.
- Alert the owner if payment appears and delivery cannot be safely handled or if a refund deadline arises.
- No webhooks are configured; hourly polling is a temporary backstop, not real-time guaranteed fulfillment. A signed Stripe webhook handler with idempotent order handling is required before broad checkout promotion.

## Required checkout improvements
- Restrict this newly created link to **five** completed sessions, or make the link inactive once capacity is reached. The link currently is unbounded; manual fulfillment limits do not prevent overselling.
- Validate automatic tax against the account's actual Saskatchewan/other applicable registration. Do not tell a customer C$99 tax-inclusive if uncertain.
- Link currently has no custom intake fields. Business intake must be collected independently before payment.
- Do not modify any other Stripe product, link, customer, subscriptions, prices, account branding, or settings.
