// Builds public/r/<item>.json from registry.json, the format `npx shadcn add <url>` reads.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"));
const outDir = join(root, "public", "r");
mkdirSync(outDir, { recursive: true });

const REGISTRY_DIR = /^registry\//u;

for (const item of registry.items) {
  const built = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    ...item,
    files: item.files.map((file) => ({
      ...file,
      path: file.path.replace(REGISTRY_DIR, "components/"),
      content: readFileSync(join(root, file.path), "utf8"),
    })),
  };
  writeFileSync(
    join(outDir, `${item.name}.json`),
    `${JSON.stringify(built, null, 2)}\n`
  );
  console.log(`public/r/${item.name}.json`);
}

// The example app uses the field the way a customer would after `shadcn add`:
// as its own copy. Keep that copy identical to the registry source.
const exampleCopy = join(
  root,
  "examples",
  "next-signup",
  "components",
  "email-field.tsx"
);
const source = readFileSync(join(root, "registry", "email-field.tsx"), "utf8");
if (process.argv.includes("--check")) {
  if (readFileSync(exampleCopy, "utf8") !== source) {
    console.error(
      "examples/next-signup/components/email-field.tsx differs from registry/email-field.tsx. Run pnpm registry:build."
    );
    process.exit(1);
  }
} else {
  writeFileSync(exampleCopy, source);
  console.log("examples/next-signup/components/email-field.tsx");
}
