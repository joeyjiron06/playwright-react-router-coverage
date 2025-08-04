# Playwright React Router Coverage

<div style="display: flex; gap: 1rem; align-items: center;">
<a href="https://playwright.dev" style="display: inline-block">
<img height="100" width="100" alt="playwright" style="display: inline-block" src="https://playwright.dev/img/playwright-logo.svg" />
</a><span style="font-size: 2rem">+</span><a href="https://reactrouter.com" style="display: inline-block">
<img height="100" width="200" style="object-fit:contain; display: inline-block" alt="react-router" src="https://reactrouter.com/splash/hero-3d-logo.dark.webp" />
</a>
</div>

```bash
npx jsr add @lazybear/playwright-react-router-coverage
```

This package adds code coverage to your React Router that uses **FRAMEWORK MODE**.
Here is the quick setup steps

playwright.config.ts

```ts
import { defineConfig, devices } from "@playwright/test";

const port = 8123;

export default defineConfig({
  // 1. setup the reporter
  reporter: [["@lazybear/playwright-react-router-coverage"]],

  // 2. global teardown needed for collecting coverage from server
  globalTeardown: "@lazybear/playwright-react-router-coverage/globalTeardown",

  webServer: {
    command: `rimraf .v8-coverage && \
    react-router build --mode test --minify=false --sourcemapClient=true --sourcemapServer=true && \

    cross-env NODE_V8_COVERAGE=.v8-coverage NODE_OPTIONS=--inspect=9229 react-router-serve ./build/server/index.js
    `,
    port,
    // 3. collect coverage from v8 engine in nodejs
    env: {
      PORT: String(port),
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

## Publishing

run

```bash
npx jsr publish
```
