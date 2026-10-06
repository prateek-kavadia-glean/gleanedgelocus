import { copyFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const baseUrl = "/gleanedgelocus/";
const indexPath = fileURLToPath(new URL("../dist/index.html", import.meta.url));
const fallbackPath = fileURLToPath(new URL("../dist/404.html", import.meta.url));
const html = await readFile(indexPath, "utf8");
const requiredReferences = [
  `src="${baseUrl}assets/`,
  `href="${baseUrl}assets/`,
  `href="${baseUrl}favicon.svg"`,
  `content="${baseUrl}og.png"`,
];
const missingReferences = requiredReferences.filter(
  (reference) => !html.includes(reference),
);

if (missingReferences.length) {
  throw new Error(
    `GitHub Pages HTML is missing project-base references: ${missingReferences.join(", ")}`,
  );
}

if (html.includes('src="/src/main.jsx"')) {
  throw new Error("GitHub Pages output still points at Vite source files.");
}

await copyFile(indexPath, fallbackPath);
console.log("GitHub Pages base paths verified; dist/404.html fallback created.");
