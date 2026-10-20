/* v2: growth, per-vehicle debt, reserve, extra principal and immutable plans.
   Rebuilt from the legacy simularCrescimentoEmpresarial; month 0 has no operation. */
(function(scope){
  'use strict';
  const defaults=Object.freeze({initialCapital:90000,companySetup:1500,initialFleet:1,targetFleet:10,
    price:110000,financed:true,downPct:40,monthlyRate:1.4,term:48,financingFees:0,setup:1000,stockCapital:300,centralStockCapital:0,
    reserveFixed:10000,reservePerCar:5000,weekly:1050,occupancy:92,stoppedDays:2,lossPct:3,
    kmPerDay:150,energyPriceKWh:1.2,consumptionKWh100Km:15,chargingLossPct:10,companyChargePct:0,maintenanceKm:.043,maintenanceMonthly:0,tiresKm:.025,insurance:350,annualTax:3000,annualLicense:250,
    tracker:80,washing:80,other:0,admin:500,staffThreshold:5,staffCost:2200,
    revenueTaxPct:6,profitTaxPct:0,storeDaily:20,cogsPct:50,commissionPct:20,storeRewardBasis:'gross',driverProfitPct:100,paymentFeePct:2,storeLossPct:2,
    depreciationPct:.8,cashYieldAnnual:0,monthlyContribution:0,oneOffContribution:0,contributionMonth:12,
    reinvest:true,purchaseTriggerCash:0,growthPurchaseMode:'same',growthPrice:0,growthDownPct:40,growthMonthlyRate:1.4,growthTerm:48,ownerDrawPct:0,maxPurchasesPerMonth:1,amortStrategy:'off',extraAmort:500,extraMonth:12,
    priority:'growth',annualRentIncrease:0,annualCostInflation:0,horizon:60,startYear:2026,startMonth:11});
  const limits={initialCapital:[0,1e9],companySetup:[0,1e8],initialFleet:[0,1000,1],targetFleet:[1,1000,1],price:[1,1e7],downPct:[0,100],monthlyRate:[0,20],term:[1,360,1],financingFees:[0,1e7],setup:[0,1e7],stockCapital:[0,1e7],centralStockCapital:[0,1e9],reserveFixed:[0,1e9],reservePerCar:[0,1e8],weekly:[0,1e6],occupancy:[0,100],stoppedDays:[0,28],lossPct:[0,100],kmPerDay:[0,2000],energyPriceKWh:[0,100],consumptionKWh100Km:[.1,100],chargingLossPct:[0,50],companyChargePct:[0,100],maintenanceKm:[0,100],maintenanceMonthly:[0,1e6],tiresKm:[0,100],insurance:[0,1e6],annualTax:[0,1e7],annualLicense:[0,1e7],tracker:[0,1e6],washing:[0,1e6],other:[0,1e6],admin:[0,1e7],staffThreshold:[1,1000,1],staffCost:[0,1e7],revenueTaxPct:[0,100],profitTaxPct:[0,100],storeDaily:[0,1e6],cogsPct:[0,100],commissionPct:[0,100],driverProfitPct:[0,100],paymentFeePct:[0,100],storeLossPct:[0,100],depreciationPct:[0,20],cashYieldAnnual:[0,100],monthlyContribution:[0,1e9],oneOffContribution:[0,1e9],contributionMonth:[1,120,1],ownerDrawPct:[0,100],maxPurchasesPerMonth:[1,100,1],purchaseTriggerCash:[0,1e9],growthPrice:[0,1e7],growthDownPct:[0,100],growthMonthlyRate:[0,20],growthTerm:[1,360,1],extraAmort:[0,1e9],extraMonth:[1,120,1],annualRentIncrease:[0,100],annualCostInflation:[0,100],horizon:[1,120,1],startYear:[2020,2100,1],startMonth:[1,12,1]};
  function validate(input={}){
    const p={...defaults,...input};
    for(const [k,[min,max,int]] of Object.entries(limits))if(typeof p[k]!=='number'||!Number.isFinite(p[k])||p[k]<min||p[k]>max||(int&&!Number.isInteger(p[k])))throw new RangeError(`Revise ${k}: ${min} a ${max}${int?' (inteiro)':''}.`);
    for(const k of ['financed','reinvest'])if(typeof p[k]!=='boolean')throw new TypeError(`Revise ${k}.`);
    if(!['off','monthly','sixMonths','once','afterGoal'].includes(p.amortStrategy))throw new RangeError('Estratégia de amortização inválida.');
    if(!['gross','margin'].includes(p.storeRewardBasis))throw new RangeError('Base do benefício da loja inválida.');
    if(!['growth','debt'].includes(p.priority))throw new RangeError('Prioridade inválida.');if(!['same','cash','financed'].includes(p.growthPurchaseMode))throw new RangeError('Forma de compra dos próximos carros inválida.');
    if(p.initialFleet>p.targetFleet)throw new RangeError('A frota inicial supera a meta.');return p;
  }
  const round=x=>Math.round((x+Number.EPSILON)*100)/100;
  const payment=(principal,rate,term)=>principal===0?0:rate===0?principal/term:principal*rate/(1-Math.pow(1+rate,-term));
  function purchaseQuote(input,phase='initial'){
    const p=validate(input),next=phase==='growth';if(!['initial','growth'].includes(phase))throw new RangeError('Etapa de compra inválida.');
    const mode=next?p.growthPurchaseMode:'same',financed=mode==='cash'?false:mode==='financed'?true:p.financed;
    const price=next&&p.growthPrice>0?p.growthPrice:p.price,downPct=next&&mode==='financed'?p.growthDownPct:p.downPct,monthlyRate=next&&mode==='financed'?p.growthMonthlyRate:p.monthlyRate,term=next&&mode==='financed'?p.growthTerm:p.term;
    const debt=financed?price*(1-downPct/100):0,entry=price-debt,fees=debt>0?p.financingFees:0;
    return {mode:financed?'financed':'cash',price,entry,debt,fees,setup:p.setup,stock:p.stockCapital,cashCost:entry+p.setup+p.stockCapital+fees,monthlyRate:financed?monthlyRate:0,term:financed?term:0,installment:payment(debt,monthlyRate/100,term)};
  }
  function label(p,month){const d=new Date(Date.UTC(p.startYear,p.startMonth-1+month-1,1));return `${String(d.getUTCMonth()+1).padStart(2,'0')}/${d.getUTCFullYear()}`;}
  function assertCalendar(params,calendar){if(!calendar||!Number.isInteger(calendar.startYear)||(!Number.isInteger(calendar.startMonth)||calendar.startMonth<1||calendar.startMonth>12))throw new RangeError('Fechamento sem calendário: gere novamente a posição do livro antes de reestimar.');if(params.startYear!==calendar.startYear||params.startMonth!==calendar.startMonth)throw new RangeError('Calendários diferentes. Alinhe o mês e o ano inicial do cenário ao livro da operação ('+label(calendar,1)+') antes de comparar ou reestimar.');return true;}
  function simulate(input={},seed=null){
    const p=validate(input),cars=[],events=[],rows=[];
    const initialQuote=purchaseQuote(p),growthQuote=purchaseQuote(p,'growth'),purchaseCash=initialQuote.cashCost,floor=n=>p.reserveFixed+p.reservePerCar*n+liabilities;
    let inventoryAdjustment=0,liabilities=0;
    let cash=p.initialCapital-p.companySetup-p.centralStockCapital,capital=p.initialCapital,distributed=0,profitTotal=-p.companySetup,start=1,carSequence=0;
    const buy=(month,quote)=>{const id=`RV-${String(++carSequence).padStart(3,'0')}`,cashBefore=cash;cars.push({id,bought:month,age:0,value:quote.price,debt:quote.debt,rate:quote.monthlyRate/100,installment:quote.installment});cash-=quote.cashCost;if(month===0)profitTotal-=quote.setup+quote.fees;events.push({month,type:'purchase',id,amount:quote.cashCost,cashBefore,cashAfter:cash,entry:quote.entry,newDebt:quote.debt,installment:quote.installment,mode:quote.mode,reserveAfter:floor(cars.length),reason:'Compra simulada; operação no próximo mês.'});return quote.cashCost;};
    if(seed){
      assertCalendar(p,seed.calendar);
      if(!Number.isInteger(seed.month)||seed.month<0||seed.month>=p.horizon||!Number.isFinite(seed.cash)||!Array.isArray(seed.cars)||!Number.isFinite(seed.capital)||!Number.isFinite(seed.distributed||0)||!Number.isFinite(seed.profitTotal||0))throw new RangeError('Fechamento incompleto para reestimar.');
      for(const c of seed.cars)for(const k of ['age','value','debt','installment'])if(!Number.isFinite(c[k])||c[k]<0)throw new RangeError('Ativo do fechamento inválido.');
      cars.push(...structuredClone(seed.cars));carSequence=Math.max(cars.length,...cars.map(c=>Number(String(c.id).replace(/\D/g,''))||0));cash=seed.cash;capital=seed.capital;distributed=seed.distributed||0;profitTotal=seed.profitTotal||0;start=seed.month+1;liabilities=seed.liabilities||0;if(!Number.isFinite(liabilities)||liabilities<0)throw new RangeError('Obrigações do fechamento inválidas.');if(Number.isFinite(seed.inventory))inventoryAdjustment=seed.inventory-cars.length*p.stockCapital-p.centralStockCapital;
    }else for(let i=0;i<p.initialFleet;i++){if(cash-purchaseCash<floor(cars.length+1)-1e-7){events.push({month:0,type:'blocked',reason:'Capital insuficiente para compra inicial preservando reserva.',amount:Math.max(0,purchaseCash+floor(cars.length+1)-cash)});break;}buy(0,initialQuote);}
    const snapshot=month=>({month,calendar:{startYear:p.startYear,startMonth:p.startMonth},cash,cars:structuredClone(cars),capital,distributed,profitTotal,liabilities,inventory:cars.length*p.stockCapital+p.centralStockCapital+inventoryAdjustment}),initial=snapshot(start-1);
    let targetMonth=cars.length>=p.targetFleet?start-1:null,totalExtra=0;const milestones=[];
    for(let month=start;month<=p.horizon;month++){
      const openingCash=cash,operatingFleet=cars.length,d=new Date(Date.UTC(p.startYear,p.startMonth-1+month-1,1));
      const days=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate(),rentableDays=Math.max(0,days-p.stoppedDays)*p.occupancy/100;
      const rentFactor=Math.pow(1+p.annualRentIncrease/100,Math.floor((month-1)/12)),costFactor=Math.pow(1+p.annualCostInflation/100,Math.floor((month-1)/12));
      const contribution=p.monthlyContribution+(month===p.contributionMonth?p.oneOffContribution:0);cash+=contribution;capital+=contribution;
      const cashYield=Math.max(0,openingCash-liabilities)*(Math.pow(1+p.cashYieldAnnual/100,1/12)-1);cash+=cashYield;
      const rentalBilled=operatingFleet*rentableDays*p.weekly/7*rentFactor,rentalLoss=rentalBilled*p.lossPct/100,rentalReceived=rentalBilled-rentalLoss;
      const km=rentableDays*p.kmPerDay*operatingFleet,chargingKWh=km*p.consumptionKWh100Km/100/(1-p.chargingLossPct/100),chargingTotal=chargingKWh*p.energyPriceKWh*costFactor,chargingCompany=chargingTotal*p.companyChargePct/100,chargingDriver=chargingTotal-chargingCompany,maintenance=(km*p.maintenanceKm+operatingFleet*p.maintenanceMonthly)*costFactor,tires=km*p.tiresKm*costFactor;
      const fixedVehicle=operatingFleet*(p.insurance+p.annualTax/12+p.annualLicense/12+p.tracker+p.washing+p.other)*costFactor;
      const corporate=(p.admin+(operatingFleet>=p.staffThreshold?p.staffCost:0))*costFactor;
      const storeGross=operatingFleet*rentableDays*p.storeDaily,storeCogs=storeGross*p.cogsPct/100,storeFees=storeGross*p.paymentFeePct/100,storeLoss=storeGross*p.storeLossPct/100,storeTax=storeGross*p.revenueTaxPct/100,driverMargin=Math.max(0,storeGross-storeCogs-storeFees-storeLoss-storeTax),commission=p.storeRewardBasis==='margin'?driverMargin*p.driverProfitPct/100:storeGross*p.commissionPct/100,storeMargin=storeGross-storeCogs-commission-storeFees-storeLoss;
      const revenueTax=(rentalBilled+storeGross)*p.revenueTaxPct/100,opex=fixedVehicle+corporate+maintenance+tires+chargingCompany;
      let interest=0,scheduledPrincipal=0,debtService=0,depreciation=0;
      for(const c of cars){const i=c.debt*(c.rate??initialQuote.monthlyRate/100),part=c.debt>1e-7?Math.min(c.installment,c.debt+i):0,amort=Math.max(0,part-i);c.debt=Math.max(0,c.debt-amort);interest+=i;scheduledPrincipal+=amort;debtService+=part;const dep=c.value*p.depreciationPct/100;c.value-=dep;c.age++;depreciation+=dep;}
      const resultBeforeTax=rentalReceived+storeMargin-opex-revenueTax+cashYield-interest-depreciation;
      let profitTax=Math.max(0,resultBeforeTax)*p.profitTaxPct/100,result=resultBeforeTax-profitTax;profitTotal+=result;
      let operatingCash=rentalReceived+storeMargin-opex-revenueTax-profitTax,cashAfterDebt=operatingCash-debtService+cashYield;cash+=operatingCash-debtService;
      const withdrawal=Math.min(Math.max(0,cash-floor(cars.length)),Math.max(0,cashAfterDebt)*p.ownerDrawPct/100);cash-=withdrawal;distributed+=withdrawal;
      let purchases=0,capex=0,extra=0,purchaseRule=null;
      function grow(){
        const requiredCash=growthQuote.cashCost+floor(cars.length+1),cashAtDecision=cash;
        purchaseRule={enabled:p.reinvest,trigger:p.purchaseTriggerCash,cashAtDecision,requiredCash,carCashCost:growthQuote.cashCost,status:'off'};
        if(!p.reinvest)return;
        if(cars.length>=p.targetFleet){purchaseRule.status='target';return;}
        if(cash+1e-7<p.purchaseTriggerCash){purchaseRule.status='threshold';return;}
        if(cash+1e-7<requiredCash){purchaseRule.status='reserve';return;}
        while(cars.length<p.targetFleet&&purchases<p.maxPurchasesPerMonth&&cash+1e-7>=p.purchaseTriggerCash&&cash-growthQuote.cashCost>=floor(cars.length+1)-1e-7){capex+=buy(month,growthQuote);purchases++;}
        purchaseRule.status='purchased';
      }
      function amortize(){const desired=p.amortStrategy==='monthly'?p.extraAmort:p.amortStrategy==='sixMonths'&&month%6===0?p.extraAmort:p.amortStrategy==='once'&&month===p.extraMonth?p.extraAmort:p.amortStrategy==='afterGoal'&&cars.length>=p.targetFleet?Infinity:0;let budget=Math.min(desired,Math.max(0,cash-floor(cars.length)));for(const c of cars){const paid=Math.min(c.debt,budget);c.debt-=paid;cash-=paid;budget-=paid;extra+=paid;if(budget<=0)break;}}
      if(p.priority==='debt'){amortize();grow();}else{grow();amortize();}totalExtra+=extra;
      const acquisitionExpense=purchases*(growthQuote.setup+growthQuote.fees);
      const adjustedTax=Math.max(0,resultBeforeTax-acquisitionExpense)*p.profitTaxPct/100,taxRelease=profitTax-adjustedTax;
      cash+=taxRelease;profitTax=adjustedTax;result-=acquisitionExpense-taxRelease;profitTotal-=acquisitionExpense-taxRelease;operatingCash+=taxRelease;cashAfterDebt+=taxRelease;
      if(extra)events.push({month,type:'extra',amount:extra,reason:'Amortização extra limitada à reserva e à dívida.'});
      if(purchases)milestones.push({month,label:label(p,month),fleet:cars.length,purchases,cash,reserve:floor(cars.length)});
      if(targetMonth===null&&cars.length>=p.targetFleet)targetMonth=month;
      const debt=cars.reduce((s,c)=>s+c.debt,0),assets=cars.reduce((s,c)=>s+c.value,0),inventory=cars.length*p.stockCapital+p.centralStockCapital+inventoryAdjustment,equity=cash+assets+inventory-debt-liabilities;
      rows.push({month,label:label(p,month),openingCash,contribution,operatingFleet,fleet:cars.length,rentableDays,km,chargingKWh,chargingTotal,chargingCompany,chargingDriver,rentalBilled,rentalLoss,rentalReceived,storeGross,storeCogs,commission,storeFees,storeLoss,storeMargin,opex,fixedVehicle,corporate,maintenance,tires,revenueTax,profitTax,interest,scheduledPrincipal,debtService,depreciation,acquisitionExpense,result,profitTotal,operatingCash,cashYield,cashAfterDebt,withdrawal,purchases,purchaseRule,capex,extra,cash,available:cash-floor(cars.length),reserve:floor(cars.length),debt,assets,inventory,liabilities,equity,capital,distributed,bridgeError:cash-(openingCash+contribution+cashYield+operatingCash-debtService-withdrawal-capex-extra),snapshot:snapshot(month)});
    }
    const final=rows.at(-1),minCash=Math.min(initial.cash,...rows.map(r=>r.cash)),warnings=[];
    if(events.some(e=>e.type==='blocked'))warnings.push('A aquisição inicial não cabe no capital preservando a reserva.');
    if(rows.some(r=>r.available<0))warnings.push('Há meses abaixo da reserva; não são inventados aportes.');
    if(minCash<0)warnings.push('Há caixa negativo: reveja como financiar a operação.');
    if(targetMonth===null)warnings.push(`Meta de ${p.targetFleet} carros não atingida em ${p.horizon} meses.`);
    return {p,initial,months:rows,final,events,milestones,targetMonth,totalExtra,purchaseCash,initialQuote,growthQuote,installment:initialQuote.installment,minCash,warnings};
  }
  function freezePlan(params,id='PLANO-001',createdAt=new Date().toISOString()){const copy=structuredClone(validate(params));return {id,version:2,createdAt,params:copy,projection:structuredClone(simulate(copy)),status:'frozen'};}
  function compare(plan,actual,month){const projected=plan.projection.months.find(m=>m.month===month),observed=actual.find(m=>m.month===month),identified=observed||actual.find(row=>row.calendar||row.snapshot?.calendar),calendar=identified?.calendar||identified?.snapshot?.calendar;if(calendar)assertCalendar(plan.params,calendar);else if(observed?.label&&observed.label!==label(plan.params,month))throw new RangeError('Calendários diferentes. Alinhe a referência ao calendário do livro antes de comparar.');return ['rentalReceived','storeGross','opex','debtService','capex','cash','fleet','debt','equity'].map(key=>{const base=projected?.[key]??null,value=observed?.hasRecords===false?null:observed?.[key]??null;return {key,projected:base,actual:value,delta:base===null||value===null?null:value-base,percent:base===null||value===null||base===0?null:(value-base)/Math.abs(base)*100};});}
  function aggregateYears(result){const flow=['rentalReceived','storeGross','storeMargin','opex','revenueTax','profitTax','debtService','interest','scheduledPrincipal','extra','capex','contribution','withdrawal','result','purchases'];const groups=new Map();for(const m of result.months){const year=m.label.split('/')[1];if(!groups.has(year))groups.set(year,{year,...Object.fromEntries(flow.map(k=>[k,0]))});const g=groups.get(year);for(const k of flow)g[k]+=m[k];for(const k of ['cash','debt','equity','fleet'])g[k]=m[k];}return [...groups.values()];}
  scope.RodavoltSimulator={aggregateYears,defaults,limits,validate,round,payment,purchaseQuote,label,assertCalendar,simulate,freezePlan,compare};
})(globalThis);
