import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import '../src/growth.js';
import '../src/control.js';
import '../src/driver.js';
import '../src/operations.js';
import '../src/legal-pack.js';
import '../src/coordination.js';
const S=globalThis.RodavoltSimulator,M=globalThis.RodavoltOperations,K=globalThis.RodavoltCoordination;
const make=()=>K.ensure(M.create(S.freezePlan(S.defaults)));
const terms={modelId:'rental',driverId:'DRV-2',vehicleId:'RV-001',startDate:'2027-01-25',endDate:'2028-01-24',weekly:1050,deposit:1500,kmLimit:1500,conditions:'Condições comerciais ainda em revisão.'};

test('five counsel drafts are complete, retrievable, and versioned without replacing opening history',()=>{
 const ops=make(),opening=K.preview(ops,'JUR-1').body;
 assert.equal(K.catalog(ops).length,5);
 assert.equal(ops.legal.modelVersions.length,12);
 for(const m of K.catalog(ops)){
  assert.equal(m.policy,'counsel-review');
  assert.ok(m.body.length>1400,m.id+' needs substantive text');
  assert.match(m.body,/REVISÃO PROFISSIONAL/);
  assert.match(m.body,/PREENCHER/);
  const c=K.createContract(ops,{...terms,modelId:m.id}),p=K.preview(ops,c.id);
  assert.equal(p.missing.length,0);
  assert.equal(c.modelVersion,m.version);
  assert.ok(p.body.includes(c.driverName));
 }
 assert.equal(K.preview(ops,'JUR-1').body,opening);
 const snapshot=JSON.stringify(ops.legal.modelVersions);K.ensure(ops);
 assert.equal(JSON.stringify(ops.legal.modelVersions),snapshot);
});

test('core drafts preserve confirmed rent and shop rules without inventing automatic penalties',()=>{
 const ops=make(),r=K.createContract(ops,terms),kit=K.createContract(ops,{...terms,modelId:'kit'});
 const rent=K.preview(ops,r.id).body,shop=K.preview(ops,kit.id).body;
 assert.match(rent,/semana vencida/);
 assert.match(rent,/Caução.*garantia segregada/is);
 assert.match(rent,/não cria multa, juros ou reajuste automáticos/);
 assert.match(shop,/100% da margem comercial/);
 assert.match(shop,/não gera segundo crédito/);
 assert.match(shop,/quarentena/);
});

test('lawyer handoff files contain the current five complete model versions',async()=>{
 for(const [id,model] of Object.entries(globalThis.RodavoltLegalPack.models)){
  const file=await readFile(new URL('../docs/contratos/'+id+'.md',import.meta.url),'utf8');
  assert.ok(file.includes(model.body.trimEnd()),id+' export is stale');
  assert.match(file,/Minuta para revisão profissional/);
 }
});
