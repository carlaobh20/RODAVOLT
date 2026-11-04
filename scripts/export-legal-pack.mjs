import '../src/legal-pack.js';
import '../src/legal-guide.js';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const output=resolve(root,'docs/contratos');
await mkdir(output,{recursive:true});
for(const [id,model] of Object.entries(globalThis.RodavoltLegalPack.models)){
 const source=`# ${model.name}\n\n> Minuta para revisão profissional. Preencher dados reais somente em ambiente privado. Não assinar esta versão antes de concluir a revisão comercial e jurídica.\n\n${model.body.trimEnd()}\n`;
 await writeFile(resolve(output,id+'.md'),source);
}
await writeFile(resolve(root,'docs/MAPA-DOCUMENTOS-JURIDICOS.md'),'# RODAVOLT · roteiro de documentos para revisão profissional\n\n'+globalThis.RodavoltLegalGuide.text()+'\n');
console.log('Cinco minutas e roteiro numerado de documentos gerados em docs/.');
