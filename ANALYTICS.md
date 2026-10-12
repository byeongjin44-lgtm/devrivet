# Analytics

## Status

**Not enabled yet.** The codebase contains no analytics script — no Cloudflare beacon, no Google
Analytics, no other tracker. Do not add one to the code; see below for how analytics will be enabled.

## Plan: Cloudflare Web Analytics

Production visitor analytics for DevRivet will use
[Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/). It is cookie-free,
does not fingerprint visitors, and does not collect anything typed into the tools. Tool input stays
in the browser regardless of whether analytics is on.

## Enabling it after deploying to Cloudflare

For a site deployed on Cloudflare Pages / Workers, or proxied through Cloudflare:

1. Cloudflare dashboard → **Analytics & Logs → Web Analytics** (or the Pages/Workers project →
   **Metrics → Web Analytics**).
2. **Add a site** and choose the production hostname (the real domain that replaces the
   `SITE_URL` placeholder in `src/lib/site-config.ts`).
3. Choose **automatic setup** (Cloudflare injects the beacon at the edge for proxied sites/Pages
   projects). No code change in this repo is needed.
   - Use the manual JS snippet only if the site is *not* served through Cloudflare. If that ever
     becomes necessary, add it in one place (`src/app/layout.tsx`) and document it here.
4. Optional: add excluded paths/hostnames (e.g. preview deployments) so test traffic isn't counted.
5. Wait for traffic, then confirm data appears in the dashboard.
6. **Update the Privacy page** (`src/app/privacy/page.tsx`, "Analytics and advertising" section) to
   say Cloudflare Web Analytics is in use and what it collects. There is a `TODO(analytics)` comment
   there marking the spot. Do this at the same time analytics is switched on, not before.

## What the dashboard shows

| Metric | Meaning |
| --- | --- |
| Visits | Sessions arriving from an external referrer or direct navigation |
| Page Views | Total page loads |
| Paths | Which pages (tools) are visited most |
| Referrers | Where visitors came from (search engines, links) |
| Countries | Visitor country |
| Devices | Device type (desktop / mobile / tablet) |
| Browsers | Browser family |
| Core Web Vitals | Real-user LCP, INP, CLS per page |

All metrics can be filtered by path, country, device, etc. and viewed over a selectable time range.
