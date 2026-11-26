// Turns spec/openapi.json (a copy of the public API reference) into wire
// types. `--check` fails when the committed file is out of date.
import { readFileSync, writeFileSync } from "node:fs";
import openapiTS, { astToString } from "openapi-typescript";

const specUrl = new URL("../spec/openapi.json", import.meta.url);
const outUrl = new URL("../src/generated/api.ts", import.meta.url);

const spec = JSON.parse(readFileSync(specUrl, "utf8"));
const ast = await openapiTS(spec, { alphabetize: false });
const header = `// Generated from spec/openapi.json (LeadMagic API ${spec.info.version}) by scripts/generate.mjs.\n// Do not edit. Run \`pnpm -F leadmagic-node generate\` after updating the spec.\n\n`;
const output = header + astToString(ast);

if (process.argv.includes("--check")) {
  let current = "";
  try {
    current = readFileSync(outUrl, "utf8");
  } catch {
    // Missing counts as out of date.
  }
  if (current !== output) {
    console.error(
      "src/generated/api.ts is out of date. Run `pnpm -F leadmagic-node generate`."
    );
    process.exit(1);
  }
  console.log("src/generated/api.ts is up to date.");
} else {
  writeFileSync(outUrl, output);
  console.log(`Wrote src/generated/api.ts from API ${spec.info.version}.`);
}
