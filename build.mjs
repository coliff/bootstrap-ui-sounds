/**
 * Build script: syncs package version into the js banner and minifies
 * js/bootstrap-ui-sounds.js into js/bootstrap-ui-sounds.min.js.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { minify } from "terser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname);
const pkgPath = path.join(root, "package.json");
const { version } = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const banner = `/*!
 * Bootstrap UI Sounds v${version}
 * Copyright 2026 C.Oliff
 * Licensed under MIT
 * https://github.com/coliff/bootstrap-ui-sounds
 */
`;
const srcPath = path.join(root, "js", "bootstrap-ui-sounds.js");
const minPath = path.join(path.dirname(srcPath), "bootstrap-ui-sounds.min.js");
let code = fs.readFileSync(srcPath, "utf8");
code = code.replace(
  /^(\s*\*\s*Bootstrap UI Sounds)(?:\s+v[\d.]+)?(\s*)$/m,
  `$1 v${version}$2`,
);
fs.writeFileSync(srcPath, code, "utf8");
const result = await minify(code, {
  compress: { passes: 1 },
  mangle: false,
  format: { comments: false },
});

if (result.error) {
  throw result.error;
}
const minified = banner + result.code;
fs.mkdirSync(path.dirname(minPath), { recursive: true });
fs.writeFileSync(minPath, minified, "utf8");
console.log(
  `Updated ${path.relative(root, srcPath)}; built ${path.relative(root, minPath)}`,
);
