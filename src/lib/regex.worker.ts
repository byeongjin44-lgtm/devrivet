// Runs regex evaluation off the main thread so a catastrophically backtracking
// pattern can be stopped (by terminating this worker) without freezing the tab.
import { testRegex, type RegexTestResult } from "./regex";
import type { RegexWorkerRequest, RegexWorkerResponse } from "./regex-runner";

const reply = (message: RegexWorkerResponse) => self.postMessage(message);

self.onmessage = (event: MessageEvent<RegexWorkerRequest>) => {
  const { pattern, flags, input } = event.data;
  let result: RegexTestResult;
  try {
    result = testRegex(pattern, flags, input);
  } catch (err) {
    result = { ok: false, error: err instanceof Error ? err.message : "Regular expression evaluation failed." };
  }
  reply({ type: "result", result });
};

// Loaded and listening: the runner starts the run timeout only after this, so
// download/startup time on a cold cache never counts against the pattern.
reply({ type: "ready" });
