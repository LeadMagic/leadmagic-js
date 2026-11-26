import { defineConfig } from "vitest/config";

export default defineConfig({
  define: { __LEADMAGIC_VERSION__: JSON.stringify("0.0.0-test") },
  test: {
    include: ["test/**/*.test.{ts,tsx}"],
    exclude: [
      ...(process.env.LEADMAGIC_CONTRACT ? [] : ["test/contract.test.ts"]),
      ...(process.env.LEADMAGIC_LIVE ? [] : ["test/live.test.ts"]),
    ],
  },
});
