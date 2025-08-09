import { CDPClient } from "monocart-coverage-reports";
import MonocartReporter, { addCoverageReport } from "monocart-reporter";
import type { PlaywrightTestConfig, TestInfo } from "playwright/test";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

/**
 * Global teardown for Playwright tests.
 * This writes the V8 coverage data to the specified directory
 * for the server side code.
 */
export default async function globalTeardown(config: PlaywrightTestConfig) {
  const client = await CDPClient({
    port: 9229,
  });

  if (!client) {
    console.log("Failed to connect to the server port 9229");
    return;
  }

  const dir = await client.writeCoverage();
  await client.close();

  if (!fs.existsSync(dir)) {
    console.log("NODE_V8_COVERAGE directory does not exist", dir);
    return;
  }

  const files = fs.readdirSync(dir);
  for (const filename of files) {
    const content = fs
      .readFileSync(path.resolve(dir, filename))
      .toString("utf-8");
    const json = JSON.parse(content);

    let coverageList: Array<{ url: string; source: string }> = json.result;

    coverageList = coverageList.filter(
      (entry) => entry.url && !entry.url.includes("node_modules")
    );
    coverageList = coverageList.filter(
      (entry) => !entry.url.startsWith("node:")
    );
    coverageList = coverageList.filter((entry) =>
      entry.url.includes("build/server")
    );

    if (!coverageList.length) {
      continue;
    }

    // attach source content
    coverageList.forEach((entry) => {
      const filePath = fileURLToPath(entry.url);
      if (fs.existsSync(filePath)) {
        entry.source = fs.readFileSync(filePath).toString("utf8");
      } else {
        console.log("could not locate source content for entry", filePath);
      }
    });

    const coverageReportOptions = Array.isArray(config.reporter)
      ? config.reporter.find((reporterConfig) => {
          if (Array.isArray(reporterConfig)) {
            return reporterConfig[0].includes(
              "playwright-react-router-coverage"
            );
          }
        })
      : undefined;

    if (coverageReportOptions) {
      // @ts-expect-error - they don't export types properly
      MonocartReporter.Util.reporterOptions = coverageReportOptions[1];
    }

    const mockTestInfo = {
      config,
    } as TestInfo;
    await addCoverageReport(coverageList, mockTestInfo);
  }
}
