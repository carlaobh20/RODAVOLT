import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/growth.js';
import '../src/control.js';
import '../src/driver.js';
import '../src/operations.js';
const S=globalThis.RodavoltSimulator,M=globalThis.RodavoltOperations;
const make=()=>M.create(S.freezePlan(S.defaults));

test('existing cards appear in the five starting columns and custom columns keep operational stage',()=>{
 const ops=make(),board=M.ensureKanban(ops),driver=M.driver(ops,'DRV-1');
 assert.deepEqual(board.columns.map(c=>c.stage),['lead','docs','ready','active','closed']);
 assert.equal(M.columnFor(ops,driver).id,'active');
 const column=M.createColumn(ops,'Aguardando retorno');
 M.placeDriver(ops,driver.id,column.id);
 assert.equal(M.columnFor(ops,driver).id,column.id);
 assert.equal(driver.stage,'active');
 assert.equal(driver.vehicleId,'RV-001');
 assert.equal(M.validateKanban(ops),true);
});

test('rename and reorder columns preserve cards and reject duplicate names',()=>{
 const ops=make(),column=M.createColumn(ops,'Entrevista');
 assert.equal(M.renameColumn(ops,column.id,'Pré-seleção').name,'Pré-seleção');
 assert.throws(()=>M.renameColumn(ops,column.id,'RODANDO'),/nome único/);
 assert.equal(M.reorderColumn(ops,column.id,-1),true);
 assert.equal(M.ensureKanban(ops).columns.at(-2).id,column.id);
 assert.equal(M.reorderColumn(ops,'lead',-1),false);
 assert.equal(M.validateKanban(ops),true);
});

test('deleting any column relocates every visible card without changing its real lifecycle',()=>{
 const ops=make(),board=M.ensureKanban(ops),active=M.driver(ops,'DRV-1');
 const destination=M.createColumn(ops,'Acompanhar');
 assert.equal(M.deleteColumn(ops,'active',destination.id),1);
 assert.equal(M.columnFor(ops,active).id,destination.id);
 assert.equal(active.stage,'active');
 assert.equal(active.vehicleId,'RV-001');
 assert.equal(board.columns.some(c=>c.id==='active'),false);
 assert.equal(M.deleteColumn(ops,'lead',destination.id),2);
 assert.equal(M.columnFor(ops,M.driver(ops,'DRV-4')).id,destination.id);
 assert.equal(M.validateKanban(ops),true);
});

test('the last column cannot be removed and a custom column does not close a driver',()=>{
 const ops=make(),column=M.createColumn(ops,'Pós-venda');
 M.placeDriver(ops,'DRV-1',column.id);
 assert.equal(M.driver(ops,'DRV-1').stage,'active');
 assert.equal(M.columnFor(ops,M.driver(ops,'DRV-1')).id,column.id);
 for(const id of M.ensureKanban(ops).columns.map(c=>c.id).filter(id=>id!==column.id))M.deleteColumn(ops,id,column.id);
 assert.throws(()=>M.deleteColumn(ops,column.id,column.id),/última/);
 assert.equal(M.validateKanban(ops),true);
});

test('deleted role columns remain deleted on later stage changes',()=>{
 const ops=make(),column=M.createColumn(ops,'Personalizado');
 M.deleteColumn(ops,'docs',column.id);
 const driver=M.driver(ops,'DRV-3');
 assert.equal(M.columnFor(ops,driver).id,column.id);
 driver.docs=true;
 M.move(ops,driver.id,'ready');
 assert.equal(M.columnFor(ops,driver).id,'ready');
 assert.equal(M.ensureKanban(ops).columns.some(c=>c.id==='docs'),false);
});
test('column order and card placement survive a workspace JSON round trip',()=>{const ops=make(),column=M.createColumn(ops,'Contato amanhã');M.reorderColumn(ops,column.id,-1);M.placeDriver(ops,'DRV-4',column.id);const restored=JSON.parse(JSON.stringify(ops));assert.equal(M.columnFor(restored,M.driver(restored,'DRV-4')).id,column.id);assert.equal(M.ensureKanban(restored).columns.at(-2).id,column.id);assert.equal(M.validateKanban(restored),true);});
