// strip-types.mjs
// Uso: node strip-types.mjs <carpeta>
// Convierte recursivamente todos los .tsx/.ts dentro de <carpeta> a .jsx/.js,
// eliminando anotaciones de TypeScript (interfaces, tipos, genéricos, "as", etc.)
// y borra el archivo .tsx/.ts original.

import fs from "fs";
import path from "path";
import * as babel from "@babel/core";

const target = process.argv[2];
if (!target) {
  console.error("Uso: node strip-types.mjs <carpeta>");
  process.exit(1);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (/\.(tsx|ts)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) {
      convert(full);
    }
  }
}

function convert(filePath) {
  const isTsx = filePath.endsWith(".tsx");
  const code = fs.readFileSync(filePath, "utf8");

  const result = babel.transformSync(code, {
    filename: filePath,
    presets: [
      ["@babel/preset-typescript", {}],
    ],
    retainLines: false,
    configFile: false,
    babelrc: false,
    generatorOpts: { retainLines: false, jsescOption: { minimal: true } },
  });

  let output = result.code;
  // @babel/preset-typescript solo elimina tipos, no reformatea JSX de forma agresiva,
  // así que el resultado conserva un formato razonablemente cercano al original.

  const newPath = filePath.replace(/\.tsx$/, ".jsx").replace(/\.ts$/, ".js");
  fs.writeFileSync(newPath, output, "utf8");
  fs.unlinkSync(filePath);
  console.log(`✔ ${filePath} -> ${newPath}`);
}

walk(target);
console.log("Listo.");
