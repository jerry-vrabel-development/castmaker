import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
    coverage: {
      provider: "v8",
      include: ["src/engine/**/*.ts"],
      reporter: ["text-summary", "html"],
      thresholds: { lines: 90, functions: 90, branches: 80, statements: 90 },
    },
  },
});
