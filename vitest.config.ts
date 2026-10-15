import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
    // The statistical and content-sweep tests roll thousands of characters,
    // which can pass the 5 s default on a busy CI machine with coverage on.
    testTimeout: 30_000,
    coverage: {
      provider: "v8",
      include: ["src/engine/**/*.ts"],
      reporter: ["text-summary", "html"],
      thresholds: { lines: 90, functions: 90, branches: 80, statements: 90 },
    },
  },
});
