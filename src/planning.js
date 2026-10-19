/* Presentation-independent planning reports; the UI does not recalculate finance. */
(function(scope){
 'use strict';const S=scope.RodavoltSimulator,T=scope.RodavoltStrategy;
 const defaults=Object.freeze({...S.defaults,maintenanceMonthly:180,maintenanceKm:0,stockCapital:292,centralStockCapital:1374,storeDaily:15,storeRewardBasis:'margin',driverProfitPct:100,reinvest:false,targetFleet:1});
 const columns=[['label','Período'],['fleet','Frota'],['income','Entradas'],['costs','Despesas'],['debtService','Parcela'],['scheduledPrincipal','Amort. programada'],['extra','Amort. extra'],['totalPrincipal','Amort. total'],['debt','Saldo da dívida'],['interest','Juros da dívida'],['cashYield','Juros do caixa'],['profitTax','IR estimado'],['result','Lucro líquido'],['contribution','Aportes'],['capex','Compras'],['withdrawal','Retiradas'],['cash','Caixa final'],['purchases','Carros comprados']];
 function row(m){return {...m,income:m.rentalReceived+m.storeGross,costs:m.opex+m.storeCogs+m.commission+m.storeFees+m.storeLoss+m.revenueTax,paid:m.opex+m.storeCogs+m.commission+m.storeFees+m.storeLoss+m.revenueTax+m.profitTax+m.debtService,totalPrincipal:m.scheduledPrincipal+m.extra};}
 function initial(result){const i=result.initial,cars=i.cars,assets=cars.reduce((s,c)=>s+c.value,0),debt=cars.reduce((s,c)=>s+c.debt,0),inventory=i.inventory??cars.length*result.p.stockCapital+result.p.centralStockCapital,capex=result.events.filter(e=>e.type==='purchase'&&e.month===0).reduce((s,e)=>s+e.amount,0);return {label:'Hoje · posição inicial',month:0,fleet:cars.length,income:null,costs:null,debtService:null,scheduledPrincipal:null,extra:null,totalPrincipal:null,debt,interest:null,cashYield:null,profitTax:null,result:i.profitTotal,contribution:i.capital,capex,withdrawal:0,cash:i.cash,purchases:cars.length,reserve:result.p.reserveFixed+result.p.reservePerCar*cars.length+(i.liabilities||0),available:i.cash-result.p.reserveFixed-result.p.reservePerCar*cars.length-(i.liabilities||0),equity:i.cash+assets+inventory-debt-(i.liabilities||0),liabilities:i.liabilities||0,assets,inventory,capital:i.capital,distributed:0};}
 function annual(result){const flow=['income','costs','debtService','scheduledPrincipal','extra','totalPrincipal','interest','cashYield','profitTax','result','contribution','capex','withdrawal','purchases'],stocks=['fleet','debt','cash','reserve','available','equity','assets','inventory','capital','distributed'],groups=new Map();for(const m of result.months.map(row)){const year=m.label.split('/')[1];if(!groups.has(year))groups.set(year,{label:year,year,monthsCount:0,month:m.month,...Object.fromEntries(flow.map(k=>[k,0]))});const y=groups.get(year);y.monthsCount++;for(const k of flow)y[k]+=m[k];for(const k of stocks)y[k]=m[k];y.month=m.month;}return [...groups.values()];}
 function report(params){const result=S.simulate(params),d=T.decision(params,result),f=result.final,first=result.months[0],initialRow=initial(result),economicRecovered=Math.min(f.capital,Math.max(0,f.profitTotal));return {result,decision:d,initial:initialRow,monthly:result.months.map(row),annual:annual(result),economicRecovered,economicRecoveryPct:f.capital>0?economicRecovered/f.capital*100:null,capitalNotEconomicallyRecovered:Math.max(0,f.capital-economicRecovered),cashRecovered:f.distributed,totalInterest:result.months.reduce((s,m)=>s+m.interest,0),freeCash:first.cashAfterDebt,monthProfit:first.result,monthReturnPct:first.capital>0?first.result/first.capital*100:null,capacityNow:Math.max(0,Math.floor((params.initialCapital-params.companySetup-params.centralStockCapital-params.reserveFixed)/(result.purchaseCash+params.reservePerCar))),acquisitionGap:Math.max(0,params.companySetup+params.centralStockCapital+params.initialFleet*result.purchaseCash+params.reserveFixed+params.reservePerCar*params.initialFleet-params.initialCapital)};}
 function decisionStress(input){
  const p=S.validate(input),up=key=>Math.min(S.limits[key][1],p[key]*1.25),cases=[
   ['Plano atual',{}],
   ['Aluguel 10% menor',{weekly:p.weekly*.9}],
   ['Ocupação 70%',{occupancy:Math.min(p.occupancy,70)}],
   ['Custos do carro até 25% maiores',{insurance:up('insurance'),maintenanceMonthly:up('maintenanceMonthly'),maintenanceKm:up('maintenanceKm'),tiresKm:up('tiresKm'),annualTax:up('annualTax'),annualLicense:up('annualLicense'),tracker:up('tracker'),washing:up('washing'),other:up('other')}],
   ['Loja sem vendas',{storeDaily:0}]
  ];
  return cases.map(([name,change])=>{const r=S.simulate({...p,...change});return {name,acquired:r.initial.cars.length===p.initialFleet,firstCashAfterDebt:r.months[0].cashAfterDebt,minAvailable:Math.min(r.initial.cash-r.p.reserveFixed-r.p.reservePerCar*r.initial.cars.length,...r.months.map(m=>m.available)),endingCash:r.final.cash,endingEquity:r.final.equity};});
 }
 function breakEvenWeekly(input){
  const p=S.validate(input),firstMonth={...p,horizon:1,reinvest:false},base=S.simulate(firstMonth);if(base.initial.cars.length!==p.initialFleet||p.initialFleet===0)return null;
  const cashAt=weekly=>S.simulate({...firstMonth,weekly}).months[0].cashAfterDebt;
  if(cashAt(0)>=0)return 0;
  if(cashAt(1e6)<0)return null;
  let low=0,high=1e6;for(let i=0;i<36;i++){const middle=(low+high)/2;if(cashAt(middle)>=0)high=middle;else low=middle;}
  return Math.ceil(high*100)/100;
 }
 function bridge(m){return [['Caixa de abertura',m.openingCash],['Aluguel recebido',m.rentalReceived],['Vendas brutas da loja',m.storeGross],['Mercadoria, comissão, taxas e perdas',-(m.storeCogs+m.commission+m.storeFees+m.storeLoss)],['Despesas operacionais',-m.opex],['Tributos sobre faturamento',-m.revenueTax],['IR sobre resultado positivo',-m.profitTax],['Parcela (juros + principal)',-m.debtService],['Rendimento do caixa',m.cashYield],['Aportes',m.contribution],['Compras e preparação',-m.capex],['Amortização extra',-m.extra],['Retiradas',-m.withdrawal],['Caixa de fechamento',m.cash]];}
 function csvCell(v){let s=String(v??'');if(typeof v==='string'&&/^[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
 function csv(rows){return '\ufeff'+[columns.map(([,label])=>csvCell(label)).join(';'),...rows.map(r=>columns.map(([key])=>csvCell(typeof r[key]==='number'?r[key].toFixed(2).replace('.',','):r[key])).join(';'))].join('\r\n');}
 scope.RodavoltPlanning={defaults,columns,row,initial,annual,report,decisionStress,breakEvenWeekly,bridge,csv};
})(globalThis);
