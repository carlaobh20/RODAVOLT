import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/growth.js';
import '../src/simulator.js';
const R=globalThis.RodavoltReality,S=globalThis.RodavoltSimulator;
const base={...S.defaults,initialCapital:120000,companySetup:0,initialFleet:1,targetFleet:1,reinvest:false,price:60000,financed:false,setup:0,stockCapital:0,centralStockCapital:0,reserveFixed:5000,reservePerCar:0,weekly:700,occupancy:100,stoppedDays:0,lossPct:0,kmPerDay:0,insurance:0,annualTax:1200,annualLicense:240,tracker:0,washing:0,other:0,admin:0,staffCost:0,revenueTaxPct:0,profitTaxPct:0,storeDaily:0,maintenanceMonthly:0,maintenanceKm:0,tiresKm:0,depreciationPct:0,cashYieldAnnual:0,monthlyContribution:0,ownerDrawPct:0,startYear:2026,startMonth:11};
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-5,`${a} != ${b}`);
test('economic monthly provision differs from tax cash due and mileage triggers',()=>{const p={...base,kmPerDay:100,maintenanceKm:.1,tiresKm:.05};const r=R.analyze(p,{annualTaxMonth:1,annualLicenseMonth:2,serviceIntervalKm:5000,serviceCost:500,tiresIntervalKm:10000,tiresCost:1000});const first=r.rows[0];assert.ok(first.accrualProvision>0);close(first.actualLumpy,0);assert.equal(r.rows[2].expenses.some(e=>e.kind==='IPVA'),true);assert.equal(r.rows[1].expenses.some(e=>e.kind==='Revisão por km'),true);assert.ok(r.rows.some(m=>m.expenses.some(e=>e.kind==='Pneus por km')));close(first.cashMovement-first.economic.cashAfterDebt,first.accrualProvision);});
test('temporary delay becomes receivable and later cash; default loss never recovers',()=>{const r=R.analyze(base,{temporaryDelayPct:20,delayMonths:1}),first=r.rows[0],second=r.rows[1];assert.ok(first.delayedOut>0);close(second.delayedIn,first.delayedOut);close(second.receivables,second.delayedOut);const lost=R.analyze({...base,lossPct:20},{temporaryDelayPct:0});assert.ok(lost.rows[1].cashMovement<r.rows[1].cashMovement);});
test('car-only view excludes shop and incident reduces cash and reserve cushion',()=>{const shop=R.analyze({...base,storeDaily:30,cogsPct:40,storeRewardBasis:'margin',driverProfitPct:50},{incidentMonth:2,incidentDeductible:3000,incidentStoppedDays:4}),clear=R.analyze({...base,storeDaily:30,cogsPct:40,storeRewardBasis:'margin',driverProfitPct:50});assert.ok(shop.withoutShop);assert.ok(shop.monthlyFree>shop.withoutShop.monthlyFree);assert.ok(shop.rows[1].cash<clear.rows[1].cash);assert.ok(shop.rows[1].incidentLostRent>0);assert.equal(shop.rows.length,36);assert.equal(shop.weeks.length,13);});
test('three quote comparison uses independent prices, finance and resale assumptions',()=>{const quotes=[{name:'A',params:{price:60000,financed:false,weekly:700},resalePct:50},{name:'B',params:{price:90000,financed:false,weekly:700},resalePct:50},{name:'C',params:{price:60000,financed:true,downPct:20,monthlyRate:1,term:36,weekly:700},resalePct:70}];const rows=R.compare(quotes,base,{});assert.equal(rows.length,3);assert.ok(rows[1].initialNeed>rows[0].initialNeed);assert.ok(rows[2].initialNeed<rows[0].initialNeed);assert.notEqual(rows[2].npv,rows[0].npv);assert.throws(()=>R.compare([...quotes,quotes[0]],base,{}),/três/);});

test('incident reduces mileage and never delays rent for stopped days',()=>{
 const p={...base,startMonth:1,kmPerDay:100,annualTax:0,annualLicense:0};
 const r=R.analyze(p,{incidentMonth:1,incidentStoppedDays:20,temporaryDelayPct:25,serviceIntervalKm:2000,serviceCost:500});
 close(r.rows[0].economic.km,1100);close(r.rows[0].delayedOut,1100*.25);
 assert.equal(r.rows[0].expenses.some(e=>e.kind==='Revisão por km'),false);
});
test('cash maturity is applied before extra principal and cannot spend protected reserve',()=>{
 const p={...base,initialCapital:36000,financed:true,downPct:50,monthlyRate:0,term:120,weekly:0,startMonth:1,annualTax:1200,annualLicense:0,amortStrategy:'monthly',extraAmort:10000};
 const r=R.analyze(p,{annualTaxMonth:1});
 assert.equal(r.rows[0].extra,0);assert.equal(r.firstBelowReserve,1);
 close(r.rows[0].cash,4550);
 for(const row of r.rows)close(row.economic.bridgeError,0);
});
test('first-month equilibrium includes actual service, delay and incident',()=>{
 const p={...base,startMonth:1,annualTax:0,annualLicense:0,insurance:100,kmPerDay:100};
 const clear=R.analyze(p,{serviceIntervalKm:2000,serviceCost:500});
 const stress=R.analyze(p,{serviceIntervalKm:2000,serviceCost:500,temporaryDelayPct:20,incidentMonth:1,incidentDeductible:1000,incidentStoppedDays:3});
 assert.ok(stress.weeklyBreakEven>clear.weeklyBreakEven);
 const at=R.analyze({...p,weekly:stress.weeklyBreakEven},{serviceIntervalKm:2000,serviceCost:500,temporaryDelayPct:20,incidentMonth:1,incidentDeductible:1000,incidentStoppedDays:3});
 assert.ok(at.rows[0].cashMovement>=-1e-6&&at.rows[0].cashMovement<1);
 assert.equal(R.analyze(p,{temporaryDelayPct:100}).weeklyBreakEven,null);
});
test('blocked car does not produce a resale, return or payback claim',()=>{
 const r=R.analyze({...base,initialCapital:0});
 assert.equal(r.acquired,false);assert.equal(r.npv,null);assert.equal(r.monthlyFree,null);assert.equal(r.resale,0);assert.equal(r.weeklyBreakEven,null);assert.ok(r.capitalGap>0);
});
test('external contributions do not become vehicle return and four weeks reconcile February',()=>{
 const p={...base,startMonth:2};
 const r=R.analyze(p),funded=R.analyze({...p,monthlyContribution:1000});
 close(r.npv,funded.npv);close(funded.rows[0].cash-r.rows[0].cash,1000);
 close(r.weeks[3].cash,r.rows[0].cash);
});
test('negotiated discount changes entry, loan, payment and asset consistently',()=>{
 const full=S.purchaseQuote({...base,financed:true,downPct:30,purchaseDiscountPct:10});
 close(full.price,54000);close(full.discount,6000);close(full.entry,16200);close(full.debt,37800);
 const r=S.simulate({...base,financed:true,downPct:30,purchaseDiscountPct:10});
 close(r.initial.cars[0].value,54000);close(r.initial.cars[0].debt,37800);
});
test('purchase cadence tries scheduled months and still protects reserve',()=>{
 const p={...base,initialCapital:300000,targetFleet:5,reinvest:true,purchaseEveryMonths:2,horizon:6};
 const r=S.simulate(p);assert.deepEqual(r.events.filter(e=>e.type==='purchase').map(e=>e.month),[0,2,4,6]);
 const short=S.simulate({...p,initialCapital:65000,weekly:0});
 assert.equal(short.events.filter(e=>e.type==='purchase').length,1);
 assert.deepEqual(short.events.filter(e=>e.type==='purchase-wait').map(e=>e.month),[2,4,6]);
 assert.ok(short.events.filter(e=>e.type==='purchase-wait').every(e=>e.amount>0));
});
