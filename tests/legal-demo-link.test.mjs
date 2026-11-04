import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/growth.js';
import '../src/control.js';
import '../src/driver.js';
import '../src/operations.js';
import '../src/coordination.js';
import '../src/legal-documents.js';
const S=globalThis.RodavoltSimulator,M=globalThis.RodavoltOperations,K=globalThis.RodavoltCoordination,L=globalThis.RodavoltLegalDocuments;
function fixture(){
 const ops=M.create(S.freezePlan(S.defaults));K.ensure(ops);
 const driver=M.addDriver(ops,{name:'Motorista TESTE',due:K.operatingDate});driver.docs=true;
 ops.vehicle.plate='TESTE-EV-001';
 const terms={modelId:'rental',driverId:driver.id,vehicleId:'RV-001',startDate:'2027-01-25',endDate:'2028-01-24',weekly:1050,deposit:1500,kmLimit:0,conditions:'Ensaio fictício'};
 const contract=K.createContract(ops,terms);
 const values=Object.fromEntries(L.fieldsFor(L.entryIds).map(f=>[f.key,f.type==='date'?'2027-01-25':f.type==='select'?f.options[0]:f.type==='money'?'0,00':'DADO FICTÍCIO DE TESTE']));
 Object.assign(values,{MOTORISTA:driver.name,CARRO:'Elétrico TESTE-EV-001',CONTRATO:contract.id,INICIO:terms.startDate,FIM:terms.endDate,ALUGUEL:'1.050,00',CAUCAO:'1.500,00'});
 return {ops,driver,contract,values,terms};
}
test('entry packet freezes all eight texts for its own driver without paying, signing or releasing anything',()=>{
 const {ops,driver,contract,values}=fixture(),book=JSON.stringify(ops.book),opening=K.preview(ops,'JUR-1').body;
 K.attachDemoPackage(ops,contract.id,{fictional:true,values});
 assert.equal(contract.version,2);assert.equal(contract.status,'draft');assert.equal(contract.demoPackage.documents.length,8);
 assert.deepEqual(K.driverDocuments(ops,driver.id)[0].documents.map(d=>d.id),L.entryIds);
 assert.equal(K.driverDocuments(ops,'DRV-1')[0].documents.length,0);
 assert.match(K.preview(ops,contract.id).body,/PACOTE FICTÍCIO DE ENTRADA/);
 assert.equal(K.hasSignedRental(ops,driver.id),false);assert.equal(contract.signatures.driver,null);
 assert.equal(JSON.stringify(ops.book),book);assert.equal(K.preview(ops,'JUR-1').body,opening);
 values.MOTORISTA='Outra pessoa';assert.match(K.preview(ops,contract.id).body,/Motorista TESTE/);
 const view=K.driverDocuments(ops,driver.id);view[0].documents[0].body='mutated';assert.notEqual(contract.demoPackage.documents[0].body,'mutated');
});
test('incomplete, unconfirmed or mismatched packet is rejected without changing the version',()=>{
 for(const patch of [{MOTORISTA:'Outro TESTE'},{CARRO:'Outro carro'},{CARRO:'TESTE-EV-0010'},{CONTRATO:'JUR-999'},{CONTRATO:'JUR-20'},{ALUGUEL:'1.100,00'},{CAUCAO:'2.000,00'},{FIM:'2028-02-01'},{RECARGA:''}]){
  const {ops,contract,values}=fixture(),before=JSON.stringify(ops);
  assert.throws(()=>K.attachDemoPackage(ops,contract.id,{fictional:true,values:{...values,...patch}}));
  assert.equal(JSON.stringify(ops),before);
 }
 const {ops,contract,values,driver}=fixture();
 assert.throws(()=>K.attachDemoPackage(ops,contract.id,{values}),/fictício/);
 driver.name='Pessoa sem identificação de ensaio';assert.throws(()=>K.attachDemoPackage(ops,contract.id,{fictional:true,values}),/TESTE/);
});
test('repeated link is idempotent; reviewed packets cannot be replaced; edited terms retain the old packet only in history',()=>{
 const {ops,contract,values,terms}=fixture();K.attachDemoPackage(ops,contract.id,{fictional:true,values});
 const version=contract.version,body=K.preview(ops,contract.id).body;
 assert.equal(K.attachDemoPackage(ops,contract.id,{fictional:true,values}),false);assert.equal(contract.version,version);
 K.reviewContract(ops,contract.id,Object.fromEntries(K.reviewItems.map(([key])=>[key,true])));
 assert.throws(()=>K.attachDemoPackage(ops,contract.id,{fictional:true,values}),/não revisada/);
 K.queueContract(ops,contract.id);K.markAwaiting(ops,contract.id);K.recordSignature(ops,contract.id,'driver');K.recordSignature(ops,contract.id,'company');
 assert.equal(K.hasSignedRental(ops,contract.driverId),true);
 K.updateContract(ops,contract.id,{...terms,weekly:1100});
 assert.equal(contract.demoPackage,null);assert.equal(contract.status,'draft');assert.equal(K.hasSignedRental(ops,contract.driverId),false);
 const previous=contract.history.find(h=>h.version===version&&h.demoPackage);
 assert.equal(K.preview(ops,{...contract,...previous}).body,body);
});
