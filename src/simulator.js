/* Deterministic planning model. Amounts in BRL; no market data or tax advice. */
(function (scope) {
  'use strict';
  const defaults = Object.freeze({
    fleet: 1, price: 75000, financed: false, downPct: 35, monthlyRate: 1.6,
    term: 48, financingFees: 1200, setup: 1500, reserve: 6000, stockCapital: 300,
    weekly: 750, occupancy: 92, stoppedDays: 2, lossPct: 3,
    kmPerDay: 180, maintenanceKm: 0.10, tiresKm: 0.035,
    insurance: 350, annualTax: 3000, annualLicense: 250, tracker: 80,
    admin: 350, other: 80, taxPct: 6, storeDaily: 25, cogsPct: 50,
    commissionPct: 20, paymentFeePct: 2, storeLossPct: 2,
    horizon: 36, residualPct: 65, saleFeePct: 3, discountAnnual: 12,
    startYear: 2026, startMonth: 11
  });
  const ranges = {
    fleet:[1,1000,true], price:[1,10000000], downPct:[0,100], monthlyRate:[0,20],
    term:[1,360,true], financingFees:[0,1000000], setup:[0,1000000],
    reserve:[0,10000000], stockCapital:[0,1000000], weekly:[0,100000],
    occupancy:[0,100], stoppedDays:[0,28], lossPct:[0,100], kmPerDay:[0,2000],
    maintenanceKm:[0,100], tiresKm:[0,100], insurance:[0,100000],
    annualTax:[0,1000000], annualLicense:[0,1000000], tracker:[0,100000],
    admin:[0,1000000], other:[0,100000], taxPct:[0,100], storeDaily:[0,100000],
    cogsPct:[0,100], commissionPct:[0,100], paymentFeePct:[0,100],
    storeLossPct:[0,100], horizon:[1,120,true], residualPct:[0,100],
    saleFeePct:[0,100], discountAnnual:[0,100], startYear:[2020,2100,true],
    startMonth:[1,12,true]
  };
  function validate(input = {}) {
    const p = { ...defaults, ...input };
    for (const [key,[min,max,integer]] of Object.entries(ranges)) {
      if (typeof p[key] !== 'number' || !Number.isFinite(p[key]) || p[key] < min || p[key] > max || (integer && !Number.isInteger(p[key]))) {
        throw new RangeError(`Valor inválido: ${key} (${min} a ${max}${integer ? ', inteiro' : ''}).`);
      }
    }
    if (typeof p.financed !== 'boolean') throw new TypeError('financed deve ser booleano.');
    return p;
  }
  function payment(principal, rate, months) {
    if (principal === 0) return 0;
    if (rate === 0) return principal / months;
    return principal * rate / (1 - Math.pow(1 + rate, -months));
  }
  function simulate(input = {}) {
    const p = validate(input);
    const n = p.fleet;
    const principal = p.financed ? p.price * (1-p.downPct/100) * n : 0;
    const paidForCars = p.price*n-principal;
    // Financing fees are paid upfront; do not also finance or amortize them here.
    const financingFees = principal > 0 ? p.financingFees*n : 0;
    const initial = paidForCars + (p.setup+p.reserve+p.stockCapital)*n + financingFees;
    const installment = payment(principal,p.monthlyRate/100,p.term);
    const depreciation = p.price*n*(1-p.residualPct/100)/p.horizon;
    const monthlyDiscount = Math.pow(1+p.discountAnnual/100,1/12)-1;
    let debt = principal, accumulated = -initial, payback = null;
    const months = [];
    for (let i=0;i<p.horizon;i++) {
      const date = new Date(Date.UTC(p.startYear,p.startMonth-1+i,1));
      const days = new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+1,0)).getUTCDate();
      const rentedDays = Math.max(0,days-p.stoppedDays)*p.occupancy/100;
      const rentalBilled = p.weekly/7*rentedDays*n;
      const rentalLost = rentalBilled*p.lossPct/100;
      const rentalReceived = rentalBilled-rentalLost;
      const km = rentedDays*p.kmPerDay*n;
      const maintenance = km*p.maintenanceKm, tires = km*p.tiresKm;
      const fixed = (p.insurance+p.annualTax/12+p.annualLicense/12+p.tracker+p.other)*n+p.admin;
      const storeGross = rentedDays*p.storeDaily*n;
      const cogs=storeGross*p.cogsPct/100, commission=storeGross*p.commissionPct/100;
      const storeFees=storeGross*p.paymentFeePct/100, storeLoss=storeGross*p.storeLossPct/100;
      // Simplified turnover tax: gross billed rent + gross shop sales, not net shop margin.
      const tax=(rentalBilled+storeGross)*p.taxPct/100;
      const storeContribution=storeGross-cogs-commission-storeFees-storeLoss;
      const operatingCash=rentalReceived+storeContribution-fixed-maintenance-tires-tax;
      const interest = debt>1e-7 ? debt*p.monthlyRate/100 : 0;
      const debtPayment = debt>1e-7 && i<p.term ? Math.min(installment,debt+interest) : 0;
      const amortization = Math.max(0,debtPayment-interest);
      debt=Math.max(0,debt-amortization);
      const cash=operatingCash-debtPayment;
      const accountingResult=operatingCash-interest-depreciation;
      accumulated+=cash;
      if (payback===null && accumulated>=0) payback=i+1;
      months.push({month:i+1,label:`${String(date.getUTCMonth()+1).padStart(2,'0')}/${date.getUTCFullYear()}`,
        days,rentedDays,rentalBilled,rentalLost,rentalReceived,km,maintenance,tires,fixed,
        storeGross,cogs,commission,storeFees,storeLoss,storeContribution,tax,operatingCash,
        interest,amortization,debtPayment,debt,cash,accountingResult,accumulated});
    }
    const mean = key => months.reduce((sum,m)=>sum+m[key],0)/months.length;
    const saleGross=p.price*n*p.residualPct/100;
    // A model assumption: all cash reserve and opening shop stock recover at book value.
    const terminal=saleGross*(1-p.saleFeePct/100)-debt+(p.reserve+p.stockCapital)*n;
    const finalWealth=months.at(-1).accumulated+terminal;
    const npv=-initial+months.reduce((sum,m)=>sum+m.cash/Math.pow(1+monthlyDiscount,m.month),0)+terminal/Math.pow(1+monthlyDiscount,p.horizon);
    const first=months[0];
    const rentalCoefficient=first.rentedDays/7*n*(1-p.lossPct/100-p.taxPct/100);
    const storeAfterTax=first.storeContribution-first.storeGross*p.taxPct/100;
    const fixedAndVariable=first.fixed+first.maintenance+first.tires+first.debtPayment;
    const breakEvenWeekly=rentalCoefficient>0 ? Math.max(0,(fixedAndVariable-storeAfterTax)/rentalCoefficient) : null;
    const warnings=[];
    if(p.occupancy===0) warnings.push('Sem dias alugados: não há receita operacional.');
    if(mean('cash')<0) warnings.push('O cenário consome caixa, em média, após a dívida.');
    if(mean('accountingResult')<0) warnings.push('O resultado estimado é negativo após depreciação e juros.');
    if(npv<0) warnings.push('O VPL fica abaixo de zero para a taxa de desconto informada.');
    if(p.cogsPct+p.commissionPct+p.paymentFeePct+p.storeLossPct+p.taxPct>=100 && p.storeDaily>0) warnings.push('A lojinha não tem margem positiva nas premissas informadas.');
    return {p,initial,principal,installment,financingFees,depreciation,months,
      avgCash:mean('cash'),avgResult:mean('accountingResult'),avgRental:mean('rentalReceived'),
      avgStore:mean('storeContribution'),avgTax:mean('tax'),avgOperating:mean('operatingCash'),
      avgDebt:mean('debtPayment'),payback,terminal,finalWealth,npv,breakEvenWeekly,
      minAccumulated:Math.min(-initial,...months.map(m=>m.accumulated)),
      additionalFunding:Math.max(0,-Math.min(0,...months.reduce((a,m)=>[...a,(a.at(-1)||0)+m.cash],[]))-p.reserve*n),
      roiPct:initial>0?finalWealth/initial*100:null,warnings};
  }
  const api={ defaults,validate,payment,simulate };
  scope.RodavoltSimulator=api;
})(globalThis);
