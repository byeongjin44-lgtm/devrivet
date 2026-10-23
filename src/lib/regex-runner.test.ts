import { afterEach, describe, expect, it, vi } from "vitest";
import { testRegex, type RegexTestResult } from "./regex";
import {
  REGEX_CANCELLED_MESSAGE,
  REGEX_EVALUATION_FAILED_MESSAGE,
  REGEX_TIMEOUT_MESSAGE,
  REGEX_TIMEOUT_MS,
  REGEX_WORKER_INIT_FAILED_MESSAGE,
  REGEX_WORKER_INIT_TIMEOUT_MS,
  REGEX_WORKER_UNAVAILABLE_MESSAGE,
  runRegex,
  type RegexWorkerLike,
  type RegexWorkerRequest,
  type RegexWorkerResponse,
} from "./regex-runner";

type FakeWorker = RegexWorkerLike & { terminated: boolean; requests: RegexWorkerRequest[] };

/**
 * Fake worker. Like the real one it announces `ready` once "loaded" — after `readyAfterMs`
 * (a setTimeout, so fake timers control it), or never with `null`. `respond` decides what
 * (if anything) it posts back for each request, asynchronously.
 */
function fakeWorker(
  respond: (req: RegexWorkerRequest, worker: FakeWorker) => void,
  { readyAfterMs = 0 as number | null } = {},
) {
  const worker: FakeWorker = {
    terminated: false,
    requests: [],
    onmessage: null,
    onmessageerror: null,
    onerror: null,
    postMessage(req) {
      this.requests.push(req);
      queueMicrotask(() => respond(req, worker));
    },
    terminate() {
      this.terminated = true;
    },
  };
  if (readyAfterMs !== null) setTimeout(() => send(worker, { type: "ready" }), readyAfterMs);
  return worker;
}

const send = (worker: RegexWorkerLike, data: RegexWorkerResponse) =>
  worker.onmessage?.({ data } as MessageEvent<RegexWorkerResponse>);
const reply = (worker: RegexWorkerLike, result: RegexTestResult) => send(worker, { type: "result", result });
const evaluate = (req: RegexWorkerRequest, w: RegexWorkerLike) => reply(w, testRegex(req.pattern, req.flags, req.input));

afterEach(() => {
  vi.useRealTimers();
});

describe("runRegex", () => {
  it("returns the worker's result and terminates the worker", async () => {
    const worker = fakeWorker(evaluate);
    const result = await runRegex("\\d+", "g", "Order 123, Order 456", { createWorker: () => worker });
    expect(result.ok && result.matches.map((m) => m.text)).toEqual(["123", "456"]);
    expect(worker.requests).toEqual([{ pattern: "\\d+", flags: "g", input: "Order 123, Order 456" }]);
    expect(worker.terminated).toBe(true);
  });

  it("passes invalid-regex errors through from the worker", async () => {
    const worker = fakeWorker(evaluate);
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
  });
});

describe("runRegex worker start-up (cold cache)", () => {
  it("does not count worker download/start-up time against the run timeout", async () => {
    // Regression: the 1.5 s timer used to start at `new Worker()`, so a slow first load
    // made `\d+` fail with the backtracking message.
    vi.useFakeTimers();
    const worker = fakeWorker(evaluate, { readyAfterMs: REGEX_TIMEOUT_MS * 3 });
    const pending = runRegex("\\d+", "g", "Order 123, Order 456", { createWorker: () => worker });

    await vi.advanceTimersByTimeAsync(REGEX_TIMEOUT_MS * 3 - 1);
    expect(worker.requests).toEqual([]); // nothing is sent before the worker is ready
    expect(worker.terminated).toBe(false);
    await vi.advanceTimersByTimeAsync(1);

    const result = await pending;
    expect(result.ok && result.matches.map((m) => m.text)).toEqual(["123", "456"]);
    expect(worker.terminated).toBe(true);
  });

  it("starts the 1.5 s run timeout when the request is sent, after a slow start-up", async () => {
    vi.useFakeTimers();
    const startup = 3000;
    const worker = fakeWorker(() => {}, { readyAfterMs: startup }); // ready late, then backtracks forever
    const pending = runRegex("(a+)+$", "", "a".repeat(40) + "!", { createWorker: () => worker });

    await vi.advanceTimersByTimeAsync(startup);
    expect(worker.requests).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(REGEX_TIMEOUT_MS - 1);
    expect(worker.terminated).toBe(false);
    await vi.advanceTimersByTimeAsync(1);

    await expect(pending).resolves.toEqual({ ok: false, error: REGEX_TIMEOUT_MESSAGE });
    expect(worker.terminated).toBe(true);
  });

  it("gives up with a load error, not a backtracking error, if the worker never becomes ready", async () => {
    vi.useFakeTimers();
    const worker = fakeWorker(evaluate, { readyAfterMs: null });
    const pending = runRegex("\\d+", "g", "1", { createWorker: () => worker });

    await vi.advanceTimersByTimeAsync(REGEX_WORKER_INIT_TIMEOUT_MS - 1);
    expect(worker.terminated).toBe(false);
    await vi.advanceTimersByTimeAsync(1);

    await expect(pending).resolves.toEqual({ ok: false, error: REGEX_WORKER_INIT_FAILED_MESSAGE });
    expect(worker.requests).toEqual([]);
    expect(worker.terminated).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("reports a load error if the worker script fails before it is ready", async () => {
    const worker = fakeWorker(evaluate, { readyAfterMs: null });
    const pending = runRegex("\\d+", "g", "1", { createWorker: () => worker });
    worker.onerror?.(new ErrorEvent("error")); // e.g. the script 404s or fails to parse
    await expect(pending).resolves.toEqual({ ok: false, error: REGEX_WORKER_INIT_FAILED_MESSAGE });
    expect(worker.requests).toEqual([]);
    expect(worker.terminated).toBe(true);
  });

  it("uses a load timeout well above the run timeout", () => {
    expect(REGEX_WORKER_INIT_TIMEOUT_MS).toBeGreaterThanOrEqual(REGEX_TIMEOUT_MS * 4);
    expect(REGEX_WORKER_INIT_FAILED_MESSAGE).not.toBe(REGEX_TIMEOUT_MESSAGE);
    expect(REGEX_WORKER_INIT_FAILED_MESSAGE).not.toMatch(/backtracking/);
  });
});

describe("runRegex message handling and cleanup", () => {
  it("treats an undeserializable message as an evaluation failure", async () => {
    const worker = fakeWorker((_req, w) => w.onmessageerror?.(new MessageEvent("messageerror")));
    const result = await runRegex("a", "g", "a", { createWorker: () => worker });
    expect(result).toEqual({ ok: false, error: REGEX_EVALUATION_FAILED_MESSAGE });
    expect(worker.terminated).toBe(true);
  });

  it("treats a malformed result message as an evaluation failure", async () => {
    const worker = fakeWorker((_req, w) => w.onmessage?.({ data: { unexpected: true } } as unknown as MessageEvent<RegexWorkerResponse>));
    const result = await runRegex("a", "g", "a", { createWorker: () => worker });
    expect(result).toEqual({ ok: false, error: REGEX_EVALUATION_FAILED_MESSAGE });
  });

  it("leaves no timers or handlers behind after a successful run", async () => {
    vi.useFakeTimers();
    const worker = fakeWorker(evaluate);
    const pending = runRegex("a", "g", "aa", { createWorker: () => worker });
    await vi.advanceTimersByTimeAsync(0);
    expect((await pending).ok).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
    expect(worker.onmessage).toBeNull();
    expect(worker.onmessageerror).toBeNull();
    expect(worker.onerror).toBeNull();
  });

  it("terminates the worker and clears its timers when aborted", async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const worker = fakeWorker(() => {}); // still running when the user starts a new test
    const pending = runRegex("(a+)+$", "", "a".repeat(40) + "!", { createWorker: () => worker, signal: controller.signal });
    await vi.advanceTimersByTimeAsync(10);
    controller.abort();

    await expect(pending).resolves.toEqual({ ok: false, error: REGEX_CANCELLED_MESSAGE });
    expect(worker.terminated).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("ignores a reply that arrives after the run was aborted", async () => {
    const controller = new AbortController();
    let late: RegexWorkerLike | undefined;
    const worker = fakeWorker((_req, w) => (late = w));
    const pending = runRegex("a", "g", "a", { createWorker: () => worker, signal: controller.signal });
    await vi.waitFor(() => expect(late).toBeDefined());
    controller.abort();
    reply(late!, { ok: true, matches: [], truncated: false });
    await expect(pending).resolves.toEqual({ ok: false, error: REGEX_CANCELLED_MESSAGE });
  });

  it("does not create a worker for an already-aborted signal", async () => {
    const createWorker = vi.fn(() => fakeWorker(evaluate));
    const controller = new AbortController();
    controller.abort();
    await expect(runRegex("a", "g", "a", { createWorker, signal: controller.signal })).resolves.toEqual({
      ok: false,
      error: REGEX_CANCELLED_MESSAGE,
    });
    expect(createWorker).not.toHaveBeenCalled();
  });

  it("runs consecutive tests independently, each in its own worker", async () => {
    const workers: FakeWorker[] = [];
    const createWorker = () => {
      const w = fakeWorker(evaluate);
      workers.push(w);
      return w;
    };
    const first = await runRegex("\\d", "g", "a1b2", { createWorker });
    const second = await runRegex("[a-z]", "g", "a1b2", { createWorker });
    expect(first.ok && first.matches.map((m) => m.text)).toEqual(["1", "2"]);
    expect(second.ok && second.matches.map((m) => m.text)).toEqual(["a", "b"]);
    expect(workers).toHaveLength(2);
    expect(workers.every((w) => w.terminated)).toBe(true);
  });
});

describe("regex.worker protocol", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("announces ready on load, then answers each request with a result envelope", async () => {
    const posted: RegexWorkerResponse[] = [];
    const scope: { onmessage: ((e: MessageEvent<RegexWorkerRequest>) => void) | null; postMessage: (m: RegexWorkerResponse) => void } = {
      onmessage: null,
      postMessage: (m) => posted.push(m),
    };
    vi.stubGlobal("self", scope);
    await import("./regex.worker");

    expect(posted).toEqual([{ type: "ready" }]);
    expect(scope.onmessage).toBeTypeOf("function"); // listening before it says ready

    scope.onmessage!({ data: { pattern: "\\d+", flags: "g", input: "a1 b22" } } as MessageEvent<RegexWorkerRequest>);
    expect(posted[1]).toEqual({ type: "result", result: testRegex("\\d+", "g", "a1 b22") });
  });
});
