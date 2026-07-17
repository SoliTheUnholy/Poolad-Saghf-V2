import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const standaloneRoot = resolve(projectRoot, ".next", "standalone");

async function copyDirectory(source, destination) {
  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  await cp(source, destination, { recursive: true });
}

await copyDirectory(
  resolve(projectRoot, "public"),
  resolve(standaloneRoot, "public"),
);

await copyDirectory(
  resolve(projectRoot, ".next", "static"),
  resolve(standaloneRoot, ".next", "static"),
);

for (const entry of await readdir(standaloneRoot)) {
  if (entry === ".env" || entry.startsWith(".env.")) {
    await rm(resolve(standaloneRoot, entry), { force: true });
  }
}

console.log(`Standalone server prepared at ${standaloneRoot}`);
