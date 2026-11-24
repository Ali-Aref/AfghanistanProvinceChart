/**
 * Removes side-effect CSS imports from generated declaration files.
 *
 * Vite extracts the stylesheet to dist/styles.css, but tsc preserves the
 * `import "./styles/map.css"` line in index.d.ts, which would point at a file
 * that is not shipped. Consumers import the stylesheet explicitly, so the
 * declaration-time import is noise.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, process.argv[2] ?? "packages/react/dist");

async function* walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.isFile() && entry.name.endsWith(".d.ts")) yield path;
  }
}

let changed = 0;
for await (const file of walk(dist)) {
  const contents = await readFile(file, "utf8");
  const next = contents.replace(/^import\s+["'][^"']+\.css["'];\r?\n/gm, "");
  if (next !== contents) {
    await writeFile(file, next, "utf8");
    changed += 1;
  }
}

console.log(`✔ Cleaned CSS imports from ${changed} declaration file(s).`);
