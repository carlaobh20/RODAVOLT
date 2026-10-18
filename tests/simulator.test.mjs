import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/simulator.js';
const {simulate,payment,defaults,validate}=globalThis.RodavoltSimulator;
const close=(actual,expected,epsilon=1e-7)=>assert.ok(Math.abs(actual-expected)<epsilon,`${actual} != ${expected}`);
const bare={...defaults,fleet:1,price:10000,financed:false,setup:0,reserve:0,stockCapital:0,
  weekly:700,occupancy:100,stoppedDays:0,lossPct:0,kmPerDay:0,insurance:0,
  annualTax:0,annualLicense:0,tracker:0,admin:0,other:0,taxPct:0,storeDaily:0,
  horizon:12,residualPct:100,saleFeePct:0,discountAnnual:0};
test('A weekly rental uses actual calendar days, not four weeks per month',()=>{
  const r=simulate(bare);assert.equal(r.months[0].days,30);close(r.months[0].rentalReceived,3000);
  close(r.months.reduce((s,m)=>s+m.rentalReceived,0),36500);
});
test('Leap year and February boundaries',()=>{
  assert.equal(simulate({...bare,startYear:2028,startMonth:2,horizon:1}).months[0].days,29);
  assert.equal(simulate({...bare,startYear:2027,startMonth:2,horizon:1}).months[0].days,28);
});
test('Downtime and occupancy have distinct denominators',()=>{
  const m=simulate({...bare,stoppedDays:5,occupancy:80}).months[0];close(m.rentedDays,20);close(m.rentalReceived,2000);
});
test('Permanent receipt loss does not reduce kilometers or billed turnover tax',()=>{
  const m=simulate({...bare,lossPct:10,taxPct:6}).months[0];close(m.rentalBilled,3000);close(m.rentalReceived,2700);close(m.tax,180);
});
test('Shop margin is separated from revenue and taxed on gross sales',()=>{
  const m=simulate({...bare,weekly:0,storeDaily:10,cogsPct:50,commissionPct:20,paymentFeePct:2,storeLossPct:2,taxPct:6}).months[0];
  close(m.storeGross,300);close(m.storeContribution,78);close(m.tax,18);close(m.cash,60);
});
test('Company administration is not multiplied by number of cars',()=>{
  const m=simulate({...bare,fleet:3,weekly:0,admin:500,insurance:100}).months[0];close(m.fixed,800);close(m.cash,-800);
});
test('Acquisition includes setup, working capital and only cash paid for cars',()=>{
  const r=simulate({...bare,financed:true,downPct:30,setup:100,reserve:500,stockCapital:200,financingFees:150});
  close(r.principal,7000);close(r.initial,3950);
});
test('Zero-interest debt amortizes without NaN; paid off at term',()=>{
  const r=simulate({...bare,financed:true,downPct:0,monthlyRate:0,term:10,horizon:12});
  close(r.installment,1000);close(r.months[9].debt,0);close(r.months[10].debtPayment,0);
});
test('Price debt payments conserve principal; installments stop at term',()=>{
  const r=simulate({...bare,financed:true,downPct:0,monthlyRate:1.5,term:12,horizon:14});
  close(r.months.reduce((s,m)=>s+m.amortization,0),10000);close(r.months[12].debtPayment,0);
  for(const m of r.months)close(m.debtPayment,m.interest+m.amortization);
});
test('Principal is cash outflow; profit only subtracts interest and depreciation',()=>{
  const r=simulate({...bare,financed:true,downPct:30,term:36,monthlyRate:1.5,residualPct:60});const m=r.months[0];
  close(m.accountingResult-m.cash,m.amortization-r.depreciation);
});
test('Terminal proceeds repay outstanding debt and recover opening reserves once',()=>{
  const r=simulate({...bare,financed:true,downPct:30,term:48,horizon:12,reserve:500,stockCapital:200,residualPct:60,saleFeePct:3});
  close(r.terminal,6000*.97-r.months.at(-1).debt+700);
  close(r.finalWealth,-r.initial+r.months.reduce((s,m)=>s+m.cash,0)+r.terminal);
});
test('At zero discount the NPV equals total net cash including terminal proceeds',()=>{
  const r=simulate(bare);close(r.npv,r.finalWealth);assert.equal(r.payback,4);
});
test('Zero occupancy still has fixed costs and break-even is undefined',()=>{
  const r=simulate({...bare,occupancy:0,insurance:500});assert.equal(r.breakEvenWeekly,null);close(r.months[0].cash,-500);assert.equal(r.payback,null);assert.ok(r.additionalFunding>0);
});
test('Break-even weekly rental makes first month free cash zero',()=>{
  const r=simulate(defaults),atBreakEven=simulate({...defaults,weekly:r.breakEvenWeekly});close(atBreakEven.months[0].cash,0);
});
test('Zero-financing principal does not charge financing fees',()=>{
  const r=simulate({...bare,financed:true,downPct:100,financingFees:1000});close(r.financingFees,0);close(r.principal,0);close(r.installment,0);
});
test('Bad inputs are rejected instead of silently changed',()=>{
  for(const bad of [{fleet:0},{fleet:1.5},{occupancy:101},{weekly:-1},{weekly:NaN},{horizon:0},{financed:'yes'},{monthlyRate:Infinity}])assert.throws(()=>validate(bad));
});
test('Stress assumptions reduce cash against the base without changing vehicle price',()=>{
  const base=simulate(),stress=simulate({...defaults,occupancy:78,stoppedDays:6,lossPct:8});assert.ok(stress.avgCash<base.avgCash);assert.equal(stress.initial,base.initial);
});
test('Annual discount uses compound monthly conversion',()=>{
  const r=simulate({...bare,horizon:1,discountAnnual:12});const d=Math.pow(1.12,1/12)-1;
  close(r.npv,-r.initial+(r.months[0].cash+r.terminal)/(1+d));
});
test('Payment formula returns zero on no debt and linear amortization at zero rate',()=>{assert.equal(payment(0,.01,48),0);assert.equal(payment(1200,0,12),100);});
test('Emergency reserve reduces additional outside funding; terminal reserve is not income',()=>{
  const r=simulate({...bare,occupancy:0,insurance:500,reserve:1000,horizon:3});
  close(r.additionalFunding,500);close(r.terminal,11000);close(r.finalWealth,-1500);
});
