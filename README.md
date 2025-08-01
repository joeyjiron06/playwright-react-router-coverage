# Playwright React Router Coverage

<div style="display: flex; gap: 1rem; align-items: center;">
  <a href="https://playwright.dev">
  <img height="100" width="100" alt="playwright" src="https://playwright.dev/img/playwright-logo.svg" />
  </a>

  <h2>+</h2>

  <a href="https://reactrouter.com">
  <img height="100" width="200" style="object-fit:contain" alt="react-router" src="https://reactrouter.com/splash/hero-3d-logo.dark.webp" />
  </a>
</div>

```bash
npm install playwright-react-router-coverage
```

This package adds code coverage to your React Router that uses **FRAMEWORK MODE**.
Here is the quick setup steps

playwright.config.ts

```ts
import { defineConfig, devices } from "@playwright/test";

const port = 8123;

export default defineConfig({
  // 1. setup the reporter
  reporter: [["playwright-react-router-coverage"]],

  // 2. global teardown needed for collecting coverage from server
  globalTeardown: "playwright-react-router-coverage/globalTeardown",

  webServer: {
    command: `react-router dev --port ${port} --mode test`,
    port,
    // 3. collect coverage from v8 engine in nodejs
    env: {
      NODE_V8_COVERAGE: ".v8-coverage",
      NODE_OPTIONS: "--inspect=9229",
    },
  },

  // ...other config here
});
```

When writing tests, be sure to import from `playwright-react-router-coverage` since this will keep track of collecting test coverage from the client browser code

example.test.ts

```ts
import { test, expect } from "playwright-react-router-coverage/test";

test("should add", () => {
  expect(2 + 2).toBe(4);
});
```

## Why I made this?

Hi 👋, I'm Joey Jiron. I'm a web developer who is passionate about testing. I made this package because it was sooo difficult to figure out how to get code coverage from a React Router app in framework mode because there is server code and client code involved. The only answer I could find was [this repo](https://github.com/cenfun/remix-with-playwright/tree/main).

This package is inspired by that repo and makes it easy to get code coverage without having to deal with all the config setup that it takes.
