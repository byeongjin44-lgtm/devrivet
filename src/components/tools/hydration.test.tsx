import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, type ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot, type Root } from "react-dom/client";
import { CronTool } from "./CronTool";
import { TimestampConverterTool } from "./TimestampConverterTool";

// Regression tests for production hydration mismatches (React #418): the static HTML is rendered at
// build time (UTC, build clock) and must match the first client render in any browser timezone/time.

const originalTz = process.env.TZ;

// Node re-reads TZ on assignment, so Date, Intl and cron-parser all see this timezone.
function setBrowserTimezone(timeZone: string) {
  process.env.TZ = timeZone;
}

function restoreTimezone() {
  if (originalTz === undefined) delete process.env.TZ;
  else process.env.TZ = originalTz;
}

function setClock(iso: string) {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(iso));
}

function serverRender(element: ReactElement, timeZone: string, iso: string): string {
  setBrowserTimezone(timeZone);
  setClock(iso);
  const html = renderToString(element);
  restoreTimezone();
  vi.useRealTimers();
  return html;
}

let root: Root | null = null;
let container: HTMLDivElement | null = null;

async function hydrate(html: string, element: ReactElement): Promise<unknown[]> {
  container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);
  const errors: unknown[] = [];
  await act(async () => {
    root = hydrateRoot(container!, element, {
      onRecoverableError: (error) => errors.push(error),
      onUncaughtError: (error) => errors.push(error),
    });
  });
  return errors;
}

async function typeInto(selector: string, value: string) {
  const input = container!.querySelector<HTMLInputElement>(selector)!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

const value = (selector: string) => container!.querySelector<HTMLInputElement>(selector)!.value;

beforeAll(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
  restoreTimezone();
  vi.useRealTimers();
});

describe("TimestampConverterTool hydration", () => {
  it("renders identical static markup regardless of timezone and clock", () => {
    const utc = serverRender(<TimestampConverterTool />, "UTC", "2026-10-13T00:00:00Z");
    const seoul = serverRender(<TimestampConverterTool />, "Asia/Seoul", "2026-10-14T12:34:56Z");
    expect(seoul).toBe(utc);
    expect(utc).not.toContain("UTC");
    expect(utc).not.toContain("1791849600"); // build-time "now" (2026-10-13T00:00:00Z) is not baked in
    expect(utc).not.toContain("2026-10-13");
    expect(utc).toContain("—");
  });

  it("hydrates without mismatch in a non-UTC browser and applies the local timezone after mount", async () => {
    const html = serverRender(<TimestampConverterTool />, "UTC", "2026-10-13T00:00:00Z");
    setBrowserTimezone("Asia/Seoul");
    const errors = await hydrate(html, <TimestampConverterTool />);

    expect(errors).toEqual([]);
    expect(container!.textContent).toContain("local timezone: Asia/Seoul");
    expect(value('[aria-label="Current Unix timestamp in seconds"]')).toMatch(/^\d{10}$/);
    expect(value("#date-input")).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);

    await typeInto("#ts-input", "1704067200");
    expect(value('[aria-label="Date in UTC"]')).toBe("2024-01-01 00:00:00 UTC");
    expect(value('[aria-label="Date in browser local time"]')).toBe("01/01/2024, 09:00:00 (Asia/Seoul)");

    await typeInto("#ts-input", "1704067200000");
    expect(container!.textContent).toContain("Interpreted as milliseconds");
    expect(value('[aria-label="Date in UTC"]')).toBe("2024-01-01 00:00:00 UTC");
  });
});

describe("CronTool hydration", () => {
  it("does not render current-time next runs into static markup", () => {
    const early = serverRender(<CronTool />, "UTC", "2026-10-13T00:00:00Z");
    const later = serverRender(<CronTool />, "America/New_York", "2027-03-02T15:00:00Z");
    expect(later).toBe(early);
    expect(early).not.toMatch(/20\d{2}, \d{2}:\d{2}:\d{2}/);
    expect(early).toContain("Loading…");
    expect(early).toContain("Monday through Friday"); // explanation is time-independent and still prerendered
  });

  it("hydrates without mismatch at a later time and computes next runs after mount", async () => {
    const html = serverRender(<CronTool />, "UTC", "2026-10-13T00:00:00Z");
    setBrowserTimezone("America/New_York");
    setClock("2027-03-02T15:00:00Z");
    const errors = await hydrate(html, <CronTool />);

    expect(errors).toEqual([]);
    expect(container!.textContent).toContain("local timezone: America/New_York");
    const runs = [...container!.querySelectorAll("ol li")].map((li) => li.textContent);
    expect(runs).toHaveLength(5);
    expect(runs[0]).toBe("Wed, Mar 03, 2027, 09:00:00 AM");
    for (const run of runs) expect(run).toMatch(/^(Mon|Tue|Wed|Thu|Fri), .* 09:00:00 AM$/);
  });
});
