import { readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const outputDirectory = fileURLToPath(new URL("../dist/", import.meta.url));
const maxAssetBytes = 25 * 1024 * 1024;

async function findOversizedAssets(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const results = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return findOversizedAssets(path);

      const { size } = await stat(path);
      return size > maxAssetBytes ? [{ path, size }] : [];
    }),
  );
  return results.flat();
}

const oversizedAssets = await findOversizedAssets(outputDirectory);

if (oversizedAssets.length) {
  console.error("Cloudflare Pages only supports files up to 25 MiB:");
  for (const { path, size } of oversizedAssets) {
    console.error(
      `  ${relative(outputDirectory, path)}: ${(size / 1024 / 1024).toFixed(2)} MiB`,
    );
  }
  console.error("Compress oversized assets before deploying.");
  process.exitCode = 1;
} else {
  console.log("Cloudflare Pages asset size check passed (25 MiB per file).");
}
