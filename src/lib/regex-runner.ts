import type { RegexTestResult } from "./regex";

export const REGEX_TIMEOUT_MS = 1500;

/** How long a new worker may take to download and start before it counts as failed to load. */
export const REGEX_WORKER_INIT_TIMEOUT_MS = 10_000;

export const REGEX_TIMEOUT_MESSAGE =
  "Regular expression timed out. The pattern may cause excessive backtracking.";

export const REGEX_WORKER_UNAVAILABLE_MESSAGE =
  "Regex testing is unavailable because Web Workers are not supported in this browser.";

export const REGEX_WORKER_INIT_FAILED_MESSAGE =
  "The regex engine couldn't be loaded. Check your connection and try again.";

export const REGEX_EVALUATION_FAILED_MESSAGE = "Regular expression evaluation failed.";

export const REGEX_CANCELLED_MESSAGE = "Regex test cancelled.";

export type RegexWorkerRequest = { pattern: string; flags: string; input: string };

/** Messages from the worker: `ready` once it has loaded, then one `result` per request. */
export type RegexWorkerResponse = { type: "ready" } | { type: "result"; result: RegexTestResult };

/** The subset of `Worker` used here, so tests can supply a fake. */
export type RegexWorkerLike = {
  postMessage(message: RegexWorkerRequest): void;
  terminate(): void;
  onmessage: ((event: MessageEvent<RegexWorkerResponse>) => void) | null;
  onmessageerror: ((event: MessageEvent) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
};

function createRegexWorker(): RegexWorkerLike {
  return new Worker(new URL("./regex.worker.ts", import.meta.url), { type: "module" });
}

type RunOptions = {
  timeoutMs?: number;
  initTimeoutMs?: number;
  /** Aborting terminates the worker; the promise then resolves with `REGEX_CANCELLED_MESSAGE`. */
  signal?: AbortSignal;
  /** Defaults to a real Web Worker; `null` simulates a browser without Web Worker support. */
  createWorker?: (() => RegexWorkerLike) | null;
};

/**
 * Evaluates a regex in a fresh Web Worker and terminates it after `timeoutMs`,
 * so catastrophic backtracking can't hang the page. Never evaluates on the
 * main thread: if no worker can be used, it returns an error instead.
 *
 * The run timeout starts only once the worker reports `ready` and the request
 * is sent, so the time to download and start the worker script on a cold cache
 * isn't mistaken for backtracking. Loading has its own, longer timeout.
 */
export function runRegex(
  pattern: string,
  flags: string,
  input: string,
  { timeoutMs = REGEX_TIMEOUT_MS, initTimeoutMs = REGEX_WORKER_INIT_TIMEOUT_MS, signal, createWorker }: RunOptions = {},
): Promise<RegexTestResult> {
  const factory = createWorker === undefined ? (typeof Worker === "undefined" ? null : createRegexWorker) : createWorker;
  const unavailable: RegexTestResult = { ok: false, error: REGEX_WORKER_UNAVAILABLE_MESSAGE };
  const cancelled: RegexTestResult = { ok: false, error: REGEX_CANCELLED_MESSAGE };
  if (!factory) return Promise.resolve(unavailable);
  if (signal?.aborted) return Promise.resolve(cancelled);

  return new Promise((resolve) => {
    let worker: RegexWorkerLike;
    try {
      worker = factory();
    } catch {
      resolve(unavailable);
      return;
    }

    let phase: "init" | "run" | "done" = "init";
    let timer: ReturnType<typeof setTimeout> | undefined;
    const fail = (error: string): RegexTestResult => ({ ok: false, error });
    // Before the worker is ready, any failure means it couldn't be loaded; after, the evaluation failed.
    const failure = () =>
      fail(phase === "init" ? REGEX_WORKER_INIT_FAILED_MESSAGE : REGEX_EVALUATION_FAILED_MESSAGE);

    const finish = (result: RegexTestResult) => {
      if (phase === "done") return;
      phase = "done";
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      worker.onmessage = null;
      worker.onmessageerror = null;
      worker.onerror = null;
      worker.terminate();
      resolve(result);
    };
    function onAbort() {
      finish(cancelled);
    }

    timer = setTimeout(() => finish(fail(REGEX_WORKER_INIT_FAILED_MESSAGE)), initTimeoutMs);
    signal?.addEventListener("abort", onAbort);

    worker.onmessage = (event) => {
      const data = event.data;
      if (phase === "init" && data?.type === "ready") {
        clearTimeout(timer);
        phase = "run";
        timer = setTimeout(() => finish(fail(REGEX_TIMEOUT_MESSAGE)), timeoutMs);
        worker.postMessage({ pattern, flags, input });
      } else if (phase === "run" && data?.type === "result" && data.result) {
        finish(data.result);
      } else {
        finish(failure());
      }
    };
    worker.onmessageerror = () => finish(failure());
    worker.onerror = (event) => {
      event.preventDefault?.();
      finish(failure());
    };
  });
}
