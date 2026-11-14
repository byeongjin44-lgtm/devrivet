import { afterEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { CronTool } from "./CronTool";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | null = null;
let container: HTMLDivElement | null = null;

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
});

function mount() {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root!.render(<CronTool />));
  return container;
}

function presetButtons(el: HTMLElement) {
  return [...el.querySelectorAll<HTMLButtonElement>("button[aria-pressed]")];
}

function pressed(el: HTMLElement) {
  return presetButtons(el)
    .filter((b) => b.getAttribute("aria-pressed") === "true")
    .map((b) => b.textContent?.replace("✓", "").trim());
}

describe("CronTool presets", () => {
  it("marks the clicked preset as selected, and only that one", () => {
    const el = mount();
    expect(presetButtons(el)).toHaveLength(8);
    expect(pressed(el)).toEqual([]); // the default expression is not a preset

    const five = presetButtons(el).find((b) => b.textContent === "Every 5 minutes")!;
    act(() => five.click());
    expect(pressed(el)).toEqual(["Every 5 minutes"]);
    expect(five.textContent).toContain("✓");

    const hour = presetButtons(el).find((b) => b.textContent === "Every hour")!;
    act(() => hour.click());
    expect(pressed(el)).toEqual(["Every hour"]);
  });

  it("clears the selection when a field is edited away from the preset", () => {
    const el = mount();
    act(() => presetButtons(el).find((b) => b.textContent === "Every day")!.click());
    expect(pressed(el)).toEqual(["Every day"]);

    const hourInput = el.querySelector<HTMLInputElement>("#cron-hour")!;
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    act(() => {
      setValue.call(hourInput, "9");
      hourInput.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(pressed(el)).toEqual([]);
  });
});
