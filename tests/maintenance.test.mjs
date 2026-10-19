import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/growth.js';
import '../src/control.js';
import '../src/driver.js';
import '../src/operations.js';
import '../src/coordination.js';
import '../src/maintenance.js';

const S=globalThis.RodavoltSimulator,C=globalThis.RodavoltControl,M=globalThis.RodavoltOperations,K=globalThis.RodavoltCoordination,W=globalThis.RodavoltMaintenance;
function make(){const plan=S.freezePlan(S.defaults),ops=M.create(plan);K.ensure(ops);W.ensure(ops);return {ops,plan};}
const config=(ops,extra={})=>W.configure(ops,{vehicleId:'RV-001',title:'Óleo e filtro',intervalKm:10000,intervalDays:180,lastKm:40000,lastDate:'2027-01-01',warningKm:1000,estimatedCost:300,note:'Intervalos fictícios escolhidos para testar, conforme orientação registrada.',...extra});
const order=(ops,p,extra={})=>W.openOrder(ops,{planId:p.id,vehicleId:p.vehicleId,due:'2027-01-25',note:'Prazo de exemplo combinado com oficina.',...extra});
function finish(ops,s,input={date:'2027-01-25',km:43000},cost=320){M.closeService(ops,s.id,cost,input);return ops.maintenancePlans.completions.find(c=>c.serviceId===s.id);}

test('no maintenance interval is invented before management configures one',()=>{const {ops}=make();assert.deepEqual(W.summary(ops),[]);assert.deepEqual(W.agendaItems(ops),[]);assert.equal(ops.vehicle.nextKm,45000);assert.equal(ops.maintenancePlans.plans.length,0);});

test('explicit distance and date intervals compute the next care without posting any cost',()=>{const {ops,plan}=make(),before=C.realized(ops.book,plan).at(-1),p=config(ops),s=W.summary(ops)[0],after=C.realized(ops.book,plan).at(-1);assert.equal(s.nextKm,50000);assert.equal(s.nextDate,'2027-06-30');assert.equal(s.remainingKm,7620);assert.equal(s.nearKm,false);assert.equal(s.due,false);assert.equal(p.estimatedCost,300);assert.equal(ops.vehicle.nextKm,50000);for(const key of ['cash','result','equity','liabilities'])assert.equal(after[key],before[key]);});

test('km-only and date-only plans are supported without manufacturing the other interval',()=>{const a=make(),b=make();config(a.ops,{intervalDays:''});assert.equal(W.summary(a.ops)[0].nextDate,null);config(b.ops,{intervalKm:'',warningKm:0});assert.equal(W.summary(b.ops)[0].nextKm,null);assert.equal(b.ops.vehicle.nextKm,null);assert.equal(b.ops.vehicle.maintenanceManaged,true);});

test('invalid, missing and future anchors reject configuration without creating a plan',()=>{for(const input of [{intervalKm:'',intervalDays:''},{intervalKm:0},{intervalDays:-1},{lastKm:43000},{lastKm:-1},{lastDate:'2027-02-30'},{lastDate:'2027-01-26'},{warningKm:10001},{estimatedCost:-1},{note:''}]){const {ops}=make(),before=JSON.stringify(ops);assert.throws(()=>config(ops,input));assert.equal(JSON.stringify(ops),before);}});

test('a km warning creates a planning reminder today while retaining the actual date deadline',()=>{const {ops}=make();config(ops,{lastKm:33000});const summary=W.summary(ops)[0];assert.equal(summary.remainingKm,620);assert.equal(summary.nearKm,true);assert.equal(summary.nextDate,'2027-06-30');const reminder=W.agendaItems(ops,'2027-01-25')[0];assert.equal(reminder.date,'2027-01-25');assert.equal(reminder.vehicleId,'RV-001');assert.equal(reminder.origin,'fleet');assert.match(reminder.note,/2027-06-30/);});

test('date and odometer deadlines are calculated independently and the first one reached is due',()=>{const a=make(),b=make();config(a.ops,{lastKm:30000});assert.equal(W.summary(a.ops)[0].overdueKm,true);assert.equal(W.summary(a.ops)[0].overdueDate,false);assert.equal(W.summary(a.ops)[0].due,true);config(b.ops,{intervalDays:20});assert.equal(W.summary(b.ops)[0].overdueDate,true);assert.equal(W.summary(b.ops)[0].overdueKm,false);assert.equal(W.summary(b.ops)[0].due,true);assert.equal(W.agendaItems(b.ops)[0].date,'2027-01-21');});

test('opening an order links a plan, records its workshop deadline and keeps costs out of the ledger',()=>{const {ops}=make(),p=config(ops),entries=ops.book.entries.length,s=order(ops,p);assert.equal(s.status,'open');assert.equal(s.due,'2027-01-25');assert.deepEqual(s.maintenancePlanIds,[p.id]);assert.equal(M.vehicles(ops)[0].status,'maintenance');assert.equal(ops.book.entries.length,entries);assert.equal(W.summary(ops)[0].openOrderId,s.id);assert.throws(()=>order(ops,p),/ordem aberta/);});

test('closing a linked order records actual cost once and restarts only that care interval',()=>{const {ops,plan}=make(),oil=config(ops),tires=config(ops,{title:'Pneus',intervalKm:20000,intervalDays:'',warningKm:0}),s=order(ops,oil),before=C.realized(ops.book,plan).at(-1),record=finish(ops,s),after=C.realized(ops.book,plan).at(-1);assert.ok(record);assert.equal(record.serviceId,s.id);assert.equal(record.cost,320);assert.equal(after.cash-before.cash,-320);assert.ok(Math.abs(after.result-before.result+320)<1e-7);assert.ok(Math.abs(after.equity-before.equity+320)<1e-7);assert.equal(ops.vehicle.km,43000);const list=W.summary(ops);assert.equal(list.find(p=>p.id===oil.id).nextKm,53000);assert.equal(list.find(p=>p.id===oil.id).nextDate,'2027-07-24');assert.equal(list.find(p=>p.id===tires.id).nextKm,60000);assert.equal(list.find(p=>p.id===tires.id).lastDate,'2027-01-01');assert.equal(M.vehicles(ops)[0].status,'rented');});

test('repeating order completion cannot duplicate cost, history or next-date advancement',()=>{const {ops}=make(),p=config(ops),s=order(ops,p);finish(ops,s);const before=JSON.stringify(ops);assert.equal(M.closeService(ops,s.id,320,{date:'2027-01-25',km:43000}),false);assert.equal(W.recordCompleted(ops,s.id,{date:'2027-01-25',km:43000}),false);assert.equal(JSON.stringify(ops),before);assert.equal(ops.maintenancePlans.completions.length,1);});

test('completion preflight rejects future dates and backward odometers before the financial write',()=>{const {ops}=make(),p=config(ops),s=order(ops,p);for(const input of [{date:'2027-01-26',km:43000},{date:'2027-01-24',km:43000},{date:'2027-01-25',km:40000}]){const before=JSON.stringify(ops);assert.throws(()=>W.validateCompletion(ops,s.id,input));assert.equal(JSON.stringify(ops),before);}assert.throws(()=>W.recordCompleted(ops,s.id,{date:'2027-01-25',km:43000}),/Conclua a ordem/);assert.equal(s.status,'open');});

test('an unplanned service may be concluded without falsely restarting every plan of that car',()=>{const {ops}=make(),p=config(ops),s=W.openOrder(ops,{vehicleId:'RV-001',title:'Consertar retrovisor',due:'2027-01-25',note:'Serviço avulso.'});finish(ops,s);assert.equal(W.lookup(ops,p.id).lastKm,40000);assert.equal(W.summary(ops)[0].nextKm,50000);assert.equal(ops.maintenancePlans.completions[0].planIds.length,0);});

test('plan amendments preserve the previous terms and cannot rewrite an open order',()=>{const {ops}=make(),p=config(ops),s=order(ops,p);assert.throws(()=>config(ops,{planId:p.id,intervalKm:8000}),/Conclua a ordem/);finish(ops,s);config(ops,{planId:p.id,intervalKm:8000,lastKm:43000,lastDate:'2027-01-25'});assert.equal(p.version,2);assert.equal(p.history[0].intervalKm,10000);assert.equal(W.summary(ops)[0].nextKm,51000);assert.equal(ops.maintenancePlans.completions[0].planVersions[p.id],1);});

test('driver care projection is limited to an active current car and contains no estimated cost or internal note',()=>{const {ops}=make();config(ops);const own=W.driverView(ops,'DRV-1');assert.equal(own.length,1);assert.equal('estimatedCost' in own[0],false);assert.equal('note' in own[0],false);assert.deepEqual(W.driverView(ops,'DRV-2'),[]);M.driver(ops,'DRV-1').stage='closed';assert.deepEqual(W.driverView(ops,'DRV-1'),[]);});

test('pausing a care plan removes its agenda reminder and resuming preserves explicit terms',()=>{const {ops}=make(),p=config(ops);W.setActive(ops,p.id,false,'Plano pausado para revisão das condições.');assert.deepEqual(W.agendaItems(ops),[]);assert.equal(ops.vehicle.nextKm,null);assert.throws(()=>order(ops,p),/Retome/);W.setActive(ops,p.id,true,'Condições revistas, plano retomado.');assert.equal(W.summary(ops)[0].nextKm,50000);assert.equal(W.agendaItems(ops).length,1);});

test('an open workshop order prevents a pause from invalidating the version needed to complete it',()=>{const {ops}=make(),p=config(ops),s=order(ops,p);assert.throws(()=>W.setActive(ops,p.id,false,'Pausa durante a oficina.'),/Conclua a ordem/);assert.equal(p.version,1);assert.equal(p.active,true);assert.ok(finish(ops,s));});

test('service completion rejects future dates and backward km before posting cost or releasing the car',()=>{for(const input of [{date:'2027-01-26',km:43000},{date:'2027-01-25',km:40000}]){const {ops}=make(),p=config(ops),s=order(ops,p),before=JSON.stringify(ops);assert.throws(()=>M.closeService(ops,s.id,320,input));assert.equal(JSON.stringify(ops),before);assert.equal(s.status,'open');assert.equal(M.vehicles(ops)[0].status,'maintenance');}});

test('a legacy unplanned service preserves the existing next-km reference when no recurring plan was configured',()=>{const {ops}=make(),s=M.openService(ops,{vehicleId:'RV-001',title:'Lavagem e acabamento avulsos'});assert.equal(ops.vehicle.nextKm,45000);M.closeService(ops,s.id,50);assert.equal(ops.vehicle.nextKm,45000);assert.equal(ops.vehicle.maintenanceManaged,undefined);assert.equal(ops.maintenancePlans.completions.length,1);assert.deepEqual(ops.maintenancePlans.completions[0].planIds,[]);});
