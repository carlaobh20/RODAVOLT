import '../src/legal-pack.js';
import '../src/legal-guide.js';
import '../src/legal-documents.js';
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
const library=globalThis.RodavoltLegalDocuments;
const fillable=resolve(output,'preenchiveis');
await mkdir(fillable,{recursive:true});
for(const doc of library.docs){
 const rendered=library.render(doc.id);
 const fields=library.fieldsFor(doc.id).map(f=>'- **'+f.label+'**'+(f.help?': '+f.help:'.')).join('\n');
 const source='# '+doc.title+'\n\n> Modelo '+doc.version+' para revisão profissional. Dados privados e condições reais não estão preenchidos.\n\n'+(doc.notice?'> '+doc.notice+'\n\n':'')+rendered.body+'\n## Campos de preenchimento\n\n'+fields+'\n\n## Referências oficiais\n\n'+doc.sources.map(key=>{const ref=globalThis.RodavoltLegalGuide.sources[key];if(!ref)throw Error('Fonte ausente: '+key);return '- ['+ref.name+']('+ref.url+')';}).join('\n')+'\n';
 await writeFile(resolve(fillable,doc.id+'.md'),source);
}
await writeFile(resolve(fillable,'PACOTE-COMPLETO.html'),library.exportHtml(library.docs.map(d=>d.id)));
await writeFile(resolve(fillable,'PACOTE-COMPLETO.txt'),library.exportText(library.docs.map(d=>d.id)));
await writeFile(resolve(fillable,'README.md'),'# Biblioteca preenchível RODAVOLT\n\n'+library.docs.length+' modelos e formulários, versão '+library.version+'. Minutas para revisão profissional.\n\nAbra **Meu advogado → Preparar um documento** para preencher os campos e gerar TXT ou HTML imprimível em PDF. A opção **Pacote de entrada** reúne '+library.entryIds.length+' modelos. A base reutilizável não inclui motorista, ocorrência, terceiro ou assinatura. Os campos são temporários; salve o arquivo em local privado antes de fechar a aba.\n\nSeguro e crédito usam formulários de solicitação/conferência: a apólice e o contrato de financiamento devem vir dos fornecedores. Recibos só comprovam fatos efetivamente confirmados. Documentos gerados não alteram contratos operacionais nem registram aprovação/assinatura.\n\n'+library.docs.map(d=>'- Tipo '+d.guide+': ['+d.title+']('+d.id+'.md)').join('\n')+'\n');
console.log('Acervo preservado, roteiro e '+library.docs.length+' modelos preenchíveis exportados.');
