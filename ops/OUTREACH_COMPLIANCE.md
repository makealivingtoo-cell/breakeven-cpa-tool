# Outbound Commercial Email Compliance Gate — Canada

**Status: BLOCKED.** The business mailbox is connected, but the owner has not supplied a verified mailing address or explicitly authorized unsolicited sales outreach. `ops/CONTROL.json` has `allow_outbound_messages=false`. Do not send cold pitches or add recipients to a campaign while false.

## Canadian CASL checks for each proposed commercial email
1. Verify a lawful consent basis (express or narrowly applicable implied consent), and record proof. A publicly displayed email is **not automatically** consent. Conspicuous publication may qualify only when the recipient published it without an anti-solicitation statement and the message directly relates to their business duties.
2. Confirm the sender's legal/trading name, a valid mailing address (not necessarily home; PO box may be acceptable), and another permitted contact method. Mailing address must remain valid for 60 days after sending.
3. Provide a simple, functioning unsubscribe mechanism (e.g., reply 'unsubscribe') that remains available and honor requests within 10 business days. Log suppressions immediately; never recontact suppressed addresses for promotions.
4. Verify no earlier outreach or opt-out. Check `ops/PROSPECTS.csv`, `ops/SUPPRESSION.csv`, and sent mail before sending.
5. Tailor to a verifiable public observation and role relevance. Avoid mass scraping, purchased lists, misleading subject lines, fabricated audit results, or unsupported claims.
6. Require `allow_outbound_messages=true` and a completed per-recipient record. A configured Gmail sender alone does not lift the hold.
7. Log each sent Gmail message ID, recipient, date, lawful basis, and outcome; enforce maximum volume from CONTROL.

## Distinguish customer inquiries
The CRTC describes an exemption for a commercial message sent **in response to the recipient's request, inquiry or complaint**. Reply narrowly to the actual request and avoid treating an inquiry as unlimited permission for promotional follow-up. Record thread/message IDs and check for prior responses.

## Primary regulator references
- CRTC FAQ: https://crtc.gc.ca/eng/com500/faq500.htm
- CRTC implied consent guidance: https://web.crtc.gc.ca/eng/com500/guide.htm
- CRTC information session on inquiries/quotes: https://crtc.gc.ca/eng/com500/info.htm
- CRTC Act and regulations: https://web.crtc.gc.ca/eng/internet/anti/reg.htm

## Current practical acquisition options
- Accept genuine inbound requests from the published landing page.
- Conduct market research and prepare non-sent outreach drafts.
- Explore organic marketing **only on separately authorized owned accounts**; do not create/modify existing social profiles or post under unrelated brands.
- Do not send unsolicited commercial messages via email, SMS, or social DMs as a workaround.
