import type { ConstructorParams, LogLine } from "@browserbasehq/stagehand";
import dotenv from "dotenv";

dotenv.config();

const StagehandConfig: ConstructorParams = {
  env: "LOCAL",
  apiKey: process.env.BROWSERBASE_API_KEY /* API key for authentication */,
  projectId: process.env.BROWSERBASE_PROJECT_ID /* Project identifier */,
  debugDom: undefined /* Enable DOM debugging features */,
  headless:
    process.env.DISABLE_HEADLESS === "true"
      ? false
      : true /* Run browser in headless mode */,
  logger: (message: LogLine) =>
    console.log(logLineToString(message)) /* Custom logging function */,
  domSettleTimeoutMs: 30_000 /* Timeout for DOM to settle in milliseconds */,
  browserbaseSessionCreateParams: {
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
  },
  enableCaching: undefined /* Enable caching functionality */,
  browserbaseSessionID:
    undefined /* Session ID for resuming Browserbase sessions */,
  modelName: "gpt-4o" /* Name of the model to use */,
  modelClientOptions: {
    apiKey: process.env.OPENAI_API_KEY,
  } /* Configuration options for the model client */,
  localBrowserLaunchOptions: {
    chromiumSandbox: false,
  },
};

export default StagehandConfig;

/**
 * Custom logging function that you can use to filter logs.
 *
 * General pattern here is that `message` will always be unique with no params
 * Any param you would put in a log is in `auxiliary`.
 *
 * For example, an error log looks like this:
 *
 * ```
 * {
 *   category: "error",
 *   message: "Some specific error occurred",
 *   auxiliary: {
 *     message: { value: "Error message", type: "string" },
 *     trace: { value: "Error trace", type: "string" }
 *   }
 * }
 * ```
 *
 * You can then use `logLineToString` to filter for a specific log pattern like
 *
 * ```
 * if (logLine.message === "Some specific error occurred") {
 *   console.log(logLineToString(logLine));
 * }
 * ```
 */
export function logLineToString(logLine: LogLine): string {
  // If you want more detail, set this to false. However, this will make the logs
  // more verbose and harder to read.
  const HIDE_AUXILIARY = true;

  try {
    const timestamp = logLine.timestamp || new Date().toISOString();
    if (logLine.auxiliary?.error) {
      return `${timestamp}::[stagehand:${logLine.category}] ${logLine.message}\n ${logLine.auxiliary.error.value}\n ${logLine.auxiliary.trace.value}`;
    }

    // If we want to hide auxiliary information, we don't add it to the log
    return `${timestamp}::[stagehand:${logLine.category}] ${logLine.message} ${
      logLine.auxiliary && !HIDE_AUXILIARY
        ? JSON.stringify(logLine.auxiliary)
        : ""
    }`;
  } catch (error) {
    console.error(`Error logging line:`, error);
    return "error logging line";
  }
}
