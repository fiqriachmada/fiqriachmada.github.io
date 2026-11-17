import { createRequire } from "node:module";
import { defineConfig, globalIgnores } from "eslint/config";

const require = createRequire(import.meta.url);
const tsPath = require.resolve("typescript");
require.cache[tsPath] = {
  id: tsPath,
  filename: tsPath,
  loaded: true,
  exports: require("@typescript/typescript6"),
};

const { default: nextVitals } = await import("eslint-config-next/core-web-vitals");
const { default: nextTs } = await import("eslint-config-next/typescript");

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Pre-existing patterns carried over from the JS codebase; downgraded to
    // warnings so the TypeScript migration stays behavior-preserving.
    rules: {
      "react/no-unescaped-entities": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/error-boundaries": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", ".agents/**"]),
]);

export default eslintConfig;
