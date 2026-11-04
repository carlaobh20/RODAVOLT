import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {createOperationalServer} from '../server/api.mjs';
test('journey commands use session ownership and idempotency; private returned PDFs survive backup restore',async t=>{
 const dir=await mkdtemp(resolve(tmpdir(),'rodavolt-journey-')),app=await createOperationalServer({root:resolve(import.meta.dirname,'..'),dataDir:dir,port:0}),port=await app.listen(),origin='http://127.0.0.1:'+port;
 t.after(async()=>{await app.close();await rm(dir,{recursive:true,force:true});});
 async function request(path,auth,method='GET',data,revision,key){const response=await fetch(origin+path,{method,headers:{Origin:origin,'Content-Type':'application/json',...(auth?{Cookie:auth.cookie,'x-csrf-token':auth.csrf}:{}),...(revision===undefined?{}:{'If-Match':String(revision)}),...(key?{'Idempotency-Key':key}:{})},body:data===undefined?undefined:JSON.stringify(data)});return {status:response.status,data:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]};}
 const setup=await request('/api/setup',null,'POST',{name:'Teste',username:'gestor',password:'senha-de-teste-123456'}),admin={cookie:setup.cookie,csrf:setup.data.csrf};
 await request('/api/users',admin,'POST',{driverId:'DRV-1',username:'motorista',password:'senha-de-teste-123456'});
 const login=await request('/api/login',null,'POST',{username:'motorista',password:'senha-de-teste-123456'}),auth={cookie:login.cookie,csrf:login.data.csrf};
 let w=await request('/api/workspace',auth);const km=w.data.driver.vehicle.km+10,command={command:'checkin',input:{driverId:'DRV-2',km,battery:70}};
 const check=await request('/api/command',auth,'POST',command,w.data.revision,'checkin-retry-123');assert.equal(check.status,200);assert.equal(check.data.driver.journey.checkins[0].driverId,'DRV-1');
 const retry=await request('/api/command',auth,'POST',command,w.data.revision,'checkin-retry-123');assert.equal(retry.status,200);assert.equal(retry.data.driver.journey.checkins.length,1);
 const bad=await request('/api/files',auth,'POST',{driverId:'DRV-2',contractId:'FOREIGN',name:'assinatura.pdf',mime:'application/pdf',content:Buffer.from('%PDF-1.4\nTeste').toString('base64')});assert.equal(bad.status,422);
 const upload=await request('/api/files',auth,'POST',{driverId:'DRV-2',contractId:'JUR-1',name:'assinatura.pdf',mime:'application/pdf',content:Buffer.from('%PDF-1.4\nTeste').toString('base64')});assert.equal(upload.status,201);assert.equal(upload.data.file.driverId,'DRV-1');
 w=await request('/api/workspace',auth);const returned=await request('/api/command',auth,'POST',{command:'contract.return',input:{contractId:'JUR-1',fileId:upload.data.file.id}},w.data.revision,'contract-return-123');assert.equal(returned.status,200);assert.equal(returned.data.driver.journey.contractReturns[0].status,'awaiting_review');
 // A real driver task becomes visible to management, while other drivers remain isolated.
 await request('/api/users',admin,'POST',{driverId:'DRV-2',username:'outro',password:'senha-de-teste-123456'});
 const otherLogin=await request('/api/login',null,'POST',{username:'outro',password:'senha-de-teste-123456'}),other={cookie:otherLogin.cookie,csrf:otherLogin.data.csrf};
 const isolated=await request('/api/workspace',other);assert.equal(isolated.data.driver.journey.checkins.length,0);assert.equal(isolated.data.driver.journey.contractReturns.length,0);
 w=await request('/api/workspace',auth);const before=w.data.driver.inventory.products.find(p=>p.id==='perfume');
 const sale=await request('/api/command',auth,'POST',{command:'order.create',input:{driverId:'DRV-2',lines:[{productId:'perfume',qty:1}]}},w.data.revision,'driver-sale-123');assert.equal(sale.status,200);
 const order=sale.data.driver.inventory.orders.at(-1),reserved=sale.data.driver.inventory.products.find(p=>p.id==='perfume');assert.equal(order.driverId,'DRV-1');assert.equal(reserved.available,before.available-1);assert.equal(reserved.qty,before.qty);
 let management=await request('/api/workspace',admin);assert.equal(management.data.workspace.ops.journey.checkins[0].km,km);assert.equal(management.data.workspace.ops.journey.contractReturns[0].fileId,upload.data.file.id);assert.equal(management.data.workspace.ops.shop.orders.at(-1).id,order.id);
 // Management confirmation is the unique cash and stock event; delivery cannot repeat it.
 app.domain.H.confirmPayment(management.data.workspace.ops,order.id,{confirmedBy:'management',reference:'PIX-TESTE-JORNADA'});
 const confirmed=await request('/api/workspace',admin,'PUT',management.data.workspace,management.data.revision,'admin-sale-confirm-123');assert.equal(confirmed.status,200);
 w=await request('/api/workspace',auth);assert.equal(w.data.driver.inventory.products.find(p=>p.id==='perfume').qty,before.qty-1);assert.equal(w.data.driver.inventory.orders.at(-1).status,'paid');assert.equal(w.data.driver.credits.available,order.driverProfit);
 const entries=confirmed.data.workspace.ops.book.entries.length;
 const delivered=await request('/api/command',auth,'POST',{command:'order.deliver',input:{id:order.id}},w.data.revision,'driver-sale-deliver-123');assert.equal(delivered.status,200);
 management=await request('/api/workspace',admin);assert.equal(management.data.workspace.ops.book.entries.length,entries);assert.ok(management.data.workspace.ops.shop.orders.at(-1).deliveredAt);assert.equal((await request('/api/workspace',other)).data.driver.inventory.orders.length,0);
 const backup=await request('/api/backup',admin),restore=await request('/api/restore',admin,'POST',backup.data,management.data.revision);assert.equal(restore.status,200);const restored=app.store.get();assert.notEqual(restored.workspace.ops.journey.contractReturns[0].fileId,upload.data.file.id);assert.equal(restored.workspace.ops.journey.contractReturns[0].fileId,restored.files[0].id);assert.deepEqual(restored.workspace.ops.journey.locations,{});
});
test('location samples do not conflict with business forms and stale forms cannot erase or revive sharing',async t=>{
 const dir=await mkdtemp(resolve(tmpdir(),'rodavolt-position-')),app=await createOperationalServer({root:resolve(import.meta.dirname,'..'),dataDir:dir,port:0}),port=await app.listen(),origin='http://127.0.0.1:'+port;
 t.after(async()=>{await app.close();await rm(dir,{recursive:true,force:true});});
 async function request(path,auth,method='GET',data,revision,key){const response=await fetch(origin+path,{method,headers:{Origin:origin,'Content-Type':'application/json',...(auth?{Cookie:auth.cookie,'x-csrf-token':auth.csrf}:{}),...(revision===undefined?{}:{'If-Match':String(revision)}),...(key?{'Idempotency-Key':key}:{})},body:data===undefined?undefined:JSON.stringify(data)});return {status:response.status,data:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]};}
 const setup=await request('/api/setup',null,'POST',{name:'Teste',username:'gestor',password:'senha-de-teste-123456'}),admin={cookie:setup.cookie,csrf:setup.data.csrf};
 await request('/api/users',admin,'POST',{driverId:'DRV-1',username:'motorista',password:'senha-de-teste-123456'});
 const login=await request('/api/login',null,'POST',{username:'motorista',password:'senha-de-teste-123456'}),auth={cookie:login.cookie,csrf:login.data.csrf};
 const before=await request('/api/workspace',admin),position={command:'location.share',input:{latitude:-23.42,longitude:-51.93,accuracy:12,capturedAt:new Date().toISOString()}};
 const gps=await request('/api/command',auth,'POST',position,before.data.revision,'gps-sample-001');assert.equal(gps.status,200);assert.equal(gps.data.revision,before.data.revision);
 const retry=await request('/api/command',auth,'POST',position,before.data.revision,'gps-sample-001');assert.equal(retry.status,200);assert.equal(retry.data.revision,before.data.revision);
 const current=await request('/api/workspace',admin);assert.equal(current.data.revision,before.data.revision);assert.equal(current.data.workspace.ops.journey.locations['DRV-1'].latitude,-23.42);
 before.data.workspace.ops.drivers[0].note='Edição com localização chegando';
 const saved=await request('/api/workspace',admin,'PUT',before.data.workspace,before.data.revision,'business-save-001');assert.equal(saved.status,200);assert.equal(saved.data.workspace.ops.journey.locations['DRV-1'].latitude,-23.42);assert.equal(saved.data.revision,before.data.revision+1);
 // The driver's old business revision can still stop its own location.
 const stop=await request('/api/command',auth,'POST',{command:'location.stop',input:{}},before.data.revision,'gps-stop-001');assert.equal(stop.status,200);assert.equal(stop.data.revision,saved.data.revision);assert.equal(stop.data.driver.journey.location.latitude,undefined);
 saved.data.workspace.ops.drivers[0].note='Não ressuscitar coordenadas antigas';
 const saveAfterStop=await request('/api/workspace',admin,'PUT',saved.data.workspace,saved.data.revision,'business-save-002');assert.equal(saveAfterStop.status,200);assert.equal(saveAfterStop.data.workspace.ops.journey.locations['DRV-1'].sharing,false);assert.equal(saveAfterStop.data.workspace.ops.journey.locations['DRV-1'].latitude,undefined);
 const conflicting=await request('/api/workspace',admin,'PUT',saved.data.workspace,saved.data.revision,'business-save-conflict');assert.equal(conflicting.status,409);
 const forbidden=await request('/api/command',admin,'POST',position,saveAfterStop.data.revision,'gps-admin-forbidden');assert.equal(forbidden.status,403);
});
