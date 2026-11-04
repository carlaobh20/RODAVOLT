/* Cash timing for investment decisions. Accrual, Price loans and protected
   purchases remain in the shared growth engine; no operational ledger writes. */
(function(scope){
 'use strict';
 const S=scope.RodavoltSimulator;
 const defaults=Object.freeze({annualTaxMonth:1,annualLicenseMonth:2,serviceIntervalKm:10000,serviceCost:430,tiresIntervalKm:45000,tiresCost:1125,temporaryDelayPct:0,delayMonths:1,incidentMonth:0,incidentDeductible:0,incidentStoppedDays:0,discountAnnualPct:12,resalePct:55});
 const bounds={annualTaxMonth:[1,12],annualLicenseMonth:[1,12],serviceIntervalKm:[1,1000000],serviceCost:[0,1e7],tiresIntervalKm:[1,1000000],tiresCost:[0,1e7],temporaryDelayPct:[0,100],delayMonths:[1,12],incidentMonth:[0,120],incidentDeductible:[0,1e8],incidentStoppedDays:[0,31],discountAnnualPct:[0,100],resalePct:[0,100]};
 function validate(input={}){
  const p={...defaults,...input};
  for(const [key,[min,max]] of Object.entries(bounds))if(!Number.isFinite(p[key])||p[key]<min||p[key]>max)throw new RangeError('Revise '+key+'.');
  for(const key of ['annualTaxMonth','annualLicenseMonth','serviceIntervalKm','tiresIntervalKm','delayMonths','incidentMonth','incidentStoppedDays'])if(!Number.isInteger(p[key]))throw new RangeError('Revise '+key+': informe número inteiro.');
  return p;
 }
 function calendarMonth(p,m){return (p.startMonth+m-2)%12+1;}
 function run(p,t){
  const kmByCar=new Map(),details=new Map();let receivables=0;
  const result=S.simulate(p,null,{
   extraStoppedDays:month=>month===t.incidentMonth?t.incidentStoppedDays:0,
   expense:month=>month===t.incidentMonth?t.incidentDeductible:0,
   cashAdjustment(m){
    const due=[],factor=m.costFactor;
    const add=(kind,amount)=>{if(amount)due.push({kind,amount});};
    add('IPVA',calendarMonth(p,m.month)===t.annualTaxMonth?p.annualTax*m.operatingFleet*factor:0);
    add('Licenciamento',calendarMonth(p,m.month)===t.annualLicenseMonth?p.annualLicense*m.operatingFleet*factor:0);
    let service=0,tires=0;
    for(const car of m.cars){
     const before=kmByCar.get(car.id)||0,after=before+(m.operatingFleet?m.km/m.operatingFleet:0);
     service+=(Math.floor((after+1e-7)/t.serviceIntervalKm)-Math.floor((before+1e-7)/t.serviceIntervalKm))*t.serviceCost*factor;
     tires+=(Math.floor((after+1e-7)/t.tiresIntervalKm)-Math.floor((before+1e-7)/t.tiresIntervalKm))*t.tiresCost*factor;
     kmByCar.set(car.id,after);
    }
    add('Revisão por km',service);add('Pneus por km',tires);
    const accrualProvision=(p.annualTax+p.annualLicense)*m.operatingFleet*factor/12+m.km*p.maintenanceKm*factor+m.tires;
    const actualLumpy=due.reduce((sum,e)=>sum+e.amount,0),delayedOut=m.rentalReceived*t.temporaryDelayPct/100,delayedIn=details.get(m.month-t.delayMonths)?.delayedOut||0;
    receivables+=delayedOut-delayedIn;
    details.set(m.month,{accrualProvision,actualLumpy,expenses:due,delayedOut,delayedIn,receivables,incident:m.exceptionalExpense});
    return accrualProvision-actualLumpy-delayedOut+delayedIn;
   }
  });
  return {result,details};
 }
 function analyze(input={},timingInput={}){
  const p=S.validate({...input,horizon:36,initialFleet:1,targetFleet:1,reinvest:false}),t=validate(timingInput),{result:economic,details}=run(p,t),normal=S.simulate(p),events=[];
  const acquired=economic.initial.cars.length===1;
  const rows=economic.months.map((m,i)=>{
   const detail=details.get(m.month),cashMovement=m.cashAfterDebt+m.cashAdjustment;
   const row={month:m.month,label:m.label,openingCash:m.openingCash,contribution:m.contribution,withdrawal:m.withdrawal,extra:m.extra,economicResult:m.result,...detail,incidentLostRent:Math.max(0,normal.months[i].rentalReceived-m.rentalReceived),cashMovement,cash:m.cash,freeCash:m.available,reserve:m.reserve,belowReserve:m.available<-1e-7,economic:m};
   for(const event of detail.expenses)events.push({month:m.month,...event});
   if(detail.incident||row.incidentLostRent)events.push({month:m.month,kind:'Sinistro: franquia e aluguel não recebido',amount:detail.incident+row.incidentLostRent});
   return row;
  });
  const quote=economic.initialQuote,initialNeed=p.companySetup+p.centralStockCapital+quote.cashCost+p.reserveFixed+p.reservePerCar;
  const noShop=(p.storeDaily||p.stockCapital||p.centralStockCapital)?analyze({...p,storeDaily:0,stockCapital:0,centralStockCapital:0},t):null;
  const resale=acquired?quote.price*t.resalePct/100:0,terminalDebt=rows.at(-1).economic.debt,rate=Math.pow(1+t.discountAnnualPct/100,1/12)-1;
  let npv=-initialNeed,cumulative=0,payback=null;
  for(const row of rows){
   // Additional funding is financing, not revenue; cash yield on surplus capital
   // is excluded so excess initial cash cannot make the vehicle look profitable.
   const investmentFlow=row.cashMovement-row.extra-row.economic.cashYield;
   npv+=investmentFlow/Math.pow(1+rate,row.month);cumulative+=investmentFlow;
   if(payback===null&&cumulative>=initialNeed)payback=row.month;
  }
  npv+=(resale-terminalDebt+p.reserveFixed+p.reservePerCar)/Math.pow(1+rate,rows.length);
  return {params:p,timing:t,economic,acquired,rows,weeks:weekly13(p,rows,economic.initial.cash),events,minCash:economic.minCash,firstBelowReserve:rows.find(r=>r.belowReserve)?.month??null,initialNeed,capitalGap:Math.max(0,initialNeed-p.initialCapital),monthlyFree:acquired?rows.reduce((sum,r)=>sum+r.cashMovement-r.extra-r.economic.cashYield,0)/rows.length:null,weeklyBreakEven:acquired?breakEven(p,t):null,resale,npv:acquired?npv:null,payback:acquired?payback:null,withoutShop:noShop};
 }
 function weekly13(p,rows,opening){
  const start=Date.UTC(p.startYear,p.startMonth-1,1),out=[];let cash=opening;
  for(let week=0;week<13;week++){
   let change=0;
   for(let day=0;day<7;day++){
    const date=new Date(start+(week*7+day)*86400000),index=(date.getUTCFullYear()-p.startYear)*12+date.getUTCMonth()-(p.startMonth-1),r=rows[index];if(!r)continue;
    const days=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+1,0)).getUTCDate();
    change+=(r.cashMovement+r.actualLumpy+r.incident)/days;
    if(date.getUTCDate()===days)change+=r.contribution-r.actualLumpy-r.incident-r.economic.capex-r.extra-r.withdrawal;
   }
   cash+=change;out.push({week:week+1,from:new Date(start+week*7*86400000).toISOString().slice(0,10),cash,change});
  }
  return out;
 }
 function breakEven(p,t){
  const one={...p,horizon:1,storeDaily:0,stockCapital:0,centralStockCapital:0,reinvest:false,ownerDrawPct:0,amortStrategy:'off',cashYieldAnnual:0};
  const balance=weekly=>{const {result}=run({...one,weekly},t),m=result.months[0];return m.cashAfterDebt+m.cashAdjustment;};
  let lo=0,hi=1e6;if(balance(0)>=0)return 0;if(balance(hi)<0)return null;
  for(let n=0;n<34;n++){const mid=(lo+hi)/2;if(balance(mid)>=0)hi=mid;else lo=mid;}
  return Math.ceil(hi*100)/100;
 }
 function compare(quotes,base,timing={}){
  if(!Array.isArray(quotes)||quotes.length>3)throw new RangeError('Compare até três cotações.');
  return quotes.map(q=>{const r=analyze({...base,...q.params},{...timing,...q.timing,resalePct:q.resalePct??timing.resalePct??defaults.resalePct}),alone=r.withoutShop||r;return {name:q.name,acquired:r.acquired,capitalGap:r.capitalGap,initialNeed:r.initialNeed,breakEven:alone.weeklyBreakEven,freeWithoutShop:alone.monthlyFree,freeWithShop:r.monthlyFree,worstCash:r.minCash,payback:r.payback,npv:r.npv,reserveFailure:r.firstBelowReserve};});
 }
 scope.RodavoltReality={defaults,validate,analyze,compare};
})(globalThis);
