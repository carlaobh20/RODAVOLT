import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/growth.js';
import '../src/control.js';
import '../src/driver.js';
import '../src/operations.js';
import '../src/coordination.js';
import '../src/inspection.js';
import '../src/program.js';
import '../src/finance.js';

const S=globalThis.RodavoltSimulator,C=globalThis.RodavoltControl,M=globalThis.RodavoltOperations,K=globalThis.RodavoltCoordination,I=globalThis.RodavoltInspection,R=globalThis.RodavoltProgram,F=globalThis.RodavoltFinance;
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const make=()=>{const baseline=S.freezePlan({...S.defaults,reinvest:false}),ops=M.create(baseline);K.ensure(ops);I.ensure(ops);R.ensure(ops);F.ensure(ops);return {baseline,ops};};
const deposit=(ops,driverId,amount,date,reference)=>R.recordDeposit(ops,driverId,{amount,date,reference,accountId:'BANK-1'});
const refund=(ops,driverId,amount,date,reference)=>R.refundDeposit(ops,driverId,{amount,date,reference,accountId:'BANK-1'});
const refundTitle=(ops,amount=1500)=>F.createTitle(ops,{type:'payable',description:'Devolução conferida de caução',counterparty:'Camila · exemplo',due:'2027-01-25',amount,category:'depositReturn',vehicle:'RV-001',driverId:'DRV-2'});
function signedAdmission(ops){
 const id='DRV-2';
 R.reviewCandidate(ops,id,{checks:Object.fromEntries(R.criteria.map(([key])=>[key,true])),approved:true,note:'Conferência fictícia dos critérios.'});
 const contract=K.createContract(ops,{modelId:'rental',driverId:id,vehicleId:'RV-001',weekly:1050,deposit:1500,kmLimit:1500,startDate:'2027-01-25',endDate:'2028-01-24',conditions:'Piloto demonstrativo.'});
 K.reviewContract(ops,contract.id,Object.fromEntries(K.reviewItems.map(([key])=>[key,true])));
 K.queueContract(ops,contract.id);K.markAwaiting(ops,contract.id);K.recordSignature(ops,contract.id,'driver');K.recordSignature(ops,contract.id,'company');
}

test('a future deposit is excluded from the dated guarantee and does not release the earlier admission',()=>{
 const {ops,baseline}=make();signedAdmission(ops);
 const before=F.summary(ops,baseline);
 deposit(ops,'DRV-2',1500,'2027-02-01','FUTURE-DEPOSIT');
 const current=R.depositSummary(ops,'DRV-2'),february=R.depositSummary(ops,'DRV-2','2027-02-01');
 assert.equal(current.asOf,K.operatingDate);assert.equal(current.balance,0);assert.equal(current.remaining,1500);assert.equal(current.entries.length,0);
 assert.equal(february.balance,1500);assert.equal(february.entries.length,1);
 assert.equal(R.canDeliver(ops,'DRV-2').ok,false);
 const january=F.summary(ops,baseline),future=F.summary(ops,baseline,{asOf:'2027-02-28'});
 near(january.cash,before.cash);near(january.actual.liabilities,before.actual.liabilities);
 near(future.cash-before.cash,1500);near(future.actual.liabilities-before.actual.liabilities,1500);
});

test('a program refund cannot precede its receipt and a rejection changes no cash, liability or reference',()=>{
 const {ops}=make();deposit(ops,'DRV-2',1500,'2027-02-01','FUTURE');
 const before=JSON.stringify(ops);
 assert.throws(()=>refund(ops,'DRV-2',1500,'2027-01-25','TOO-EARLY'),/na data informada/);
 assert.equal(JSON.stringify(ops),before);
 refund(ops,'DRV-2',1500,'2027-02-01','SAME-DAY');
 assert.equal(R.depositSummary(ops,'DRV-2','2027-02-01').balance,0);
});

test('a treasury refund title validates the effective payment date before changing its state',()=>{
 const {ops}=make();deposit(ops,'DRV-2',1500,'2027-02-01','FUTURE');
 const title=refundTitle(ops),before=JSON.stringify(ops);
 assert.throws(()=>F.pay(ops,title.id,{date:'2027-01-25',accountId:'BANK-1'}),/na data informada/);
 assert.equal(JSON.stringify(ops),before);assert.equal(title.status,'open');
 F.pay(ops,title.id,{date:'2027-02-01',accountId:'BANK-1'});
 assert.equal(title.status,'settled');assert.equal(R.depositSummary(ops,'DRV-2','2027-02-01').balance,0);
});

test('posting a bank refund also refuses a receipt from after the statement date',()=>{
 const {ops}=make();deposit(ops,'DRV-2',123.45,'2027-02-01','FUTURE');
 const tx=F.addTransaction(ops,{accountId:'BANK-1',direction:'out',amount:123.45,date:'2027-01-25',reference:'REFUND-BEFORE-RECEIPT',description:'Devolução de caução · exemplo'}),before=JSON.stringify(ops);
 assert.throws(()=>F.postStatement(ops,tx.id,{category:'depositReturn',vehicle:'RV-001',driverId:'DRV-2'}),/na data informada/);
 assert.equal(JSON.stringify(ops),before);
});

test('an earlier refund cannot spend a guarantee already committed by a future confirmed refund',()=>{
 const {ops,baseline}=make();deposit(ops,'DRV-2',1500,'2027-01-25','RECEIPT');
 refund(ops,'DRV-2',1000,'2027-02-01','FUTURE-REFUND');
 const before=JSON.stringify(ops);
 assert.throws(()=>refund(ops,'DRV-2',500.01,'2027-01-26','OVER-RESERVE'),/devoluções futuras/);
 assert.equal(JSON.stringify(ops),before);
 refund(ops,'DRV-2',500,'2027-01-26','AVAILABLE-REMAINDER');
 assert.equal(R.depositSummary(ops,'DRV-2','2027-01-25').balance,1500);
 assert.equal(R.depositSummary(ops,'DRV-2','2027-01-26').balance,1000);
 assert.equal(R.depositSummary(ops,'DRV-2','2027-02-01').balance,0);
 const january=F.summary(ops,baseline),february=F.summary(ops,baseline,{asOf:'2027-02-28'});
 near(january.actual.liabilities,1000);near(february.actual.liabilities,0);near(february.cash-january.cash,-1000);
});

test('dated guarantee balances stay separate by driver and preserve exact cents',()=>{
 const {ops}=make();deposit(ops,'DRV-1',20.13,'2027-01-25','DRV1');deposit(ops,'DRV-2',20.13,'2027-02-01','DRV2');
 const before=JSON.stringify(ops);
 assert.throws(()=>refund(ops,'DRV-2',.01,'2027-01-25','NO-OWN-MONEY'),/disponível deste motorista/);
 assert.equal(JSON.stringify(ops),before);
 refund(ops,'DRV-1',20.13,'2027-01-25','OWN-MONEY');
 assert.equal(R.depositSummary(ops,'DRV-1').balance,0);assert.equal(R.depositSummary(ops,'DRV-2').balance,0);
 assert.equal(R.depositSummary(ops,'DRV-2','2027-02-01').balance,20.13);
});

function sparseBook(baseline){const book=C.createDemo(baseline);book.entries=[];C.addEntry(book,{month:1,category:'rent',amount:0,source:'Primeiro período registrado'});C.addEntry(book,{month:3,category:'rent',amount:0,source:'Terceiro período registrado'});return book;}

test('an unrecorded intermediate month preserves valuation and depreciation without inventing observed amounts',()=>{
 const baseline=S.freezePlan({...S.defaults,reinvest:false}),book=sparseBook(baseline),withZero=structuredClone(book);
 C.addEntry(withZero,{month:2,category:'rent',amount:0,source:'Zero explicitamente conferido'});
 const sparse=C.realized(book,baseline),complete=C.realized(withZero,baseline),missing=sparse[1],last=sparse.at(-1);
 assert.deepEqual(sparse.map(row=>row.month),[1,2,3]);assert.equal(missing.hasRecords,false);assert.equal(missing.status,'unrecorded');assert.deepEqual(missing.sourceIds,[]);
 assert.equal(missing.rentalReceived,0);assert.ok(missing.result<0);
 near(last.snapshot.profitTotal,complete.at(-1).snapshot.profitTotal);near(last.equity,complete.at(-1).equity);
 near(last.equity-last.snapshot.capital,last.snapshot.profitTotal);
 assert.ok(S.compare(baseline,sparse,2).every(row=>row.actual===null&&row.delta===null&&row.percent===null));
 assert.equal(S.compare(baseline,complete,2).find(row=>row.key==='rentalReceived').actual,0);
});

test('reforecast inherits the complete accumulated depreciation across a gap in observed movements',()=>{
 const baseline=S.freezePlan({...S.defaults,reinvest:false}),book=sparseBook(baseline),actual=C.realized(book,baseline).at(-1),revision=S.simulate(baseline.params,actual.snapshot);
 near(revision.initial.profitTotal,actual.snapshot.profitTotal);near(revision.initial.cash,actual.cash);
 near(revision.months[0].equity+revision.months[0].distributed-revision.months[0].capital,revision.months[0].profitTotal);
 assert.equal(revision.months[0].month,4);assert.equal(revision.months[0].label,'02/2027');
});

test('comparison rejects a plan with a different initial month or year without changing either source',()=>{
 const {baseline,ops}=make(),actual=C.realized(ops.book,baseline),before=JSON.stringify({baseline,book:ops.book});
 for(const change of [{startMonth:1},{startYear:2027}]){
  const different=S.freezePlan({...baseline.params,...change});
  assert.throws(()=>S.compare(different,actual,1),/Calendários diferentes/);
 }
 assert.equal(JSON.stringify({baseline,book:ops.book}),before);
 assert.equal(S.compare(baseline,actual,1).find(row=>row.key==='rentalReceived').actual,3360);
});

test('reforecast rejects a changed calendar and an unidentified snapshot instead of shifting the past',()=>{
 const {baseline,ops}=make(),snapshot=C.realized(ops.book,baseline).at(-1).snapshot,before=JSON.stringify(snapshot);
 assert.throws(()=>S.simulate({...baseline.params,startMonth:1,startYear:2027},snapshot),/Calendários diferentes/);
 const unidentified=structuredClone(snapshot);delete unidentified.calendar;
 assert.throws(()=>S.simulate(baseline.params,unidentified),/Fechamento sem calendário/);
 assert.equal(JSON.stringify(snapshot),before);
 const same=S.simulate(baseline.params,snapshot);assert.equal(same.months[0].label,'02/2027');
 assert.deepEqual(same.initial.calendar,{startYear:2026,startMonth:11});
});
