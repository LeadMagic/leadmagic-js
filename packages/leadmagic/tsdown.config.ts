import { readFileSync } from "node:fs";
import { defineConfig } from "tsdown";

const { version } = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8")
);

export default defineConfig({
  define: { __LEADMAGIC_VERSION__: JSON.stringify(version) },
  entry: {
    index: "src/index.ts",
    "next/index": "src/next/index.ts",
    "react/index": "src/react/index.ts",
  },
  format: "esm",
  platform: "neutral",
  target: "es2022",
  fixedExtension: false,
  dts: true,
  clean: true,
  sourcemap: false,
  deps: { neverBundle: ["react"] },
  // The hook must stay a client module when imported from a Server Component tree.
  banner: ({ fileName }) =>
    fileName.startsWith("react/") ? { js: '"use client";' } : undefined,
});
