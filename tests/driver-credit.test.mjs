import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/growth.js';import '../src/control.js';import '../src/driver.js';import '../src/operations.js';import '../src/coordination.js';import '../src/inspection.js';import '../src/program.js';import '../src/finance.js';
const S=globalThis.RodavoltSimulator,C=globalThis.RodavoltControl,M=globalThis.RodavoltOperations,K=globalThis.RodavoltCoordination,I=globalThis.RodavoltInspection,R=globalThis.RodavoltProgram,F=globalThis.RodavoltFinance;
const make=()=>{const baseline=S.freezePlan(S.defaults),ops=M.create(baseline);K.ensure(ops);I.ensure(ops);R.ensure(ops);F.ensure(ops);return {ops,baseline};};
const earn=(ops,...products)=>{for(const product of products)C.sale(ops.book,product,1,'driver');R.settle(ops,'credit');};
const actual=(ops,baseline)=>C.realized(ops.book,baseline).at(-1);
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);

test('one explicit action applies all available store credits to the own weekly rent without bank cash',()=>{
 const {ops,baseline}=make();earn(ops,'perfume','charger');
 // Profit already paid in cash is not eligible for another benefit.
 C.sale(ops.book,'cable',1,'driver');R.settle(ops,'payout');
 const before=actual(ops,baseline),entryCount=ops.book.entries.length,result=R.applyAvailableCredit(ops,'DRV-1','COB-4'),after=actual(ops,baseline);
 assert.deepEqual(result,{amount:94,remaining:956});
 assert.equal(ops.book.entries.length-entryCount,2);
 near(after.cash,before.cash);near(after.rentalRevenue-before.rentalRevenue,94);near(after.liabilities-before.liabilities,-94);
 assert.deepEqual(R.driverCredits(ops,'DRV-1').records.map(c=>c.applied),[57,37,0]);
 assert.equal(R.driverCredits(ops,'DRV-1').available,0);
});

test('application stops at the charge balance and preserves credit remainder for another week',()=>{
 const {ops}=make();earn(ops,'perfume','charger');
 ops.charges.push({id:'WEEK-SMALL',driverId:'DRV-1',amount:65,date:'2027-01-25',status:'open'});
 assert.deepEqual(R.applyAvailableCredit(ops,'DRV-1','WEEK-SMALL'),{amount:65,remaining:0});
 assert.equal(ops.charges.at(-1).status,'paid');
 assert.deepEqual(R.driverCredits(ops,'DRV-1').records.map(c=>c.applied),[57,8]);
 assert.equal(R.driverCredits(ops,'DRV-1').available,29);
 assert.deepEqual(R.applyAvailableCredit(ops,'DRV-1','COB-4'),{amount:29,remaining:1021});
});

test('another profile cannot apply the driver credits or use a foreign charge',()=>{
 const {ops}=make();earn(ops,'perfume');
 ops.charges.push({id:'CAMILA-WEEK',driverId:'DRV-2',amount:100,date:'2027-01-25',status:'open'});
 const before=JSON.stringify(ops);
 assert.throws(()=>R.applyAvailableCredit(ops,'DRV-2','COB-4'),/pertencer/);
 assert.throws(()=>R.applyAvailableCredit(ops,'DRV-1','CAMILA-WEEK'),/pertencer/);
 assert.throws(()=>R.applyAvailableCredit(ops,'DRV-1','MISSING'),/pertencer/);
 assert.equal(JSON.stringify(ops),before);
 assert.deepEqual(R.applyAvailableCredit(ops,'DRV-2','CAMILA-WEEK'),{amount:0,remaining:100});
 assert.equal(R.driverCredits(ops,'DRV-1').available,57);
});

test('resubmission does not duplicate applied rent, obligations or history',()=>{
 const {ops}=make();earn(ops,'perfume','charger');
 assert.deepEqual(R.applyAvailableCredit(ops,'DRV-1','COB-4'),{amount:94,remaining:956});
 const afterFirst=JSON.stringify(ops);
 assert.deepEqual(R.applyAvailableCredit(ops,'DRV-1','COB-4'),{amount:0,remaining:956});
 assert.equal(JSON.stringify(ops),afterFirst);
});

test('a paid charge consumes no additional credit, including after a full credit payment',()=>{
 const {ops}=make();earn(ops,'perfume','charger');
 const beforePaid=JSON.stringify(ops);
 assert.deepEqual(R.applyAvailableCredit(ops,'DRV-1','COB-1'),{amount:0,remaining:0});
 assert.equal(JSON.stringify(ops),beforePaid);
 ops.charges.push({id:'FULL-CREDIT',driverId:'DRV-1',amount:50,date:'2027-01-25',status:'open'});
 assert.deepEqual(R.applyAvailableCredit(ops,'DRV-1','FULL-CREDIT'),{amount:50,remaining:0});
 const afterFull=JSON.stringify(ops);
 assert.deepEqual(R.applyAvailableCredit(ops,'DRV-1','FULL-CREDIT'),{amount:0,remaining:0});
 assert.equal(JSON.stringify(ops),afterFull);
 assert.equal(R.driverCredits(ops,'DRV-1').available,44);
});

test('a cloned preview preserves the original and cents survive a partial credit balance',()=>{
 const {ops}=make();earn(ops,'perfume');
 ops.charges.push({id:'CENTS',driverId:'DRV-1',amount:20.13,date:'2027-01-25',status:'open'});
 const original=JSON.stringify(ops),preview=R.applyAvailableCredit(structuredClone(ops),'DRV-1','CENTS');
 assert.deepEqual(preview,{amount:20.13,remaining:0});
 assert.equal(JSON.stringify(ops),original);
 assert.deepEqual(R.applyAvailableCredit(ops,'DRV-1','CENTS'),preview);
 assert.equal(R.driverCredits(ops,'DRV-1').available,36.87);
});
