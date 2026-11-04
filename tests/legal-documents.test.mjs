import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import '../src/legal-documents.js';
import '../src/legal-guide.js';
import '../src/growth.js';
import '../src/control.js';
import '../src/driver.js';
import '../src/operations.js';
import '../src/legal-pack.js';
import '../src/coordination.js';
const D=globalThis.RodavoltLegalDocuments,G=globalThis.RodavoltLegalGuide,K=globalThis.RodavoltCoordination;
const all=D.docs.map(d=>d.id);
function filled(input=all){return Object.fromEntries(D.fieldsFor(input).map(f=>[f.key,f.type==='money'?'1.234,50':f.type==='date'?(f.key==='FIM'?'2027-12-31':'2027-01-25'):f.type==='select'?f.options[0]:'EXEMPLO SINTÉTICO — '+f.label]));}

test('all 16 guide categories lead to substantive fillable documents with official references',()=>{
 assert.equal(D.docs.length,22);
 assert.equal(G.items.length,16);
 assert.equal(new Set(all).size,all.length);
 for(const item of G.items){
  assert.ok(item.documentIds.length>0);
  for(const id of item.documentIds)assert.equal(D.get(id).guide,item.number);
 }
 for(const doc of D.docs){
  assert.ok(doc.body.length>1400,doc.id+' needs substantive text');
  assert.ok(G.items.some(i=>i.documentIds.includes(doc.id)),doc.id+' is unreachable');
  for(const ref of doc.sources)assert.ok(G.sources[ref]?.url.startsWith('https://'),ref);
  const blank=D.render(doc.id);
  assert.equal(blank.complete,false);
  assert.deepEqual([...blank.missing].sort(),D.keys(doc.id).sort());
  assert.match(blank.body,/PREENCHER:/);
  assert.doesNotMatch(blank.body,/\{\{/);
 }
});

test('filled documents replace all fields, format BRL/dates and remain review drafts',()=>{
 const values=filled();
 for(const result of D.bundle(all,values)){
  assert.equal(result.missing.length,0,result.id);
  assert.equal(result.complete,true);
  assert.match(result.body,/MINUTA PARA REVISÃO PROFISSIONAL/);
  assert.doesNotMatch(result.body,/PREENCHER:|\{\{/);
 }
 const rent=D.render('rental',values).body;
 assert.match(rent,/R\$ 1\.234,50/);
 assert.match(rent,/25\/01\/2027 a 31\/12\/2027/);
 assert.match(rent,/semana vencida/);
 assert.match(rent,/recargas.*pagas pelo motorista/);
 assert.match(D.render('kit',values).body,/100% da margem comercial/);
 assert.match(D.get('insurance_request').notice,/seguradora emite/);
 assert.match(D.get('financing_review').notice,/obtido da instituição/);
});

test('reusable base strips the driver, event, counterpart and signing data',()=>{
 const values=filled();
 values.MOTORISTA='MOTORISTA SINTÉTICO UM';
 values.OCORRENCIA='OCORRÊNCIA PRIVADA SINTÉTICA';
 const base=D.exportBase(values),loaded=D.importBase(JSON.parse(JSON.stringify(base)));
 assert.equal(loaded.EMPRESA,values.EMPRESA);
 assert.equal(loaded.CARRO,values.CARRO);
 for(const f of Object.values(D.fields)){
  if(!D.reusableGroups.includes(f.group))assert.ok(!Object.hasOwn(loaded,f.key),f.key+' leaked into base');
 }
 assert.doesNotMatch(JSON.stringify(base),/MOTORISTA SINTÉTICO UM|OCORRÊNCIA PRIVADA/);
 const second=D.render('rental',{...loaded,MOTORISTA:'MOTORISTA SINTÉTICO DOIS'});
 assert.match(second.body,/MOTORISTA SINTÉTICO DOIS/);
 assert.doesNotMatch(second.body,/MOTORISTA SINTÉTICO UM/);
 assert.ok(second.missing.includes('MOTORISTA_DADOS'));
 assert.ok(second.missing.includes('CONTRATO'));
});

test('bad dates, ambiguous currency, missing models and unsafe base structures are rejected',()=>{
 assert.throws(()=>D.render('absent'),/não encontrado/);
 assert.throws(()=>D.bundle([]),/Escolha/);
 assert.throws(()=>D.render('rental',{INICIO:'2027-02-30'}),/data/);
 assert.throws(()=>D.render('rental',{INICIO:'2027-02-02',FIM:'2027-02-01'}),/fim da vigência/);
 for(const amount of ['1,234.50','12.34','-1','NaN','Infinity','1e3'])assert.throws(()=>D.render('rental',{ALUGUEL:amount}),/reais|Valor/);
 assert.throws(()=>D.render('privacy',{LOCALIZACAO:'aceite presumido'}),/Escolha/);
 assert.throws(()=>D.clean({MOTORISTA:{nested:'data'}}),/texto/);
 assert.throws(()=>D.clean({MOTORISTA:'x'.repeat(7001)}),/longo/);
 assert.throws(()=>D.importBase({type:'rodavolt-legal-base',version:1,values:{MOTORISTA:'não importar'}}),/motorista/);
 assert.throws(()=>D.importBase({type:'rodavolt-legal-base',version:1,values:JSON.parse('{"__proto__":"invalid"}')}),/não reconhecido/);
 assert.throws(()=>D.importBase({type:'other',version:1,values:{}}),/base de preenchimento/);
});

test('downloaded HTML escapes personal text and makes pending fields explicit',()=>{
 const html=D.exportHtml('rental',{MOTORISTA:'</pre><script>alert("x")</script><img src=x onerror=alert(1)>'});
 assert.doesNotMatch(html,/<script>|<img/);
 assert.match(html,/&lt;script&gt;/);
 assert.match(html,/Campos ainda em aberto/);
 assert.match(D.exportHtml('rental',filled('rental')),/Campos preenchidos/);
 assert.match(D.exportHtml('rental',filled('rental')),/não equivale a revisão jurídica ou assinatura/);
});

test('preparing every new template does not alter historical contracts, signatures, financial state or approval gates',()=>{
 const ops=K.ensure(globalThis.RodavoltOperations.create(globalThis.RodavoltSimulator.freezePlan(globalThis.RodavoltSimulator.defaults)));
 const before=JSON.stringify(ops),opening=K.preview(ops,'JUR-1').body;
 D.bundle(all,filled());D.exportHtml(D.entryIds,filled());D.exportBase(filled());
 assert.equal(JSON.stringify(ops),before);
 assert.equal(K.preview(ops,'JUR-1').body,opening);
 assert.equal(K.contracts(ops).length,1);
});

test('exported files contain the complete current fillable texts and the same printable bundle',async()=>{
 for(const doc of D.docs){
  const file=await readFile(new URL('../docs/contratos/preenchiveis/'+doc.id+'.md',import.meta.url),'utf8');
  assert.ok(file.includes(D.render(doc.id).body),doc.id+' export is stale');
  assert.match(file,/Referências oficiais/);
 }
 const html=await readFile(new URL('../docs/contratos/preenchiveis/PACOTE-COMPLETO.html',import.meta.url),'utf8');
 assert.equal(html,D.exportHtml(all));
 const txt=await readFile(new URL('../docs/contratos/preenchiveis/PACOTE-COMPLETO.txt',import.meta.url),'utf8');
 assert.equal(txt,D.exportText(all));
});
