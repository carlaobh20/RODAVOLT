/* Demonstration-only ledger. No production records, bank operations or external services. */
(function(scope){
 'use strict';const S=scope.RodavoltSimulator,copy=x=>structuredClone(x);
 function createDemo(plan){
  const p=plan.params,loan=plan.projection.installment,initial=copy(plan.projection.initial),entries=[];
  const products=[{id:'perfume',name:'Perfume de bolso · 30 ml',category:'Perfumaria',price:89,cost:32,central:18,kit:4,min:2},{id:'charger',name:'Carregador veicular USB-C · 30W',category:'Acessórios',price:59,cost:22,central:24,kit:5,min:2},{id:'cable',name:'Cabo USB-C reforçado · 1 m',category:'Acessórios',price:29,cost:9,central:30,kit:6,min:3}];
  for(let m=1;m<=3;m++){
   const add=(category,amount,source)=>entries.push({id:`DEMO-${entries.length+1}`,month:m,category,amount,vehicle:'RV-001',source,status:'confirmed'});
   add('rent',[3360,3520,3150][m-1],'Cobranças semanais · recebimentos demonstrativos');add('shop',[240,320,280][m-1],'Acerto de vendas demonstrativo');add('shopCost',[120,160,140][m-1],'Custo da mercadoria vendida');add('commission',[120,160,140][m-1],'Lucro integral da loja pago ao motorista · histórico ilustrativo');
   add('opex',350,'Seguro · exemplo');add('opex',500,'Administração · empresa');add('opex',80,'Rastreador · RV-001');add('opex',[280,180,980][m-1],'Ordem de serviço · exemplo');add('tax',[216,230.4,205.8][m-1],'Tributo ilustrativo');
   const debt=initial.cars[0]?.debt||0,prior=entries.filter(e=>e.month<m&&e.category==='principal').reduce((s,e)=>s+e.amount,0),interest=Math.max(0,debt-prior)*p.monthlyRate/100,paid=Math.min(loan,Math.max(0,debt-prior)+interest);
   add('interest',interest,'Juros da parcela demonstrativa');add('principal',Math.max(0,paid-interest),'Principal da parcela demonstrativa');
  }
  return {schema:2,initial,centralInventoryOpening:p.centralStockCapital||0,entries,contract:{weekly:p.weekly,profitSharePct:100},calendar:{startYear:p.startYear,startMonth:p.startMonth},valuationDepreciation:p.depreciationPct,stockCapital:p.stockCapital,acquisitions:[],audit:[],products,sales:[],requests:[],receipts:[],journeys:[],tickets:[],inspections:[],baselineId:plan.id};
 }
 function realized(state,plan){
  let cash=state.initial.cash,profitTotal=state.initial.profitTotal;const rows=[],depRate=(state.valuationDepreciation??.8)/100;
  const calendar=copy(state.calendar||plan.params);
  for(let month=1;month<=Math.max(0,...state.entries.filter(e=>e.status==='confirmed').map(e=>e.month));month++){
   const records=state.entries.filter(e=>e.month===month&&e.status==='confirmed');
   const sum=k=>records.filter(e=>e.category===k).reduce((s,e)=>s+e.amount,0),cashSum=k=>records.filter(e=>e.category===k&&e.cashEffect!==false).reduce((s,e)=>s+e.amount,0),openingCash=cash,rentalReceived=cashSum('rent'),rentalRevenue=sum('rent')-sum('rentAdjustment'),storeGross=sum('shop'),storeReceived=cashSum('shop')+cashSum('shopSettlement'),otherOperatingRevenue=sum('incidentRecovery'),opex=sum('opex'),debtService=sum('interest')+sum('principal'),capex=sum('capex'),contribution=sum('contribution'),depositReceived=cashSum('depositIn'),depositReturned=cashSum('depositReturn');
   cash+=rentalReceived+storeReceived+cashSum('incidentRecovery')+cashSum('contribution')+depositReceived+cashSum('shopHold')-cashSum('shopRefund')-cashSum('shopCost')-cashSum('commission')-cashSum('tax')-cashSum('opex')-cashSum('interest')-cashSum('principal')-cashSum('capex')-depositReturned-cashSum('rentalRefund')-cashSum('driverCreditPayout');
   const initial=state.initial.cars.map(c=>({...c,stockCapital:state.stockCapital??300}));
   const acquired=(state.acquisitions||[]).filter(c=>c.bought<=month),all=[...initial,...acquired];let depreciation=0;
   const cars=all.map(c=>{const age=Math.max(0,month-(c.bought||0)),repaid=state.entries.filter(e=>e.status==='confirmed'&&e.category==='principal'&&e.vehicle===c.id&&e.month<=month).reduce((s,e)=>s+e.amount,0);if(age>0)depreciation+=c.value*Math.pow(1-depRate,age-1)*depRate;return {...c,age:c.age+age,value:c.value*Math.pow(1-depRate,age),debt:Math.max(0,c.debt-repaid)};});
   const assets=cars.reduce((s,c)=>s+c.value,0),inventory=cars.reduce((s,c)=>s+(c.stockCapital??state.stockCapital??300),0)+(state.centralInventoryOpening||0)+state.entries.filter(e=>e.month<=month&&e.status==='confirmed').reduce((s,e)=>s+(e.inventoryDelta||0),0),debt=cars.reduce((s,c)=>s+c.debt,0),liabilities=(state.initial.liabilities||0)+state.entries.filter(e=>e.month<=month&&e.status==='confirmed').reduce((s,e)=>s+(e.liabilityDelta||0),0),result=rentalRevenue+storeGross+otherOperatingRevenue-sum('shopCost')-sum('commission')-sum('tax')-opex-sum('interest')-depreciation;profitTotal+=result;
   rows.push({month,label:S.label(calendar,month),calendar:copy(calendar),hasRecords:records.length>0,openingCash,rentalReceived,rentalRevenue,storeGross,storeReceived,otherOperatingRevenue,depositReceived,depositReturned,liabilities,opex,debtService,capex,contribution,cash,debt,fleet:cars.length,assets,inventory,equity:cash+assets+inventory-debt-liabilities,result,sourceIds:records.map(r=>r.id),status:records.length?'demo':'unrecorded',snapshot:{month,calendar:copy(calendar),cash,cars,inventory,liabilities,capital:state.initial.capital+state.entries.filter(e=>e.month<=month&&e.status==='confirmed'&&e.category==='contribution').reduce((s,e)=>s+e.amount,0),distributed:0,profitTotal}});
  }return rows;
 }
 function log(state,action,entity,details){state.audit.unshift({id:`EV-${state.audit.length+1}`,at:new Date().toISOString(),action,entity,details,actor:'Usuário da demonstração'});}
 function movementDate(state,e){if(e.date)return e.date;const total=state.calendar.startYear*12+state.calendar.startMonth-1+e.month-1;return `${Math.floor(total/12)}-${String(total%12+1).padStart(2,'0')}-25`;}
 function depositEntries(state,driverId){return state.entries.filter(e=>e.status==='confirmed'&&e.driverId===driverId&&['depositIn','depositReturn'].includes(e.category));}
 function depositBalance(state,driverId,asOf){return depositEntries(state,driverId).filter(e=>!asOf||movementDate(state,e)<=asOf).reduce((sum,e)=>sum+(e.category==='depositIn'?1:-1)*Math.round(e.amount*100),0)/100;}
 function validateDepositRefund(state,driverId,amount,date){
  const daily=new Map();for(const e of depositEntries(state,driverId)){const key=movementDate(state,e);daily.set(key,(daily.get(key)||0)+(e.category==='depositIn'?1:-1)*Math.round(e.amount*100));}
  daily.set(date,(daily.get(date)||0)-Math.round(amount*100));let balance=0;for(const [,change]of [...daily].sort(([a],[b])=>a.localeCompare(b))){balance+=change;if(balance<0)throw new RangeError('A devolução não pode exceder a caução disponível deste motorista na data informada, incluindo devoluções futuras já confirmadas.');}
 }
 function sale(state,productId,qty,method){const p=state.products.find(p=>p.id===productId);if(!p||!Number.isInteger(qty)||qty<1||qty>p.kit)throw new RangeError('Quantidade indisponível no kit.');if(!['driver','company'].includes(method))throw new RangeError('Forma de recebimento inválida.');p.kit-=qty;const gross=S.round(qty*p.price),cost=S.round(p.cost*qty),driverProfit=S.round(Math.max(0,gross-cost)),s={id:`VEN-${state.sales.length+1}`,productId,productName:p.name,unitPrice:p.price,profitSharePct:100,qty,gross,cost,driverProfit,commission:driverProfit,method,remittance:method==='driver'?S.round(gross-driverProfit):0,payableCommission:method==='company'?driverProfit:0};state.sales.push(s);log(state,'Venda registrada',s.id,`${qty} × ${p.name}; lucro integral do motorista; ${method==='driver'?'dinheiro com motorista':'pagamento à empresa'}.`);return s;}
 function transfer(state,productId,qty){const p=state.products.find(p=>p.id===productId);if(!p||!Number.isInteger(qty)||qty<1||qty>p.central)throw new RangeError('Estoque central insuficiente.');p.central-=qty;p.kit+=qty;log(state,'Transferência confirmada',p.id,`${qty} unidades: central → kit RV-001.`);}
 function addEntry(state,input){if(!['rent','rentAdjustment','rentalRefund','driverCreditPayout','incidentRecovery','shopHold','shopRefund','shop','shopCost','commission','opex','tax','interest','principal','contribution','capex','depositIn','depositReturn','shopSettlement'].includes(input.category)||!Number.isInteger(input.month)||input.month<1||input.month>120||!Number.isFinite(input.amount)||input.amount<0||!String(input.source||'').trim())throw new RangeError('Preencha categoria, mês, valor e origem.');if(input.liabilityDelta!==undefined&&!Number.isFinite(input.liabilityDelta))throw new RangeError('Variação da obrigação financeira inválida.');const liabilitySign={depositIn:1,depositReturn:-1,rentAdjustment:1,rentalRefund:-1,driverCreditPayout:-1,shopHold:1,shopRefund:-1},liabilityDelta=liabilitySign[input.category]?liabilitySign[input.category]*input.amount:input.liabilityDelta;if(Object.hasOwn(liabilitySign,input.category)&&input.liabilityDelta!==undefined&&Math.abs(input.liabilityDelta-liabilityDelta)>1e-7)throw new RangeError('A categoria precisa alterar a obrigação no mesmo valor conferido.');const e={...input,...(input.category==='rentAdjustment'?{cashEffect:false}:{}),...(liabilityDelta!==undefined?{liabilityDelta}:{}),id:`MAN-${state.entries.length+1}`,vehicle:input.vehicle||'RV-001',status:'confirmed'};state.entries.push(e);log(state,'Lançamento demonstrativo incluído',e.id,e.source);return e;}
 // A reversal is a new, linked movement. Originals and reconciliation evidence
 // stay in the book; only this helper can create a negative accounting amount.
 function reverseEntry(state,id,input={}){
  const original=state.entries.find(e=>e.id===id),reference=String(input.reference||'').trim().slice(0,120),source=String(input.source||'').trim().slice(0,500);
  if(!original||original.status!=='confirmed'||original.reversalOf||!Number.isFinite(original.amount)||original.amount<=0)throw new RangeError('Escolha um lançamento original confirmado para estornar.');
  if(['depositIn','depositReturn','capex','contribution'].includes(original.category))throw new RangeError('Esta categoria exige seu fluxo específico de devolução ou ajuste.');
  if(!reference||!source)throw new RangeError('Informe a referência e o motivo do estorno.');
  const amount=input.amount===undefined?original.amount:Math.round(Number(input.amount)*100)/100;
  if(!Number.isFinite(amount)||amount<=0)throw new RangeError('Informe valor positivo para o estorno.');
  const existing=state.entries.find(e=>e.reversalOf===id&&e.reversalReference===reference);if(existing){if(Math.abs(existing.amount+amount)<.005)return false;throw new RangeError('Esta referência já estornou outro valor deste lançamento.');}
  const reversed=state.entries.filter(e=>e.reversalOf===id).reduce((sum,e)=>sum+Math.round(-e.amount*100),0);
  if(reversed+Math.round(amount*100)>Math.round(original.amount*100))throw new RangeError('Os estornos não podem ultrapassar o lançamento original.');
  const date=String(input.date||'');if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(new Date(date+'T12:00:00Z').getTime())||new Date(date+'T12:00:00Z').toISOString().slice(0,10)!==date)throw new RangeError('Informe uma data válida para o estorno.');
  const month=(Number(date.slice(0,4))-state.calendar.startYear)*12+Number(date.slice(5,7))-state.calendar.startMonth+1;
  if(month<1||month>120||date<movementDate(state,original))throw new RangeError('O estorno precisa ocorrer no calendário da operação e depois do lançamento original.');
  const factor=amount/original.amount,e={...original,id:'MAN-'+(state.entries.length+1),amount:-amount,month,date,source,reversalOf:original.id,reversalReference:reference,at:new Date().toISOString(),...(input.cashEffect===false?{cashEffect:false}:{}),...(original.inventoryDelta!==undefined?{inventoryDelta:-Math.round(original.inventoryDelta*factor*100)/100}:{}),...(original.liabilityDelta!==undefined?{liabilityDelta:-Math.round(original.liabilityDelta*factor*100)/100}:{})};
  delete e.financeTransactionId;delete e.titleId;state.entries.push(e);log(state,'Estorno demonstrativo conferido',e.id,e.reversalOf+' · '+source);return e;
 }
 function acquire(state,input){
  const p=S.validate(input);const month=input.purchaseMonth;if(!Number.isInteger(month)||month<1||month>3)throw new RangeError('Escolha um mês de demonstração de 1 a 3.');
  const count=state.initial.cars.length+(state.acquisitions||[]).length,id='RV-'+String(count+1).padStart(3,'0'),debt=p.financed?p.price*(1-p.downPct/100):0;
  const car={id,bought:month,age:0,value:p.price,debt,rate:p.monthlyRate/100,installment:S.payment(debt,p.monthlyRate/100,p.term),stockCapital:p.stockCapital};
  (state.acquisitions||(state.acquisitions=[])).push(car);
  addEntry(state,{month,category:'capex',amount:p.price-debt+p.stockCapital,vehicle:id,source:'Aquisição demonstrativa '+id+' · entrada e estoque inicial'});
  if(p.setup+p.financingFees>0)addEntry(state,{month,category:'opex',amount:p.setup+(debt>0?p.financingFees:0),vehicle:id,source:'Preparação e tarifas demonstrativas de '+id});
  log(state,'Aquisição operacional de exemplo registrada',id,'Ativo e dívida criados; parcela futura só entra quando registrada.');return car;
 }
 scope.RodavoltControl={createDemo,realized,log,sale,transfer,addEntry,reverseEntry,acquire,movementDate,depositBalance,validateDepositRefund};
})(globalThis);
