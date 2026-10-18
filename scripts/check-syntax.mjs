import {readdir,readFile} from 'node:fs/promises';
import {Script} from 'node:vm';
for(const dir of ['src','prototype'])for(const file of await readdir(dir))if(file.endsWith('.js'))new Script(await readFile(dir+'/'+file,'utf8'),{filename:dir+'/'+file});
new Script(await readFile('src/legacy/expansion.js','utf8'));
console.log('Sintaxe das fontes conferida.');
