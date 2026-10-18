/* Demonstration-only custody, combo receipt and manually checked company Pix orders.
   No bank, QR payload, customer checkout or authentication is connected here. */
(function(scope){
 'use strict';
 const C=scope.RodavoltControl,M=scope.RodavoltOperations;
 const now=()=>new Date().toISOString(),copy=x=>structuredClone(x),round=n=>Math.round((n+Number.EPSILON)*100)/100;
 const total=(list,key)=>list.reduce((sum,item)=>sum+Math.round(item[key]*100),0)/100;
 function product(ops,id){const p=ops.book.products.find(p=>p.id===id);if(!p)throw new RangeError('Produto não encontrado.');return p;}
 function quantity(value,zero=false){if(!Number.isInteger(value)||value<(zero?0:1)||value>100000)throw new RangeError('Confira a quantidade de produtos.');return value;}
 function binding(ops,driverId,vehicleId){const d=M.driver(ops,driverId);if(d.stage!=='active'||!d.vehicleId||vehicleId&&vehicleId!==d.vehicleId)throw new RangeError('O combo e a venda precisam do motorista e do carro em uso.');return d.vehicleId;}
 function reserved(shop,driverId,productId){return shop.orders.filter(o=>o.driverId===driverId&&o.status==='awaiting_payment').reduce((sum,o)=>sum+o.lines.filter(l=>l.productId===productId).reduce((n,l)=>n+l.qty,0),0);}
 function ensure(ops){
  if(!ops.shop){ops.shop={schema:1,kits:{'DRV-1':{vehicleId:ops.drivers.find(d=>d.id==='DRV-1')?.vehicleId||'RV-001',quantities:Object.fromEntries(ops.book.products.map(p=>[p.id,p.kit||0]))}},combos:[],orders:[],events:[]};}
  const s=ops.shop;s.kits||={};s.combos||=[];s.orders||=[];s.events||=[];
  // Existing sessions and old manual controls used a single aggregate kit. Only its
  // unambiguous difference is imported into the original driver's custody.
  const changes=[];
  for(const p of ops.book.products){const allocated=Object.values(s.kits).reduce((sum,k)=>sum+(k.quantities[p.id]||0),0),delta=(p.kit||0)-allocated;if(delta){const legacy=s.kits['DRV-1']?.quantities[p.id]||0;if(legacy+delta<reserved(s,'DRV-1',p.id))throw new RangeError('O estoque legado conflita com os produtos reservados. Confira a loja antes de continuar.');changes.push([p.id,delta]);}}
  if(changes.length){s.kits['DRV-1']||={vehicleId:'RV-001',quantities:{}};for(const [id,delta] of changes)s.kits['DRV-1'].quantities[id]=(s.kits['DRV-1'].quantities[id]||0)+delta;}
  return s;
 }
 function audit(ops,action,detail){const s=ops.shop;s.events.unshift({id:'LOJA-EV-'+(s.events.length+1),at:now(),action,detail});M.log(ops,action,detail);}
 function kitFor(s,driverId,vehicleId){return s.kits[driverId]||(s.kits[driverId]={vehicleId,quantities:{}});}
 function normalizeLines(ops,lines,zero=false){if(!Array.isArray(lines)||!lines.length)throw new RangeError('Escolha pelo menos um produto.');const result=[];for(const input of lines){const p=product(ops,input.productId);if(result.some(l=>l.productId===p.id))throw new RangeError('Cada produto deve aparecer uma vez no combo ou pedido.');result.push({productId:p.id,qty:quantity(input.qty,zero)});}return result;}
 function syncProduct(ops,s,id){product(ops,id).kit=Object.values(s.kits).reduce((sum,k)=>sum+(k.quantities[id]||0),0);}
 function reconcileRequest(ops,requestId){
  if(!requestId)return;
  const request=ops.requests.find(r=>r.id===requestId);if(!request||request.type!=='stock')return;
  const driverId=request.driverId||'DRV-1',combos=ops.shop.combos.filter(c=>c.requestId===requestId&&c.driverId===driverId&&c.lines.some(l=>l.productId===request.productId)),lines=combos.flatMap(c=>c.lines.filter(l=>l.productId===request.productId)),receivedQty=lines.reduce((sum,l)=>sum+l.received,0),pendingQty=lines.reduce((sum,l)=>sum+l.pending,0),remainingQty=Math.max(0,request.qty-receivedQty);
  // Derive the request from custody records every time. Retrying a receipt or
  // resolving a discrepancy never adds the same accepted units a second time.
  Object.assign(request,{comboIds:combos.map(c=>c.id),receivedQty,remainingQty,remaining:remainingQty,status:remainingQty===0?'delivered':pendingQty>0?'in_progress':'open'});
  request.reply=remainingQty===0?'Recebidos '+receivedQty+' de '+request.qty+' produtos pedidos. Reposição concluída.':'Recebidos '+receivedQty+' de '+request.qty+' produtos pedidos. '+(remainingQty===1?'Falta 1 produto.':'Faltam '+remainingQty+' produtos.')+(pendingQty>0?' '+pendingQty+' em trânsito ou aguardando conferência.':' A equipe precisa enviar o restante.');
  return request;
 }
 function sendCombo(ops,input){
  const vehicleId=binding(ops,input.driverId,input.vehicleId),lines=normalizeLines(ops,input.lines),requestId=input.requestId||null;
  if(requestId){const request=ops.requests.find(r=>r.id===requestId);if(!request||request.type!=='stock'||!['open','in_progress'].includes(request.status))throw new RangeError('Escolha uma solicitação de reposição ainda aberta.');if((request.driverId||'DRV-1')!==input.driverId)throw new RangeError('O combo precisa ir para o motorista que pediu a reposição.');if(!lines.some(l=>l.productId===request.productId))throw new RangeError('Inclua no combo o produto pedido na solicitação.');quantity(request.qty);}
  for(const line of lines)if(line.qty>product(ops,line.productId).central)throw new RangeError('Estoque central insuficiente para enviar o combo.');
  const s=ensure(ops),combo={id:'COMBO-'+(s.combos.length+1),driverId:input.driverId,vehicleId,...(requestId?{requestId}:{}),status:'sent',sentAt:now(),note:String(input.note||'').trim().slice(0,500),lines:lines.map(l=>({productId:l.productId,name:product(ops,l.productId).name,sent:l.qty,received:0,pending:l.qty,returned:0})),resolutions:[]};
  for(const line of lines)product(ops,line.productId).central-=line.qty;
  s.combos.push(combo);reconcileRequest(ops,requestId);audit(ops,'Combo enviado na demonstração',combo.id+' · em trânsito, ainda indisponível para venda.');return combo;
 }
 function receiveCombo(ops,id,driverId,input){
  const s=ensure(ops),combo=s.combos.find(c=>c.id===id);M.driver(ops,driverId);
  if(!combo||combo.driverId!==driverId)throw new RangeError('Este combo não pertence ao motorista.');
  if(combo.receivedAt)return false;
  if(combo.status!=='sent')throw new RangeError('Este combo foi cancelado.');
  binding(ops,driverId,combo.vehicleId);
  const lines=normalizeLines(ops,input.lines,true),note=String(input.note||'').trim().slice(0,500);
  if(lines.length!==combo.lines.length||lines.some(l=>!combo.lines.some(c=>c.productId===l.productId)))throw new RangeError('Confira a quantidade recebida de cada produto do combo.');
  for(const l of lines)if(l.qty>combo.lines.find(c=>c.productId===l.productId).sent)throw new RangeError('A quantidade recebida não pode superar a enviada.');
  if(lines.some(l=>l.qty<combo.lines.find(c=>c.productId===l.productId).sent)&&!note)throw new RangeError('Conte o que faltou ou veio diferente para a equipe conferir.');
  const kit=kitFor(s,driverId,combo.vehicleId);
  for(const l of lines){const line=combo.lines.find(c=>c.productId===l.productId);line.received=l.qty;line.pending=line.sent-l.qty;kit.quantities[l.productId]=(kit.quantities[l.productId]||0)+l.qty;syncProduct(ops,s,l.productId);}
  combo.receivedAt=now();combo.receiptNote=note;combo.status=combo.lines.some(l=>l.pending)?'pending_difference':'received';
  reconcileRequest(ops,combo.requestId);audit(ops,'Combo conferido pelo motorista',combo.id+' · '+(combo.status==='received'?'todos os produtos recebidos.':'diferença pendente de conferência.'));return combo;
 }
 function cancelCombo(ops,id,input){const s=ensure(ops),combo=s.combos.find(c=>c.id===id),note=String(input.note||'').trim().slice(0,500);if(!combo)throw new RangeError('Combo não encontrado.');if(combo.status==='cancelled')return false;if(combo.receivedAt||!note)throw new RangeError('Somente um combo ainda não recebido pode ser cancelado, com o motivo da devolução.');for(const line of combo.lines){product(ops,line.productId).central+=line.pending;line.returned+=line.pending;line.pending=0;}combo.status='cancelled';combo.cancelledAt=now();combo.cancelNote=note;reconcileRequest(ops,combo.requestId);audit(ops,'Combo cancelado na demonstração',combo.id+' · produtos devolvidos ao estoque central.');return combo;}
 function resolveDifference(ops,id,input){
  const s=ensure(ops),combo=s.combos.find(c=>c.id===id),line=combo?.lines.find(l=>l.productId===input.productId),qty=quantity(input.qty),note=String(input.note||'').trim().slice(0,500);
  if(!combo?.receivedAt||!line||qty>line.pending||!['deliver','return'].includes(input.action)||!note)throw new RangeError('Confira produto, quantidade e motivo para resolver a diferença.');
  if(input.action==='deliver'){binding(ops,combo.driverId,combo.vehicleId);const kit=kitFor(s,combo.driverId,combo.vehicleId);kit.quantities[line.productId]=(kit.quantities[line.productId]||0)+qty;line.received+=qty;syncProduct(ops,s,line.productId);}else{product(ops,line.productId).central+=qty;line.returned+=qty;}
  line.pending-=qty;combo.status=combo.lines.some(l=>l.pending)?'pending_difference':'received';combo.resolutions.push({productId:line.productId,qty,action:input.action,note,at:now()});reconcileRequest(ops,combo.requestId);audit(ops,'Diferença de combo conferida',combo.id+' · '+qty+' '+line.name+' · '+input.action);return combo;
 }
 function inventory(ops,driverId){
  const s=ensure(ops),d=M.driver(ops,driverId),kit=s.kits[driverId];
  return {driverId,vehicleId:d.vehicleId||kit?.vehicleId||null,products:ops.book.products.map(p=>{const qty=kit?.quantities[p.id]||0,r=reserved(s,driverId,p.id);return {...p,qty,reserved:r,available:qty-r};}),combos:s.combos.filter(c=>c.driverId===driverId).map(copy),orders:s.orders.filter(o=>o.driverId===driverId).map(copy)};
 }
 function snapshot(ops,lines){return lines.map(l=>{const p=product(ops,l.productId);if(!Number.isFinite(p.price)||p.price<0||!Number.isFinite(p.cost)||p.cost<0)throw new RangeError('Preço e custo precisam estar válidos antes da venda.');const unitPrice=round(p.price),unitCost=round(p.cost),gross=round(unitPrice*l.qty),cost=round(unitCost*l.qty);if(!Number.isSafeInteger(Math.round(gross*100))||!Number.isSafeInteger(Math.round(cost*100)))throw new RangeError('Valor da venda fora do limite.');return {...l,name:p.name,unitPrice,unitCost,gross,cost,driverProfit:round(Math.max(0,gross-cost))};});}
 function quote(ops,driverId,input){const view=inventory(ops,driverId),lines=normalizeLines(ops,input);for(const l of lines)if(l.qty>view.products.find(p=>p.id===l.productId).available)throw new RangeError('Quantidade indisponível para esta venda.');const saved=snapshot(ops,lines),driverProfit=total(saved,'driverProfit');return {lines:saved,gross:total(saved,'gross'),cost:total(saved,'cost'),driverProfit,profit:driverProfit};}
 function createOrder(ops,input){
  const s=ensure(ops),vehicleId=binding(ops,input.driverId,input.vehicleId),lines=normalizeLines(ops,input.lines),view=inventory(ops,input.driverId);
  for(const l of lines)if(l.qty>view.products.find(p=>p.id===l.productId).available)throw new RangeError('Quantidade indisponível. Confira os produtos reservados em outras vendas.');
  const saved=snapshot(ops,lines),order={id:'PED-'+(s.orders.length+1),driverId:input.driverId,vehicleId,status:'awaiting_payment',createdAt:now(),lines:saved,gross:total(saved,'gross'),cost:total(saved,'cost'),driverProfit:total(saved,'driverProfit'),saleIds:[]};
  s.orders.push(order);audit(ops,'Venda aguardando Pix demonstrativo',order.id+' · produtos reservados, sem pagamento confirmado.');return order;
 }
 function cancelOrder(ops,id,driverId){const s=ensure(ops),order=s.orders.find(o=>o.id===id);M.driver(ops,driverId);if(!order||order.driverId!==driverId)throw new RangeError('Esta venda não pertence ao motorista.');if(order.status==='cancelled')return false;if(order.status!=='awaiting_payment')throw new RangeError('Uma venda paga exige devolução conferida pela equipe.');order.status='cancelled';order.cancelledAt=now();audit(ops,'Reserva de venda cancelada',order.id+' · produtos liberados para vender.');return order;}
 function deliverOrder(ops,id,driverId){const s=ensure(ops),order=s.orders.find(o=>o.id===id);M.driver(ops,driverId);if(!order||order.driverId!==driverId)throw new RangeError('Esta venda não pertence ao motorista.');if(order.status!=='paid')throw new RangeError('Espere a equipe confirmar o Pix antes de entregar os produtos.');if(order.deliveredAt)return false;binding(ops,driverId,order.vehicleId);order.deliveredAt=now();audit(ops,'Produto entregue ao cliente na demonstração',order.id+' · entrega registrada, sem nova baixa ou lançamento financeiro.');return order;}
 function sellSnapshot(ops,s,driverId,vehicleId,line,method,orderId){
  const p=product(ops,line.productId),kit=s.kits[driverId],original={price:p.price,cost:p.cost,name:p.name,kit:p.kit};let sale;
  // The existing ledger engine remains the only source of sale economics. Give it
  // this driver's custody and the accepted price snapshot, then restore the catalog.
  try{Object.assign(p,{price:line.unitPrice,cost:line.unitCost,name:line.name,kit:kit.quantities[p.id]});sale=C.sale(ops.book,p.id,line.qty,method);}finally{Object.assign(p,original);}
  kit.quantities[p.id]-=line.qty;syncProduct(ops,s,p.id);Object.assign(sale,{driverId,vehicleId,unitCost:line.unitCost,...(orderId?{orderId}:{}),createdAt:now()});return sale;
 }
 function confirmPayment(ops,id,input){
  const s=ensure(ops),order=s.orders.find(o=>o.id===id),reference=String(input.reference||'').trim().slice(0,120);
  if(input.confirmedBy!=='management')throw new RangeError('Somente a gestão confere o Pix nesta demonstração.');
  if(!order)throw new RangeError('Venda não encontrada.');
  if(order.status==='paid')return false;
  if(order.status!=='awaiting_payment'||!reference)throw new RangeError('Confira uma venda em espera e informe a referência do pagamento fictício.');
  if(s.orders.some(o=>o.id!==id&&o.status==='paid'&&o.paymentReference===reference))throw new RangeError('Esta referência já foi usada em outra venda.');
  const kit=s.kits[order.driverId];
  for(const line of order.lines)if(!kit||line.qty>(kit.quantities[line.productId]||0))throw new RangeError('Estoque do motorista insuficiente para confirmar a venda.');
  binding(ops,order.driverId,order.vehicleId);
  if(!scope.RodavoltProgram?.settle)throw new RangeError('O controle do crédito do motorista precisa estar disponível.');
  // Payment confirmation, stock and the exact sale settlement commit together.
  // A rejected calendar/ledger operation cannot leave a paid order or consume stock.
  const trial=copy(ops),ts=trial.shop,to=ts.orders.find(o=>o.id===id),sales=to.lines.map(line=>sellSnapshot(trial,ts,to.driverId,to.vehicleId,line,'company',to.id));
  to.saleIds=sales.map(s=>s.id);scope.RodavoltProgram.settle(trial,'credit',to.driverId,to.saleIds);
  to.status='paid';to.paidAt=now();to.paymentReference=reference;to.confirmedBy='management';
  audit(trial,'Pix fictício conferido pela gestão',to.id+' · mercadoria baixada, recebimento e crédito registrados uma vez.');
  Object.assign(ops.book,trial.book);Object.assign(ops.shop,trial.shop);ops.program=trial.program;ops.events=trial.events;return ops.shop.orders.find(o=>o.id===id);
 }
 function recordSale(ops,input){
  const s=ensure(ops),vehicleId=binding(ops,input.driverId,input.vehicleId),line=normalizeLines(ops,[{productId:input.productId,qty:input.qty}])[0],view=inventory(ops,input.driverId);
  if(!['driver','company'].includes(input.method)||line.qty>view.products.find(p=>p.id===line.productId).available)throw new RangeError('Confira a forma de recebimento e a quantidade disponível.');
  const sale=sellSnapshot(ops,s,input.driverId,vehicleId,snapshot(ops,[line])[0],input.method);audit(ops,'Venda manual registrada na demonstração',sale.id+' · '+input.driverId+' · recebimento sujeito ao acerto.');return sale;
 }
 function summary(ops){
  const s=ensure(ops);return {products:ops.book.products.map(p=>({productId:p.id,name:p.name,central:p.central,kit:p.kit,reserved:s.orders.filter(o=>o.status==='awaiting_payment').reduce((sum,o)=>sum+o.lines.filter(l=>l.productId===p.id).reduce((n,l)=>n+l.qty,0),0),transit:s.combos.reduce((sum,c)=>sum+c.lines.filter(l=>l.productId===p.id).reduce((n,l)=>n+l.pending,0),0),disputed:s.combos.filter(c=>c.receivedAt).reduce((sum,c)=>sum+c.lines.filter(l=>l.productId===p.id).reduce((n,l)=>n+l.pending,0),0)})),pendingOrders:s.orders.filter(o=>o.status==='awaiting_payment').map(copy),combos:s.combos.map(copy)};
 }
 function pendingSummary(ops,driverId){M.driver(ops,driverId);ensure(ops);const pendingSales=ops.book.sales.filter(s=>!s.settled&&(s.driverId||'DRV-1')===driverId),profit=total(pendingSales.map(s=>({profit:s.driverProfit??s.commission})),'profit');return {sales:pendingSales.length,pendingSales:pendingSales.map(copy),gross:total(pendingSales,'gross'),cost:total(pendingSales,'cost'),profit,commission:profit,remittance:total(pendingSales,'remittance'),payable:total(pendingSales,'payableCommission')};}
 scope.RodavoltShop={ensure,sendCombo,receiveCombo,cancelCombo,resolveDifference,inventory,createOrder,cancelOrder,confirmPayment,deliverOrder,recordSale,summary,pendingSummary,quote};
})(globalThis);
