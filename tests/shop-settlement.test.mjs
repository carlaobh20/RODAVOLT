import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/growth.js';
import '../src/control.js';
import '../src/driver.js';
import '../src/operations.js';
import '../src/program.js';

const S=globalThis.RodavoltSimulator,C=globalThis.RodavoltControl,M=globalThis.RodavoltOperations,R=globalThis.RodavoltProgram;
const make=()=>{const plan=S.freezePlan(S.defaults);return {plan,ops:M.create(plan)};};
const actual=({ops,plan})=>C.realized(ops.book,plan).at(-1);
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-5,`${a} != ${b}`);
const addSale=(ops,productId='perfume',extra={})=>Object.assign(C.sale(ops.book,productId,1,'company'),extra);

test('payment-specific settlement preserves unrelated manual sales and recognizes cash, inventory and obligation once',()=>{
 const sample=make(),{ops}=sample;
 const selected=addSale(ops),manual=addSale(ops,'cable'),foreign=addSale(ops,'charger',{driverId:'DRV-2'}),before=actual(sample),entryCount=ops.book.entries.length;
 assert.equal(R.settle(ops,'credit','DRV-1',[selected.id]),true);
 const after=actual(sample);
 close(after.cash-before.cash,89);close(after.inventory-before.inventory,-32);close(after.liabilities-before.liabilities,57);close(after.result-before.result,0);close(after.equity-before.equity,0);
 assert.equal(ops.book.entries.length-entryCount,3);
 assert.equal(selected.settled,true);assert.equal(manual.settled,undefined);assert.equal(foreign.settled,undefined);
 assert.deepEqual(ops.program.credits.map(c=>c.saleIds),[[selected.id]]);
 close(R.driverCredits(ops,'DRV-1').available,57);close(R.driverCredits(ops,'DRV-2').available,0);
});

test('selected multi-product payment settles exactly its sales, leaving the other pending sale untouched',()=>{
 const sample=make(),{ops}=sample,first=addSale(ops),second=addSale(ops,'cable'),manual=addSale(ops,'charger'),before=actual(sample);
 assert.equal(R.settle(ops,'credit','DRV-1',[first.id,second.id]),true);
 const after=actual(sample);
 close(after.cash-before.cash,118);close(after.inventory-before.inventory,-41);close(after.liabilities-before.liabilities,77);close(after.result-before.result,0);
 assert.equal(manual.settled,undefined);assert.equal(ops.program.credits.length,2);
});

test('invalid or foreign settlement lists fail before any mutation, even when a valid sale comes first',()=>{
 for(const invalid of ['empty','duplicate','unknown','foreign','wrong-type','blank']){
  const {ops}=make(),own=addSale(ops),other=addSale(ops,'charger',{driverId:'DRV-2'});
  const ids={empty:[],duplicate:[own.id,own.id],unknown:[own.id,'DOES-NOT-EXIST'],foreign:[own.id,other.id],'wrong-type':own.id,blank:[own.id,' ']}[invalid],before=structuredClone(ops);
  assert.throws(()=>R.settle(ops,'credit','DRV-1',ids),RangeError,invalid);
  assert.deepEqual(ops,before,invalid);
 }
});

test('retrying a selected settlement is a no-op and a mixed retry settles only new sales',()=>{
 const {ops}=make(),first=addSale(ops),second=addSale(ops,'cable');
 R.settle(ops,'credit','DRV-1',[first.id]);
 const afterFirst=structuredClone(ops);
 assert.equal(R.settle(ops,'credit','DRV-1',[first.id]),false);assert.deepEqual(ops,afterFirst);
 assert.equal(R.settle(ops,'credit','DRV-1',[first.id,second.id]),true);
 assert.equal(ops.program.credits.length,2);assert.equal(ops.book.entries.length-afterFirst.book.entries.length,3);
 const afterBoth=structuredClone(ops);
 assert.equal(R.settle(ops,'credit','DRV-1',[first.id,second.id]),false);assert.deepEqual(ops,afterBoth);
});

test('settlement preserves the selling driver and original vehicle after the driver changes cars',()=>{
 const {ops}=make(),driver=M.driver(ops,'DRV-2');driver.vehicleId='RV-008';
 const sale=addSale(ops,'perfume',{driverId:'DRV-2',vehicleId:'RV-009'}),firstEntry=ops.book.entries.length;
 R.settle(ops,'credit','DRV-2',[sale.id]);
 assert.ok(ops.book.entries.slice(firstEntry).every(e=>e.driverId==='DRV-2'&&e.vehicle==='RV-009'));
 assert.equal(ops.program.credits[0].driverId,'DRV-2');assert.equal(ops.program.credits[0].vehicleId,'RV-009');
 close(R.driverCredits(ops,'DRV-1').available,0);close(R.driverCredits(ops,'DRV-2').available,57);
});

test('legacy settlement still selects pending sales by driver and falls back to the current vehicle',()=>{
 const {ops}=make();M.driver(ops,'DRV-1').vehicleId='RV-007';
 const own=addSale(ops),other=addSale(ops,'charger',{driverId:'DRV-2'}),entryCount=ops.book.entries.length;
 assert.equal(R.settle(ops),true);
 assert.equal(own.settled,true);assert.equal(other.settled,undefined);
 assert.ok(ops.book.entries.slice(entryCount).every(e=>e.vehicle==='RV-007'));
 assert.equal(ops.program.credits[0].vehicleId,'RV-007');
});
