import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("src");
const banned = [
  ["\u2014", "em dash"],
  ["\u2013", "en dash"],
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(astro|md|mdx|json|ts|css|mjs)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const hits = [];
for (const file of await walk(root)) {
  const text = await readFile(file, "utf8");
  for (const [char, name] of banned) {
    let from = 0;
    while (from < text.length) {
      const index = text.indexOf(char, from);
      if (index === -1) break;
      const line = text.slice(0, index).split("\n").length;
      hits.push(`${path.relative(".", file)}:${line} contains an ${name}`);
      from = index + 1;
    }
  }
}

const brandingFiles = [
  "src/components/Header.astro",
  "src/components/Footer.astro",
  "src/components/BaseLayout.astro",
  "src/pages/index.astro",
  "src/pages/about.astro",
  "public/logo.svg",
  "public/favicon.svg",
];
for (const file of brandingFiles) {
  const text = await readFile(path.resolve(file), "utf8");
  if (/\bAggie(land)?\b/i.test(text)) {
    hits.push(`${file} uses Aggie or Aggieland in branding`);
  }
}

if (hits.length) {
  console.error(hits.join("\n"));
  process.exit(1);
}

console.log("Copy check passed.");
