import path from "path";
import { rimraf } from "rimraf";
import { execSync } from "child_process";

async function main() {
  const cwd = process.cwd();

  await rimraf(path.join(cwd, ".v8-coverage"));

  await execSync(
    "npx react-router build --mode test --minify=false --sourcemapClient=true --sourcemapServer=true",
    {
      stdio: "pipe",
    }
  );

  await execSync("npx react-router-serve ./build/server/index.js", {
    stdio: "pipe",
    env: {
      PORT: process.env.PORT,
      NODE_V8_COVERAGE: ".v8-coverage",
      NODE_OPTIONS: "--inspect=9229",
    },
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
