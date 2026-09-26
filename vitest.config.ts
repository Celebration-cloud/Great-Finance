import { defineConfig } from "vitest/config";
export default defineConfig({
  resolve: {
    alias: {
      "@": import.meta.dirname,
      "server-only": `${import.meta.dirname}/tests/server-only.ts`,
    },
  },
  test: {
    environment: "node",
    coverage: { provider: "v8", reporter: ["text", "json", "html"] },
  },
});
