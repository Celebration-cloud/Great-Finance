import { spawn } from "node:child_process";

const host = "127.0.0.1";
const port = 3100;
const baseUrl = `http://${host}:${port}`;
const nextCli = "node_modules/next/dist/bin/next";
const playwrightCli = "node_modules/@playwright/test/cli.js";

async function waitForServer(server, timeoutMs = 120_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Next.js exited before becoming ready (code ${server.exitCode}).`);
    try {
      const response = await fetch(baseUrl, { signal: AbortSignal.timeout(2_000) });
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Next.js did not become ready at ${baseUrl}.`);
}

async function stopServer(server) {
  if (server.exitCode !== null) return;
  server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 3_000)),
  ]);
  if (server.exitCode === null) server.kill("SIGKILL");
}

const server = spawn(process.execPath, [nextCli, "start", "--hostname", host, "--port", String(port)], {
  cwd: process.cwd(),
  env: process.env,
  stdio: "ignore",
});

let exitCode = 1;
try {
  await waitForServer(server);
  exitCode = await new Promise((resolve, reject) => {
    const runner = spawn(process.execPath, [playwrightCli, "test", ...process.argv.slice(2)], {
      cwd: process.cwd(),
      env: { ...process.env, PLAYWRIGHT_BASE_URL: baseUrl },
      stdio: "inherit",
    });
    runner.once("error", reject);
    runner.once("exit", (code) => resolve(code ?? 1));
  });
} finally {
  await stopServer(server);
}

process.exitCode = exitCode;
