// Runs regex evaluation off the main thread so a catastrophically backtracking
// pattern can be stopped (by terminating this worker) without freezing the tab.
import { testRegex, type RegexTestResult } from "./regex";
import type { RegexWorkerRequest } from "./regex-runner";

self.onmessage = (event: MessageEvent<RegexWorkerRequest>) => {
  const { pattern, flags, input } = event.data;
  let result: RegexTestResult;
  try {
    result = testRegex(pattern, flags, input);
  } catch (err) {
    result = { ok: false, error: err instanceof Error ? err.message : "Regular expression evaluation failed." };
  }
  self.postMessage(result);
};
