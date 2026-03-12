/**
 * Build script: minifies src/bootstrap-ui-sounds.js to docs/script.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { minify } from 'terser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname);
const srcPath = path.join(root, 'src', 'bootstrap-ui-sounds.js');
const outPath = path.join(root, 'docs', 'script.js');

const code = fs.readFileSync(srcPath, 'utf8');
const result = await minify(code, {
  compress: { passes: 1 },
  mangle: false,
  format: { comments: false }
});

if (result.error) throw result.error;
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, result.code, 'utf8');
console.log('Built docs/script.js');
