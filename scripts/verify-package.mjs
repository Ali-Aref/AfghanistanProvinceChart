/**
 * Verifies the publishable tarball in isolated consumer applications.
 *
 * Run with: pnpm verify:package
 *
 * Creates temporary Vite + React applications for React 18 and React 19,
 * installs the packed tarball, type-checks, builds and server-renders the
 * components. Nothing in the monorepo is modified.
 */
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const workspace = await mkdtemp(join(tmpdir(), "afghan-charts-verify-"));
const artifacts = join(workspace, "artifacts");

function run(command, args, cwd, extraEnv = {}) {
  console.log(`\n$ ${command} ${args.join(" ")}`);
  execFileSync(command, args, {
    cwd,
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function findTarball() {
  const files = await readdir(artifacts);
  const tarball = files.find((file) => file.endsWith(".tgz"));
  assert(tarball, "pnpm pack did not produce a tarball.");
  return join(artifacts, tarball);
}

const APP_SOURCE = `import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AfghanistanChoropleth,
  AfghanistanMap,
  getProvinceName,
  type ProvinceCode,
} from "@afghan-charts/react";
import "@afghan-charts/react/styles.css";
import "./styles.css";

const data = {
  "AF-KAB": 96,
  "AF-HER": 0,
  "AF-BAL": null,
};

function App() {
  const [selected, setSelected] = useState<ProvinceCode | null>("AF-KAB");

  return (
    <main>
      <AfghanistanMap
        locale="prs"
        selectedProvince={selected}
        onSelectionChange={setSelected}
        height={320}
        colors={{ selectedFill: "#0f766e" }}
      />
      <AfghanistanChoropleth data={data} showLegend locale="ps" />
      <p>{getProvinceName("AF-KAB", "ps")}</p>
    </main>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`;

const SSR_SOURCE = `import { createElement } from "react";
import { renderToString } from "react-dom/server";
import {
  AfghanistanChoropleth,
  AfghanistanMap,
} from "@afghan-charts/react";

const map = renderToString(
  createElement(AfghanistanMap, { locale: "ps", showTooltip: false }),
);
const choropleth = renderToString(
  createElement(AfghanistanChoropleth, {
    data: { "AF-KAB": 1, "AF-HER": 0 },
    showLegend: true,
  }),
);

if (!map.includes("data-province-code")) throw new Error("SSR map produced no provinces.");
if (!choropleth.includes("af-legend")) throw new Error("SSR choropleth produced no legend.");
if (!map.includes("کابل")) throw new Error("SSR Pashto name was not rendered.");

console.log("✔ SSR rendered map and choropleth:", map.length, choropleth.length);
`;

async function verifyReact(major, tarball) {
  const directory = join(workspace, `react-${major}`);
  await mkdir(join(directory, "src"), { recursive: true });

  const reactVersion = major === "18" ? "18.3.1" : "19.3.1";
  const typesVersion = major === "18" ? "^18.3.0" : "^19.3.0";

  await writeFile(
    join(directory, "package.json"),
    JSON.stringify(
      {
        name: `verify-afghan-charts-react-${major}`,
        private: true,
        type: "module",
        scripts: {
          build: "tsc --noEmit && vite build",
          ssr: "node ssr.mjs",
        },
        dependencies: {
          "@afghan-charts/react": `file:${tarball}`,
          react: reactVersion,
          "react-dom": reactVersion,
        },
        devDependencies: {
          "@types/react": typesVersion,
          "@types/react-dom": typesVersion,
          "@vitejs/plugin-react": "6.3.0",
          typescript: "5.9.3",
          vite: "8.3.8",
        },
      },
      null,
      2,
    ),
  );

  await writeFile(
    join(directory, "pnpm-workspace.yaml"),
    'packages:\n  - "."\n\nallowBuilds:\n  esbuild: true\n',
  );
  await writeFile(join(directory, ".npmrc"), "engine-strict=false\n");

  await writeFile(
    join(directory, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          lib: ["ES2022", "DOM", "DOM.Iterable"],
          module: "ESNext",
          moduleResolution: "Bundler",
          jsx: "react-jsx",
          strict: true,
          noEmit: true,
          skipLibCheck: true,
        },
        include: ["src", "vite.config.ts"],
      },
      null,
      2,
    ),
  );

  await writeFile(
    join(directory, "vite.config.ts"),
    `import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({ plugins: [react()], build: { outDir: "dist" } });
`,
  );

  await writeFile(
    join(directory, "index.html"),
    `<!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n`,
  );

  await writeFile(join(directory, "src/main.tsx"), APP_SOURCE);
  await writeFile(
    join(directory, "src/styles.css"),
    "body { margin: 0; font-family: system-ui, sans-serif; }\n",
  );
  await writeFile(join(directory, "ssr.mjs"), SSR_SOURCE);

  run("pnpm", ["install", "--prefer-offline", "--no-frozen-lockfile"], directory);
  run("pnpm", ["run", "build"], directory);
  run("pnpm", ["run", "ssr"], directory);

  const bundleFiles = await readdir(join(directory, "dist/assets"));
  const jsFile = bundleFiles.find((file) => file.endsWith(".js"));
  const cssFile = bundleFiles.find((file) => file.endsWith(".css"));
  assert(jsFile, "Vite build produced no JavaScript.");
  assert(cssFile, "Vite build produced no CSS.");

  const js = await readFile(join(directory, "dist/assets", jsFile), "utf8");
  const css = await readFile(join(directory, "dist/assets", cssFile), "utf8");
  assert(js.includes("AF-KAB"), "Bundle does not contain province identifiers.");
  assert(css.includes("--af-map-fill"), "Bundle does not contain map styles.");
  assert(js.includes("data-province-code"), "Bundle does not contain map markup.");

  console.log(`✔ React ${major} consumer built and rendered successfully.`);
}

async function main() {
  await mkdir(artifacts, { recursive: true });

  run(
    "pnpm",
    ["--filter", "@afghan-charts/react", "pack", "--pack-destination", artifacts],
    root,
  );

  const tarball = await findTarball();
  const listing = execFileSync("tar", ["-tzf", tarball], { encoding: "utf8" });
  const required = [
    "package/dist/index.js",
    "package/dist/index.d.ts",
    "package/dist/styles.css",
    "package/package.json",
    "package/README.md",
    "package/LICENSE",
    "package/DATA_LICENSE.md",
  ];
  for (const entry of required) {
    assert(listing.includes(entry), `Tarball is missing ${entry}.`);
  }
  assert(!listing.includes("package/src/"), "Tarball must not contain source files.");
  assert(!listing.includes("package/tests/"), "Tarball must not contain tests.");
  assert(!listing.includes("data/source/"), "Tarball must not contain source data.");

  const declarations = execFileSync("tar", ["-xOf", tarball, "package/dist/index.d.ts"], {
    encoding: "utf8",
  });
  assert(
    !declarations.includes(".css"),
    "dist/index.d.ts must not import the extracted stylesheet.",
  );

  console.log(`\n✔ Tarball contents verified: ${tarball}`);

  await verifyReact("18", tarball);
  await verifyReact("19", tarball);

  console.log(`\n✔ Package verified in isolated React 18 and React 19 applications.`);
  console.log(`  Temporary workspace: ${workspace}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
