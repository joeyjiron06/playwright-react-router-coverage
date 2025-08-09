import MonocartReporter, {
  type MonocartReporterOptions,
} from "monocart-reporter";
// import path from "path";

import { type CoverageReportOptions } from "monocart-reporter";

// const removeLocalhostPrefix = (p: string) => {
//   const prefix = "localhost-5173/";
//   if (p.startsWith(prefix)) {
//     return p.slice(prefix.length);
//   }
//   return p;
// };

export const coverageReportOptions: CoverageReportOptions = {
  // logging: 'debug',
  name: "Playwright React Router Coverage Report",

  entryFilter: {
    "**/node_modules/**": false,
    "**/*.css": false,
    "**/manifest*": false,

    // for client side entries: http://localhost:3000/app/*
    "**/assets/**": true,

    // for server side
    "**/build/server/**": true,
  },

  sourceFilter: {
    // for sources from sourcemap
    "**/node_modules/**": false,
    "**/*.{js,ts,jsx,tsx,mjs,mts}": true,
  },

  // sourcePath: (filePath, info) => {
  //   if (!filePath.includes("/") && info.distFile) {
  //     return removeLocalhostPrefix(
  //       `${path.dirname(info.distFile)}/${filePath}`
  //     );
  //   }
  //   return removeLocalhostPrefix(filePath);
  // },

  reports: ["html", "json", "cobertura"],
};

// @ts-expect-error - they don't export types properly
export default class PlaywrightReporter extends MonocartReporter {
  constructor(options: MonocartReporterOptions) {
    super({
      outputFile: "playwright-react-router-coverage/index.html",
      coverage: coverageReportOptions,
      ...options,
    } satisfies MonocartReporterOptions);
  }
}
