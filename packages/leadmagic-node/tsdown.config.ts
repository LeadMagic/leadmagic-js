import { readFileSync } from "node:fs";
import { defineConfig } from "tsdown";

const { version } = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8")
);

export default defineConfig({
  define: { __LEADMAGIC_VERSION__: JSON.stringify(version) },
  entry: {
    index: "src/index.ts",
    "zod/index": "src/zod/index.ts",
  },
  format: "esm",
  platform: "neutral",
  target: "es2022",
  fixedExtension: false,
  dts: true,
  clean: true,
  sourcemap: false,
  deps: { neverBundle: ["zod"] },
});
