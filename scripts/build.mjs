import { Script } from 'node:vm';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const [shell,css,engine,control,legacy,strategy,planning,driver,operations,simulatorUI,driverUI,app]=await Promise.all(['prototype/shell.html','prototype/style.css','src/growth.js','src/control.js','src/legacy/expansion.js','src/strategy.js','src/planning.js','src/driver.js','src/operations.js','prototype/simulator.js','prototype/driver.js','prototype/app.js'].map(p=>readFile(resolve(root,p),'utf8')));
const code=[engine,control,legacy,strategy,planning,driver,operations,app.replace('/* SIMULATOR VIEW */',()=>simulatorUI).replace('/* DRIVER VIEW */',()=>driverUI)].join('\n');
new Script(code,{filename:'rodavolt-generated.js'});
const fragment=`<style>\n${css}\n</style>\n${shell}\n<script>\n${code}\n</script>\n`;
if(fragment.length>1000000) throw new Error('Preview maior que 1 MB.');
await writeFile(resolve(root,'prototype/preview.html'),fragment);
await writeFile(resolve(root,'index.html'),`<!doctype html>\n<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>RODAVOLT · Sua operação em ordem</title><style>body{margin:0;background:#f5f7f8;font-family:system-ui,sans-serif}*{box-sizing:border-box}</style></head><body>\n${fragment}\n</body></html>\n`);
// Optional: publish exactly the same preview to the current chat's writable folder.
const arg=process.argv.indexOf('--inline');
if(arg>=0){const destination=process.argv[arg+1];if(!destination)throw new Error('Falta o caminho --inline');await mkdir(dirname(destination),{recursive:true});await writeFile(destination,fragment);}
console.log('Protótipo e visualização gerados.');
