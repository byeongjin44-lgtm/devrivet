# Analytics

## Status

**Enabled.** Production (`https://devrivettools.com`) uses
[Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/) with **automatic setup**:
Cloudflare injects its beacon (`static.cloudflareinsights.com/beacon.min.js`) into the HTML at the
edge. The repo itself contains no analytics script, and the static build in `out/` has none.

## Do not add analytics code to the repo

- Do **not** add the manual `beacon.min.js` snippet (e.g. in `src/app/layout.tsx`). Automatic setup
  already injects it, and Cloudflare allows only one Web Analytics snippet per page — a manual copy
  would duplicate it.
- Do **not** add Google Analytics, Google Tag Manager, or any other tracker, and don't install an
  analytics package.
- Use the manual snippet only if the site ever stops being served through Cloudflare. In that case,
  turn off automatic setup first, add the snippet in one place (`src/app/layout.tsx`), and document
  it here.

To check that there is exactly one beacon, fetch a production page with a browser-like
`User-Agent`/`Accept: text/html` header and count `beacon.min.js` (it should be 1). The local `out/`
build should contain 0.

## Privacy

Cloudflare states that Web Analytics doesn't use cookies or localStorage to collect usage
metrics, and doesn't fingerprint visitors. It also doesn't log query strings. Tool input never
leaves the browser, and no tool writes input into the URL. The public disclosure lives in the
"Analytics" section of the Privacy page (`src/app/privacy/page.tsx`). Keep the two in sync if the
analytics setup changes.

## Dashboard settings

Cloudflare dashboard → **Analytics & Logs → Web Analytics** (or the Pages project → **Metrics →
Web Analytics**). Optional: exclude preview hostnames (`*.pages.dev`) so test traffic isn't counted.

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
