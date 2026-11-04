/* Read-only operational overview. Financial values come from the ledger engines. */
(function(scope){
 'use strict';
 function overview(ops,baseline){
  const M=scope.RodavoltOperations,F=scope.RodavoltFinance,H=scope.RodavoltShop,K=scope.RodavoltCoordination,I=scope.RodavoltInspection;
  const s=M.summary(ops,baseline),finance=F.summary(ops,baseline),cars=M.vehicles(ops),active=ops.drivers.filter(d=>d.stage==='active'),lowStock=[];
  for(const d of active)for(const p of H.inventory(ops,d.id).products)if(p.available<=2)lowStock.push({driverId:d.id,driverName:d.name,productId:p.id,name:p.name,available:p.available,central:p.central});
  const documents=K.contracts(ops),inspections=I.ensure(ops).records;
  const steps=[
   {title:'Decidir a compra',detail:'Compare propostas, reserva e crescimento.',action:'go-simulator',done:false},
   {title:'Cadastrar o carro',detail:'Valor pago, placa, seguro e cuidados.',action:'go-fleet',done:cars.length>0},
   {title:'Escolher o motorista',detail:'Cadastro, análise humana e caução.',action:'go-drivers',done:ops.drivers.some(d=>d.docs)},
   {title:'Conferir o contrato',detail:'Minuta, assinatura externa e devolução do PDF.',action:'go-lawyer',done:documents.some(c=>c.status==='signed')},
   {title:'Entregar com vistoria',detail:'Fotos, quilometragem e aprovação.',action:'go-fleet',done:inspections.some(i=>i.status==='approved'&&i.type==='delivery')},
   {title:'Acompanhar a semana',detail:'Aluguel, vendas, estoque e compromissos.',action:'go-finance',done:active.length>0}
  ];
  return {summary:s,finance,cars,active,lowStock,steps,freeCash:finance.cash-(finance.actual?.liabilities||0),liabilities:finance.actual?.liabilities||0,contractReturns:(ops.journey?.contractReturns||[]).filter(r=>r.status==='awaiting_review'),inspections:inspections.filter(i=>i.status==='submitted'),requests:ops.requests.filter(r=>r.status==='open'||r.status==='in_progress')};
 }
 scope.RodavoltCockpit={overview};
})(globalThis);
