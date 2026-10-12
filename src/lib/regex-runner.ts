import type { RegexTestResult } from "./regex";

export const REGEX_TIMEOUT_MS = 1500;

export const REGEX_TIMEOUT_MESSAGE =
  "Regular expression timed out. The pattern may cause excessive backtracking.";

export const REGEX_WORKER_UNAVAILABLE_MESSAGE =
  "Regex testing is unavailable because Web Workers are not supported in this browser.";

export type RegexWorkerRequest = { pattern: string; flags: string; input: string };

/** The subset of `Worker` used here, so tests can supply a fake. */
export type RegexWorkerLike = {
  postMessage(message: RegexWorkerRequest): void;
  terminate(): void;
  onmessage: ((event: MessageEvent<RegexTestResult>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
};

function createRegexWorker(): RegexWorkerLike {
  return new Worker(new URL("./regex.worker.ts", import.meta.url), { type: "module" });
}

type RunOptions = {
  timeoutMs?: number;
  /** Defaults to a real Web Worker; `null` simulates a browser without Web Worker support. */
  createWorker?: (() => RegexWorkerLike) | null;
};

/**
 * Evaluates a regex in a fresh Web Worker and terminates it after `timeoutMs`,
 * so catastrophic backtracking can't hang the page. Never evaluates on the
 * main thread: if no worker can be used, it returns an error instead.
 */
export function runRegex(
  pattern: string,
  flags: string,
  input: string,
  { timeoutMs = REGEX_TIMEOUT_MS, createWorker }: RunOptions = {},
): Promise<RegexTestResult> {
  const factory = createWorker === undefined ? (typeof Worker === "undefined" ? null : createRegexWorker) : createWorker;
  const unavailable: RegexTestResult = { ok: false, error: REGEX_WORKER_UNAVAILABLE_MESSAGE };
  if (!factory) return Promise.resolve(unavailable);

  return new Promise((resolve) => {
    let worker: RegexWorkerLike;
    try {
      worker = factory();
    } catch {
      resolve(unavailable);
      return;
    }

    const finish = (result: RegexTestResult) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(result);
    };
    const timer = setTimeout(() => finish({ ok: false, error: REGEX_TIMEOUT_MESSAGE }), timeoutMs);

    worker.onmessage = (event) => finish(event.data);
    worker.onerror = (event) => {
      event.preventDefault?.();
      finish({ ok: false, error: "Regular expression evaluation failed." });
    };
    worker.postMessage({ pattern, flags, input });
  });
}
