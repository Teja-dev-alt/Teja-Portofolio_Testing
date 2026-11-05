import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const required = ['index.html','Asset/dist/app.js','Asset/dist/app.css','Asset/img/teja-portrait.png','Asset/img/favicon.svg','src/data/projects.json','src/data/brands.json'];
const missing = required.filter(file => !existsSync(join(process.cwd(),file)));
for (const file of ['src/data/projects.json','src/data/brands.json']) JSON.parse(readFileSync(file,'utf8'));
if (missing.length) { console.error('Missing files:', missing.join(', ')); process.exit(1); }
console.log('Portfolio files and JSON data are ready.');
