import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/growth.js';
import '../src/control.js';
import '../src/driver.js';
import '../src/operations.js';
import '../src/coordination.js';
import '../src/inspection.js';

const S=globalThis.RodavoltSimulator,M=globalThis.RodavoltOperations,K=globalThis.RodavoltCoordination,I=globalThis.RodavoltInspection;
const make=()=>{const ops=M.create(S.freezePlan(S.defaults));K.ensure(ops);I.ensure(ops);return ops;};
const proposedContract=(ops,driverId='DRV-2')=>K.createContract(ops,{modelId:'rental',driverId,vehicleId:'RV-001',startDate:'2027-01-25',endDate:'2028-01-24',weekly:1050,deposit:1500,kmLimit:1500,conditions:'Exemplo para auditoria local.'});
const submitComplete=(ops,r)=>{I.save(ops,r.id,{km:ops.vehicle.km+10,chargePct:50,note:'Conferência de teste.',items:Object.fromEntries(I.items.map(([key])=>[key,'ok'])),evidence:I.slots.map(([slot])=>({slot,source:'illustrative'}))});I.submit(ops,r.id);};

test('periodic and return inspections require the current active driver and cannot reuse a former contract',()=>{
 const ops=make();M.move(ops,'DRV-1','closed');
 for(const driverId of ['DRV-1','DRV-2','DRV-3','DRV-4']){
  const d=M.driver(ops,driverId);d.nextVehicleId='RV-001';
  for(const type of ['periodic','return']){
   const count=I.ensure(ops).records.length;
   assert.throws(()=>I.create(ops,{driverId,vehicleId:'RV-001',type}),/vínculo ativo/);
   assert.equal(I.ensure(ops).records.length,count);
  }
 }
});

test('delivery inspection allows a planned car during docs or ready, while lead and closed stages cannot open it',()=>{
 const ops=make();M.move(ops,'DRV-1','closed');
 for(const driverId of ['DRV-2','DRV-3']){
  M.driver(ops,driverId).nextVehicleId='RV-001';
  assert.equal(I.create(ops,{driverId,type:'delivery'}).vehicleId,'RV-001');
 }
 for(const driverId of ['DRV-1','DRV-4']){
  M.driver(ops,driverId).nextVehicleId='RV-001';
  assert.throws(()=>I.create(ops,{driverId,type:'delivery'}),/vínculo ativo/);
 }
});

test('a future contract does not permit inspecting a car occupied by another driver',()=>{
 const ops=make();proposedContract(ops);
 const count=I.ensure(ops).records.length;
 assert.throws(()=>I.create(ops,{driverId:'DRV-2',type:'delivery'}),/outro motorista/);
 assert.equal(I.ensure(ops).records.length,count);
});

test('a legitimate proposed contract can complete delivery inspection without nextVehicleId',()=>{
 const ops=make();M.move(ops,'DRV-1','closed');proposedContract(ops);
 const d=M.driver(ops,'DRV-2'),r=I.create(ops,{driverId:d.id,type:'delivery'});
 assert.equal(d.vehicleId,null);assert.equal(d.nextVehicleId,undefined);
 submitComplete(ops,r);I.review(ops,r.id,{action:'approve',note:'Vistoria da entrega prevista conferida.'});
 assert.equal(d.inspection,true);assert.equal(I.hasApprovedDelivery(ops,d.id,'RV-001'),true);
});

test('reviewing a former driver pending inspection preserves history without updating the new driver car or delivery flag',()=>{
 const ops=make(),former=M.driver(ops,'DRV-1'),r=I.create(ops,{driverId:former.id,type:'delivery'});
 submitComplete(ops,r);const originalKm=ops.vehicle.km;
 M.move(ops,former.id,'closed');const current=M.driver(ops,'DRV-2');current.stage='active';current.vehicleId='RV-001';
 I.review(ops,r.id,{action:'approve',note:'Conferência histórica do registro antigo.'});
 assert.equal(r.status,'approved');assert.equal(ops.vehicle.km,originalKm);assert.equal(former.inspection,false);assert.equal(current.inspection,false);
 assert.equal(I.hasApprovedDelivery(ops,former.id,'RV-001'),false);
 assert.throws(()=>I.create(ops,{driverId:former.id,type:'periodic'}),/outro motorista/);
});

test('driver agenda adds current vehicle maintenance and revision without leaking another driver financial or legal items',()=>{
 const ops=make();ops.vehicle.km=44500;const service=M.openService(ops,{vehicleId:'RV-001',title:'Revisão do carro'}),contract=proposedContract(ops);
 ops.charges.push({id:'COB-OTHER',driverId:'DRV-2',vehicleId:'RV-001',date:'2027-01-25',amount:1200,status:'open'});
 ops.finance={titles:[{id:'OTHER-PAYABLE',type:'payable',category:'opex',amount:100,due:'2027-01-25',driverId:'DRV-2',vehicle:'RV-001',description:'Título de outro perfil',status:'open'}]};
 const own=K.driverAgendaItems(ops,'DRV-1'),other=K.driverAgendaItems(ops,'DRV-2');
 assert.ok(own.some(e=>e.id==='service:'+service.id));assert.ok(own.some(e=>e.id==='revision:RV-001'));
 for(const id of ['charge:COB-OTHER','finance:OTHER-PAYABLE','contract:'+contract.id])assert.equal(own.some(e=>e.id===id),false,id);
 assert.ok(other.some(e=>e.id==='charge:COB-OTHER'));assert.ok(other.some(e=>e.id==='contract:'+contract.id));
 assert.equal(other.some(e=>['service','revision'].includes(e.kind)),false);
});

test('former vehicle care items do not follow an inactive driver or a driver assigned to another car',()=>{
 const ops=make();ops.vehicle.km=44500;M.openService(ops,{vehicleId:'RV-001',title:'Cuidado do carro antigo'});
 M.acquire(ops,{...S.defaults,purchaseMonth:3});const d=M.driver(ops,'DRV-1');d.vehicleId='RV-002';
 assert.equal(K.driverAgendaItems(ops,d.id).some(e=>['service','revision'].includes(e.kind)&&e.vehicleId==='RV-001'),false);
 d.vehicleId='RV-001';d.stage='closed';
 assert.equal(K.driverAgendaItems(ops,d.id).some(e=>['service','revision'].includes(e.kind)),false);
 assert.throws(()=>K.driverAgendaItems(ops,'MISSING'),/Motorista/);
});
