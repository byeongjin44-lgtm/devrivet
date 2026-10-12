import { afterEach, describe, expect, it, vi } from "vitest";
import { testRegex, type RegexTestResult } from "./regex";
import {
  REGEX_TIMEOUT_MESSAGE,
  REGEX_TIMEOUT_MS,
  REGEX_WORKER_UNAVAILABLE_MESSAGE,
  runRegex,
  type RegexWorkerLike,
  type RegexWorkerRequest,
} from "./regex-runner";

/** Fake worker: `respond` decides what (if anything) it posts back, asynchronously. */
function fakeWorker(respond: (req: RegexWorkerRequest, worker: RegexWorkerLike) => void) {
  const worker: RegexWorkerLike & { terminated: boolean; requests: RegexWorkerRequest[] } = {
    terminated: false,
    requests: [],
    onmessage: null,
    onerror: null,
    postMessage(req) {
      this.requests.push(req);
      queueMicrotask(() => respond(req, worker));
    },
    terminate() {
      this.terminated = true;
    },
  };
  return worker;
}

const reply = (worker: RegexWorkerLike, data: RegexTestResult) =>
  worker.onmessage?.({ data } as MessageEvent<RegexTestResult>);

afterEach(() => {
  vi.useRealTimers();
});

describe("runRegex", () => {
  it("returns the worker's result and terminates the worker", async () => {
    const worker = fakeWorker((req, w) => reply(w, testRegex(req.pattern, req.flags, req.input)));
    const result = await runRegex("\\d+", "g", "Order 123, Order 456", { createWorker: () => worker });
    expect(result.ok && result.matches.map((m) => m.text)).toEqual(["123", "456"]);
    expect(worker.requests).toEqual([{ pattern: "\\d+", flags: "g", input: "Order 123, Order 456" }]);
    expect(worker.terminated).toBe(true);
  });

  it("passes invalid-regex errors through from the worker", async () => {
    const worker = fakeWorker((req, w) => reply(w, testRegex(req.pattern, req.flags, req.input)));
    const result = await runRegex("[abc", "g", "abc", { createWorker: () => worker });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/^Invalid regular expression/);
  });

  it("times out, terminates the worker, and reports excessive backtracking", async () => {
    vi.useFakeTimers();
    const worker = fakeWorker(() => {}); // never responds, like a backtracking pattern
    const pending = runRegex("(a+)+$", "", "a".repeat(40) + "!", { createWorker: () => worker });

    await vi.advanceTimersByTimeAsync(REGEX_TIMEOUT_MS - 1);
    expect(worker.terminated).toBe(false);
    await vi.advanceTimersByTimeAsync(1);

    await expect(pending).resolves.toEqual({ ok: false, error: REGEX_TIMEOUT_MESSAGE });
    expect(worker.terminated).toBe(true);
  });

  it("uses the default timeout of about 1–2 seconds", () => {
    expect(REGEX_TIMEOUT_MS).toBeGreaterThanOrEqual(1000);
    expect(REGEX_TIMEOUT_MS).toBeLessThanOrEqual(2000);
  });

  it("respects a custom timeout", async () => {
    vi.useFakeTimers();
    const worker = fakeWorker(() => {});
    const pending = runRegex("x", "", "x", { createWorker: () => worker, timeoutMs: 100 });
    await vi.advanceTimersByTimeAsync(100);
    await expect(pending).resolves.toEqual({ ok: false, error: REGEX_TIMEOUT_MESSAGE });
  });

  it("ignores a late reply after the timeout", async () => {
    vi.useFakeTimers();
    let late: RegexWorkerLike | undefined;
    const worker = fakeWorker((_req, w) => (late = w));
    const pending = runRegex("a", "g", "a", { createWorker: () => worker, timeoutMs: 50 });
    await vi.advanceTimersByTimeAsync(50);
    reply(late!, { ok: true, matches: [], truncated: false });
    await expect(pending).resolves.toEqual({ ok: false, error: REGEX_TIMEOUT_MESSAGE });
  });

  it("reports a worker error instead of hanging", async () => {
    const worker = fakeWorker((_req, w) => w.onerror?.(new ErrorEvent("error")));
    const result = await runRegex("a", "g", "a", { createWorker: () => worker });
    expect(result).toEqual({ ok: false, error: "Regular expression evaluation failed." });
    expect(worker.terminated).toBe(true);
  });

  it("returns an unavailable error, without evaluating, where Web Workers are unsupported", async () => {
    // jsdom has no Worker, so this is the real default path in an unsupported browser.
    expect(typeof Worker).toBe("undefined");
    const unavailable = { ok: false, error: REGEX_WORKER_UNAVAILABLE_MESSAGE };
    await expect(runRegex("\\d+", "g", "1 22 333")).resolves.toEqual(unavailable);
    await expect(runRegex("a", "g", "aaa", { createWorker: null })).resolves.toEqual(unavailable);
    // A pattern that would hang the main thread still returns immediately — proof it isn't evaluated here.
    await expect(runRegex("(a+)+$", "", "a".repeat(40) + "!")).resolves.toEqual(unavailable);
  });

  it("returns an unavailable error, without evaluating, if the worker cannot be created", async () => {
    const result = await runRegex("b", "g", "abc", {
      createWorker: () => {
        throw new Error("blocked by CSP");
      },
    });
    expect(result).toEqual({ ok: false, error: REGEX_WORKER_UNAVAILABLE_MESSAGE });
  });});
