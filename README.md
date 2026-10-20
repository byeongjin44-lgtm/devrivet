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
- Developer tools only (never unrelated categories)

## Current tools

- **Base64 Encoder / Decoder** — `/base64`
- **UUID Generator** (v4 / v7, bulk, validator) — `/uuid-generator`
- **SQL Formatter** (Standard SQL, MySQL, PostgreSQL, SQL Server, SQLite) — `/sql-formatter`
- **Cron Expression Generator** (builder, explain, validate, next runs) — `/cron-generator`
- **JSON Formatter / Validator** (format, minify, validate) — `/json-formatter`
- **URL Encoder / Decoder** (query/component encoding) — `/url-encoder`
- **Unix Timestamp Converter** (timestamp ↔ date, UTC/local) — `/timestamp-converter`
- **JWT Decoder** (header/payload decode, no signature verification) — `/jwt-decoder`
- **Regex Tester** (JavaScript RegExp: matches, indexes, capture groups, highlighting) — `/regex-tester`
- **Hash Generator** (SHA-256 / SHA-384 / SHA-512 / SHA-1 via Web Crypto) — `/hash-generator`

10 tools in total, grouped on the homepage and in the header Tools menu by the `category` field in `src/lib/site-config.ts`.

## Feature scope (v1 locked)

The DevRivet v1 feature set is locked at the 10 tools above until real production traffic data is available. No new tools until then. Any future tool must stay within the Developer Tools category — no timers, image tools, barcode tools, or calculators on this site (those would be separate, dedicated sites).

## Privacy principle

All tool input (text, SQL, UUIDs, JSON, URLs, timestamps, tokens, regex patterns, text to hash, etc.) is processed locally in the browser. Nothing you type into a tool is intentionally sent to or stored on a server. See `/privacy` for the full policy.

## Tech stack

- Next.js 16.4.1 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4
- `uuid`, `sql-formatter`, `cron-parser`, `cronstrue`
- Browser built-ins (no extra dependencies) for JSON, URL, timestamp, JWT, regex (`RegExp`) and hashing (Web Crypto `crypto.subtle`)
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
    layout/            Header, ToolsMenu, Footer, Container, ToolPageLayout
    tools/             Client-side interactive tool components
  lib/                 Pure tool logic + unit tests (one `<tool>.ts` + `<tool>.test.ts` per tool)
```

`src/lib/site-config.ts` centralizes `SITE_NAME` (now `DevRivet`), `SITE_URL`, `SITE_DESCRIPTION`, `CONTACT_EMAIL`, and the tool registry — update it in one place for any future brand/domain change.

## Contact email

The public contact address is `contact@devrivettools.com`, shown on the Contact page (`CONTACT_EMAIL` in `src/lib/site-config.ts`). Incoming mail is handled by Cloudflare Email Routing, which receives messages for the domain and forwards them to the maintainer's private inbox. Email Routing is receive-and-forward only: it does not send mail, so replies do not go out from `contact@devrivettools.com` unless a separate sending service is set up. Never publish the forwarding destination address on the site.

## Known issues

- `npm audit` reports 5 high-severity advisories in `braces`/`micromatch`/`fast-glob`, pulled in transitively by `eslint-config-next`. This is a **dev-only lint tooling** dependency chain (not part of the production bundle) and the advisory requires attacker-controlled glob patterns, which doesn't apply to our lint usage. No non-breaking fix is currently published upstream; revisit when `eslint-config-next` releases an update.
- Next.js is pinned to `16.4.1`, the 2026-10-14 security release that fixes GHSA-673q-mjm6-r5xr and GHSA-2464-fhr4-w9xw (Critical) and GHSA-p3m5-59mp-jv5r (High). Before any future Next.js upgrade, check the official security advisories and release notes first.
