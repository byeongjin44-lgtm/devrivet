# DevRivet

A free, fast, browser-based collection of developer utilities. No sign-up, no login, no database, no server-side processing of your data.

## Purpose

This project is a Developer Tools–only website aimed at:

- Organic global search traffic (Google)
- Very fast load and interaction speed
- Zero-friction use (no login, instant access)
- Local, in-browser processing for all tool logic
- Low server/hosting cost (fully static where possible)
- Future Google AdSense monetization
- Continued expansion with more developer tools (never unrelated categories)

## Current tools (MVP)

- **Base64 Encoder / Decoder** — `/base64`
- **UUID Generator** (v4 / v7, bulk, validator) — `/uuid-generator`
- **SQL Formatter** (Standard SQL, MySQL, PostgreSQL, SQL Server, SQLite) — `/sql-formatter`
- **Cron Expression Generator** (builder, explain, validate, next runs) — `/cron-generator`

## Planned future tools

JSON Formatter, Timestamp Converter, JWT Decoder, Regex Tester, and other developer utilities. Each new tool stays within the Developer Tools category — no timers, image tools, barcode tools, or calculators on this site (those would be separate, dedicated sites).

## Privacy principle

All tool input (text, SQL, UUIDs, cron expressions) is processed locally in the browser. Nothing you type into a tool is intentionally sent to or stored on a server. See `/privacy` for the full policy.

## Tech stack

- Next.js 16.4.0 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4
- `uuid`, `sql-formatter`, `cron-parser`, `cronstrue`
- Vitest for unit tests

Each tool's library is only imported by that tool's page/component, so route-based code splitting keeps the homepage bundle free of SQL/cron/UUID formatting code.

## Getting started

```bash
npm install
npm run dev       # start dev server at http://localhost:3000
npm run build     # production build
npm run start     # run the production build
npm run lint      # ESLint
npm run test      # run unit tests (Vitest)
```

Requires Node.js 20.9+ (the minimum supported by Next.js 16); this project was built and tested on Node 24.

## Project structure

```
src/
  app/                 Routes (App Router): home, tool pages, policy pages, sitemap, robots
  components/
    layout/            Header, Footer, Container, ToolPageLayout
    tools/             Client-side interactive tool components
  lib/                 Pure tool logic + unit tests (base64, uuid, sql-format, cron)
```

`src/lib/site-config.ts` centralizes `SITE_NAME` (now `DevRivet`), `SITE_URL`, `SITE_DESCRIPTION`, and the tool registry — update it in one place for any future brand/domain change.

## Known issues

- **`SITE_URL` is still a placeholder** (`https://example.com`) — the real domain (`devrivet.com`) is not yet purchased/connected. Update `SITE_URL` in `src/lib/site-config.ts` once it is; this is the only place it's defined, so canonical URLs, sitemap, robots, and JSON-LD all pick it up automatically. **Blocker for production launch.**
- **Contact email is still a placeholder** (`contact@example.com` in `src/app/contact/page.tsx`) — update to a real `@devrivet.com` address once the domain is confirmed. **Blocker for production launch.**
- `npm audit` reports 5 high-severity advisories in `braces`/`micromatch`/`fast-glob`, pulled in transitively by `eslint-config-next`. This is a **dev-only lint tooling** dependency chain (not part of the production bundle) and the advisory requires attacker-controlled glob patterns, which doesn't apply to our lint usage. No non-breaking fix is currently published upstream; revisit when `eslint-config-next` releases an update.
- Next.js has an out-of-band security update announced for 2026-10-14 (two Critical, one High severity, in upstream dependencies). This project stays on `16.4.0` (the then-latest), which already includes fixes for CVE-2026-75604 (Windows path traversal RCE) and CVE-2026-44580 (XSS). **TODO: Re-check official Next.js security update on or after 2026-10-14 before production launch.**
