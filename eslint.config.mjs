import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([".kilo/**", ".next/**", "dist/**", "src/**", ".history/**", "generated/**", "output/**", "playwright-report/**", "test-results/**"]),
]);
