import {readFile} from 'node:fs/promises';
import {Script,createContext} from 'node:vm';
import {resolve} from 'node:path';

// The same engines run in the browser and on the local service. No network or
// filesystem is exposed to their VM and no code supplied by a request is executed.
export async function loadDomain(root){
 const context=createContext({structuredClone,Intl,Date,Math,JSON,Map,Set,console});
 for(const name of ['growth','control','legacy/expansion','strategy','planning','driver','operations','finance','coordination','live','inspection','program','shop','rental','closure','incidents','maintenance']){
  try{new Script(await readFile(resolve(root,'src',name+'.js'),'utf8'),{filename:name}).runInContext(context);}catch(error){if(error.code!=='ENOENT'||!['rental','closure','incidents','maintenance'].includes(name))throw error;}
 }
 const keys={S:'Simulator',C:'Control',P:'Planning',M:'Operations',D:'Driver',F:'Finance',K:'Coordination',I:'Inspection',R:'Program',H:'Shop',B:'Rental',Z:'Closure',N:'Incidents',W:'Maintenance'};
 return Object.fromEntries(Object.entries(keys).map(([key,name])=>[key,context['Rodavolt'+name]]));
}
export function initialWorkspace(d){
 const params={...d.P.defaults},baseline={id:'PLANO-001',params,createdAt:new Date().toISOString()},ops=d.M.create(d.S.freezePlan(params));
 for(const key of ['R','F','K','I','H'])d[key].ensure(ops);
 return {version:3,params,baseline,ops,savedScenarios:[],scenarioName:'Homologação local · dados fictícios',page:'today',mode:'admin',driverPage:'home',activeDriverId:'DRV-1',driverTheme:'light'};
}
export function validateWorkspace(workspace,d){
 if(workspace?.version!==3||workspace.ops?.schema!==3)throw new RangeError('Formato da operação inválido.');
 d.S.validate(workspace.params);d.S.validate(workspace.baseline?.params);
 const o=workspace.ops,ids=list=>new Set(list.map(e=>e.id)).size===list.length;
 for(const list of [o.drivers,o.charges,o.book?.entries,o.book?.products])if(!Array.isArray(list)||!ids(list))throw new RangeError('Registros ausentes ou identificadores repetidos.');
 if(o.drivers.length>10000||o.book.entries.length>100000)throw new RangeError('Limite da homologação local excedido.');
 const occupied=new Set();for(const driver of o.drivers){if(!d.M.stages.some(([stage])=>stage===driver.stage))throw new RangeError('Etapa inválida.');if(driver.stage==='active'){if(!driver.vehicleId||occupied.has(driver.vehicleId))throw new RangeError('Há conflito de vínculo de veículo.');occupied.add(driver.vehicleId);}}
 for(const e of o.book.entries){if(!Number.isFinite(e.amount)||!Number.isInteger(e.month)||e.month<1||e.month>120)throw new RangeError('Lançamento inválido.');if(e.amount<0&&!o.book.entries.some(original=>original.id===e.reversalOf&&original.amount>0))throw new RangeError('Valor negativo exige origem de estorno.');}
 for(const p of o.book.products)for(const key of ['central','kit'])if(!Number.isInteger(p[key])||p[key]<0)throw new RangeError('Estoque inválido.');
 for(const c of o.charges)if(!o.drivers.some(driver=>driver.id===c.driverId)||!Number.isFinite(c.amount)||c.amount<0)throw new RangeError('Cobrança sem titular ou valor válido.');
 return workspace;
}
export function adminWorkspace(state){
 const workspace=structuredClone(state.workspace);workspace.ops.personal={settings:{...workspace.ops.personal.settings},offers:[],journeys:[]};workspace.ops.driverProfiles={};
 return workspace;
}
export function driverView(state,user,d){
 const o=state.workspace.ops,id=user.driverId,driver=d.M.driver(o,id),vehicle=d.M.vehicles(o).find(v=>v.id===(driver.vehicleId||driver.nextVehicleId));
 const own=list=>(list||[]).filter(e=>e.driverId===id);
 const inventorySource=structuredClone(o);for(const product of inventorySource.book.products)product.kit=Object.values(inventorySource.shop?.kits||{}).reduce((sum,kit)=>sum+(kit.quantities[product.id]||0),0);const inventory=d.H.inventory(inventorySource,id);inventory.products=inventory.products.map(({id,name,category,price,cost,qty,reserved,available,batch,expiresOn,warranty,expired})=>({id,name,category,price,cost,qty,reserved,available,batch,expiresOn,warranty,expired}));
 return {profile:structuredClone(driver),vehicle:vehicle?{id:vehicle.id,model:vehicle.model,plate:vehicle.plate,km:vehicle.km,nextKm:vehicle.nextKm,status:vehicle.status}:null,
  charges:own(o.charges).map(c=>({...c,balance:d.R.currentChargeBalance(o,c)})),credits:d.R.driverCredits(o,id),deposit:d.R.depositSummary(o,id),
  inventory,contracts:d.K.driverDocuments(o,id),agenda:d.K.driverAgendaItems(o,id),inspections:d.I.forDriver(o,id),requests:structuredClone(own(o.requests)),
  closures:structuredClone(own(o.closures?.records)),incidents:d.N?.forDriver(o,id)||[],
  personal:structuredClone(state.personal[user.id]||{settings:{...d.D.defaults},journeys:[],offers:[]}),maintenance:d.W?.driverView(o,id)||[],timeZone:o.agenda?.timeZone||'America/Sao_Paulo'};
}
export function applyDriverCommand(state,user,command,input,d){
 const o=state.workspace.ops,id=user.driverId,driver=d.M.driver(o,id),own=(list,key)=>{const item=list.find(x=>x.id===key);if(!item||item.driverId!==id)throw new RangeError('Este registro não pertence ao seu acesso.');return item;};
 const personal=state.personal[user.id]||=({settings:{...d.D.defaults},journeys:[],offers:[]});
 switch(command){
  case 'proof':own(o.charges,input.chargeId);return d.M.proof(o,input.chargeId,String(input.note||'Comprovante de teste enviado pelo acesso individual'));
  case 'credit':own(o.charges,input.chargeId);return d.R.applyAvailableCredit(o,id,input.chargeId);
  case 'request':return d.M.request(o,{type:input.type,driverId:id,vehicleId:driver.vehicleId,priority:input.priority,productId:input.productId,qty:input.qty,note:input.note});
  case 'combo.receive':own(d.H.ensure(o).combos,input.id);return d.H.receiveCombo(o,input.id,id,input);
  case 'order.create':return d.H.createOrder(o,{driverId:id,vehicleId:driver.vehicleId,lines:input.lines});
  case 'order.cancel':own(d.H.ensure(o).orders,input.id);return d.H.cancelOrder(o,input.id,id);
  case 'order.deliver':own(d.H.ensure(o).orders,input.id);return d.H.deliverOrder(o,input.id,id);
  case 'inspection.create':return d.I.create(o,{driverId:id,vehicleId:driver.vehicleId||driver.nextVehicleId,type:input.type});
  case 'inspection.save':own(d.I.ensure(o).records,input.id);for(const evidence of input.evidence||[])if(evidence.source!=='private'||!state.files.some(file=>file.id===evidence.fileId&&file.driverId===id&&file.inspectionId===input.id&&file.slot===evidence.slot))throw new RangeError('A foto precisa pertencer a esta vistoria e a este acesso.');return d.I.save(o,input.id,input);
  case 'inspection.submit':own(d.I.ensure(o).records,input.id);return d.I.submit(o,input.id);
  case 'contract.signature':own(d.K.contracts(o),input.id);return d.K.recordSignature(o,input.id,'driver');
  case 'incident.manifest':return d.N.manifest(o,input.id,{driverId:id,message:input.message,reference:input.reference});
  case 'goals':personal.settings=d.D.validate(input);return true;
  case 'journey':return d.M.saveJourney({personal},input);
  case 'ride':{const result=d.D.evaluate(input.offer,personal.settings);if(!['accepted','rejected'].includes(input.choice))throw new RangeError('Decisão inválida.');personal.offers.push({...input.offer,...result,choice:input.choice,at:new Date().toISOString()});return result;}
  default:throw new RangeError('Ação não disponível para este acesso.');
 }
}
