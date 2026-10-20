# CLAUDE.md

Guidance for Claude Code (and any other agent) working in this repository.

## What this project is

This project is DevRivet, a global browser-based Developer Tools website. Current tools (10): Base64 encoder/decoder, UUID generator, SQL formatter, cron expression generator, JSON formatter/validator, URL encoder/decoder, Unix timestamp converter, JWT decoder, regex tester, hash generator.

## Hard rules — do not violate

- **DevRivet v1 feature set is locked at 10 tools until real production traffic data is available.** Do not add new tools (or new features to existing tools) before production traffic data shows real demand. If asked to, flag this rule first.
- **Developer Tools category only.** Never add timers, image/barcode tools, calculators, or any other non-developer-tool category to this site. Those are separate future projects.
- **No auth, no accounts, no login.**
- **No database.**
- **No unnecessary backend/API.** Tool logic runs in the browser.
- **No AI features / AI API calls** inside the tools.
- **Never send user tool input to a server.** Base64 text, SQL, UUIDs, cron expressions, etc. stay client-side. If a future tool genuinely cannot run client-side, stop and flag it rather than silently adding a server round-trip.
- **No admin dashboard, no payments, no Redux/heavy state management, no unnecessary UI libraries.**
- **No unfinished/placeholder nav items.** Don't link to tool pages that don't exist yet.
- **No premature architecture.** Don't add abstractions, feature flags, or config systems for requirements that don't exist yet (e.g. no i18n system until the site actually needs multiple languages).

## Working conventions

- Each tool's pure logic lives in `src/lib/<tool>.ts` with a matching `src/lib/<tool>.test.ts`. Keep logic and UI separate — UI components (`src/components/tools/*`) should call into `src/lib/*`, not reimplement parsing/formatting logic inline.
- Every tool page is a Server Component that renders metadata + `ToolPageLayout`, wrapping a `"use client"` tool component for the actual interactive bits. Keep the client boundary as small as possible.
- A tool's third-party library (e.g. `sql-formatter`, `cron-parser`) should only be imported from that tool's `lib`/`component` files, so Next.js route-based code splitting keeps it out of the homepage and other tools' bundles. Don't import a tool-specific library from a shared/layout file.
- Site identity (`SITE_NAME` = "DevRivet", `SITE_URL`, `SITE_DESCRIPTION`) and the tool registry live in `src/lib/site-config.ts`. Update there, not by hardcoding strings in pages. `SITE_URL` is the production domain (`https://devrivettools.com`) — every page reads it from this one config (canonical URLs, sitemap, robots, Open Graph, JSON-LD), so don't hardcode a URL anywhere else.
- New tool pages need: unique `title`/`description`/canonical metadata, an entry in `TOOLS` in `site-config.ts` with a `category` from `TOOL_CATEGORIES` (this drives the grouped homepage cards, the header Tools menu, and the sitemap), a short "What is X / How to use / Example / FAQ" content section (real, useful content — not SEO filler), and a `PrivacyNote` / local-processing notice if it processes user input.
- `next.config.ts` intentionally does **not** enable Cache Components / Partial Prerendering — this site is a static shell around client-interactive tools, and that feature adds prerendering complexity (no `new Date()`/`Math.random()` during static render, etc.) with no benefit here. Don't re-enable it without a concrete reason.
- Keep tool-specific dependencies minimal and only add a library when it's clearly the standard choice for that tool (e.g. `uuid`, `sql-formatter`, `cron-parser` + `cronstrue`).

## After any change

Run, and fix failures before considering the task done:

```bash
npm run lint
npm run test
npm run build
```

## Before upgrading Next.js

Check the official Next.js security advisories / release notes for the target version first — don't blindly jump to whatever `npm view next dist-tags` calls `latest` without checking for an announced-but-unreleased security patch that would land days later.
