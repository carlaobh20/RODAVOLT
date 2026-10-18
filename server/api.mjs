import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {randomBytes,randomUUID,scryptSync,timingSafeEqual} from 'node:crypto';
import {openStore,digest,NO_COMMIT} from './store.mjs';
import {loadDomain,initialWorkspace,validateWorkspace,adminWorkspace,driverView,applyDriverCommand} from './domain.mjs';

const fail=(status,message)=>{const error=new Error(message);error.status=status;throw error;};
const publicUser=u=>({id:u.id,name:u.name,username:u.username,role:u.role,driverId:u.driverId||null,disabled:!!u.disabled});
const hash=password=>{const salt=randomBytes(16).toString('hex');return salt+':'+scryptSync(password,salt,64).toString('hex');};
const verify=(password,encoded)=>{const [salt,key]=encoded.split(':');return timingSafeEqual(Buffer.from(key,'hex'),scryptSync(String(password),salt,64));};
const passwordCheck=p=>{if(typeof p!=='string'||p.length<12||p.length>200)fail(422,'Use uma senha de 12 a 200 caracteres.');return p;};
const usernameCheck=u=>{if(typeof u!=='string'||!/^[a-z0-9][a-z0-9._-]{2,59}$/.test(u))fail(422,'Use um acesso com 3 a 60 letras minúsculas, números, ponto ou traço.');return u;};
function audit(state,user,action,detail=''){state.audit.push({id:randomUUID(),at:new Date().toISOString(),actor:user?.id||'setup',action,detail});}
const safeJSON=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
async function body(req,limit=12*1024*1024){let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>limit)fail(413,'Arquivo ou solicitação muito grande.');chunks.push(chunk);}try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{fail(400,'Conteúdo JSON inválido.');}}
export async function createOperationalServer({root,dataDir,port=4174}={}){
 const d=await loadDomain(root),workspace=initialWorkspace(d),store=await openStore(dataDir,{schema:1,revision:0,users:[],workspace,personal:{},files:[],audit:[],idempotency:{},providers:{bank:{status:'not_configured'},signature:{status:'not_configured'},telemetry:{status:'not_configured'},notifications:{status:'not_configured'}}});
 let cookieName='rodavolt_session';
 const sessions=new Map(),attempts=new Map(),dummy=hash(randomBytes(24).toString('base64url'));
 await mkdir(resolve(dataDir,'files'),{recursive:true,mode:0o700});
 const sessionFor=req=>{const token=String(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1),s=token&&sessions.get(token),user=s&&store.get().users.find(u=>u.id===s.userId&&!u.disabled);if(!s||!user||s.expires<Date.now()){if(token)sessions.delete(token);return null;}return {...s,token,user};};
 function issue(res,user,old){if(old)sessions.delete(old);const token=randomBytes(32).toString('base64url'),s={userId:user.id,csrf:randomBytes(24).toString('base64url'),expires:Date.now()+8*3600000};sessions.set(token,s);res.setHeader('Set-Cookie',`${cookieName}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`);return s;}
 function json(res,status,value){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));}
 function view(state,user){return user.role==='admin'?{workspace:adminWorkspace(state),revision:state.revision,user:publicUser(user),providers:state.providers}: {driver:driverView(state,user,d),revision:state.revision,user:publicUser(user)};}
 const server=createServer(async(req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
  try{
   const host=req.headers.host,expected=`127.0.0.1:${server.address()?.port||port}`;if(host!==expected)fail(403,'Acesse o serviço pelo endereço local informado no terminal.');
   const url=new URL(req.url,'http://'+host),path=url.pathname,mutation=!['GET','HEAD'].includes(req.method);
   if(mutation&&req.headers.origin!=='http://'+host)fail(403,'Origem da solicitação não autorizada.');
   const s=sessionFor(req),user=s?.user;
   if(req.method==='GET'&&path==='/api/session')return json(res,200,{setupRequired:store.get().users.length===0,user:user?publicUser(user):null,csrf:s?.csrf||null});
   if(req.method==='POST'&&(path==='/api/setup'||path==='/api/login')){
    const key=req.socket.remoteAddress,history=(attempts.get(key)||[]).filter(t=>t>Date.now()-60000);if(history.length>=10)fail(429,'Muitas tentativas. Aguarde um minuto.');history.push(Date.now());attempts.set(key,history);
    const input=await body(req,4096);let account;
    if(path==='/api/setup'){
     usernameCheck(input.username);passwordCheck(input.password);if(!String(input.name||'').trim())fail(422,'Informe seu nome.');
     await store.transact(state=>{if(state.users.length)fail(409,'A configuração inicial já foi concluída.');account={id:randomUUID(),username:input.username,name:String(input.name).trim().slice(0,100),password:hash(input.password),role:'admin',disabled:false};state.users.push(account);audit(state,account,'initial_setup');});
    }else{account=store.get().users.find(u=>u.username===input.username&&!u.disabled);const valid=verify(input.password||'',account?.password||dummy);if(!valid||!account)fail(401,'Acesso ou senha inválidos.');}
    const issued=issue(res,account,s?.token);return json(res,200,{user:publicUser(account),csrf:issued.csrf});
   }
   if(path.startsWith('/api/')&&!s)fail(401,'Entre com seu acesso.');
   if(path.startsWith('/api/')&&mutation&&req.headers['x-csrf-token']!==s.csrf)fail(403,'Sessão de formulário inválida. Atualize a página.');
   if(req.method==='POST'&&path==='/api/logout'){sessions.delete(s.token);res.setHeader('Set-Cookie',`${cookieName}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`);return json(res,200,{ok:true});}
   if(req.method==='GET'&&path==='/api/workspace')return json(res,200,view(store.get(),user));
   if(req.method==='GET'&&path==='/api/users'){if(user.role!=='admin')fail(403,'Acesso da gestão necessário.');return json(res,200,{users:store.get().users.map(publicUser)});}
   if(req.method==='POST'&&path==='/api/users'){
    if(user.role!=='admin')fail(403,'Acesso da gestão necessário.');const input=await body(req,4096);usernameCheck(input.username);passwordCheck(input.password);
    await store.transact(state=>{if(!state.workspace.ops.drivers.some(driver=>driver.id===input.driverId))fail(422,'Escolha um motorista cadastrado.');if(state.users.some(u=>u.username===input.username||u.driverId===input.driverId&&!u.disabled))fail(409,'Este acesso ou motorista já foi cadastrado.');state.users.push({id:randomUUID(),name:state.workspace.ops.drivers.find(dr=>dr.id===input.driverId).name,username:input.username,password:hash(input.password),role:'driver',driverId:input.driverId,disabled:false});audit(state,user,'driver_access_created',input.driverId);});return json(res,201,{ok:true});
   }
   if(req.method==='POST'&&path==='/api/users/disable'){
    if(user.role!=='admin')fail(403,'Acesso da gestão necessário.');const input=await body(req,4096);await store.transact(state=>{const target=state.users.find(u=>u.id===input.id&&u.role==='driver');if(!target)fail(422,'Escolha um acesso de motorista.');target.disabled=true;audit(state,user,'driver_access_disabled',target.id);});for(const [token,session]of sessions)if(session.userId===input.id)sessions.delete(token);return json(res,200,{ok:true});
   }
   if(req.method==='POST'&&path==='/api/password'){
    const input=await body(req,4096);passwordCheck(input.password);if(!verify(input.currentPassword||'',user.password))fail(401,'Confira a senha atual.');await store.transact(state=>{state.users.find(u=>u.id===user.id).password=hash(input.password);audit(state,user,'password_changed');});for(const [token,session]of sessions)if(session.userId===user.id)sessions.delete(token);const issued=issue(res,user);return json(res,200,{ok:true,csrf:issued.csrf});
   }
   if((req.method==='PUT'&&path==='/api/workspace')||(req.method==='POST'&&path==='/api/command')){
    const input=await body(req),id=String(req.headers['idempotency-key']||'');if(!/^[a-zA-Z0-9_-]{8,100}$/.test(id))fail(422,'Identificador de reenvio ausente.');const key=user.id+':'+id,fingerprint=digest({path,input}),expectedRevision=Number(req.headers['if-match']);
    await store.transact(state=>{
     const previous=state.idempotency[key];if(previous){if(previous!==fingerprint)fail(409,'Este identificador já foi usado por outra ação.');return NO_COMMIT;}
     if(!Number.isInteger(expectedRevision)||expectedRevision!==state.revision)fail(409,'Outra sessão atualizou a operação. Atualize antes de continuar.');
     if(path==='/api/workspace'){
      if(user.role!=='admin')fail(403,'Motorista não pode substituir a operação.');validateWorkspace(input,d);
      // Driver personal finances never travel in the management payload.
      input.ops.personal={settings:{...d.D.defaults},journeys:[],offers:[]};input.ops.driverProfiles={};state.workspace=input;
     }else{if(user.role!=='driver')fail(403,'Esta rota é exclusiva das tarefas do motorista.');applyDriverCommand(state,user,input.command,input.input||{},d);}
     state.idempotency[key]=fingerprint;audit(state,user,path==='/api/workspace'?'workspace_saved':input.command,digest(state.workspace.ops));
    });return json(res,200,view(store.get(),user));
   }
   if(req.method==='GET'&&path==='/api/audit'){if(user.role!=='admin')fail(403,'Acesso da gestão necessário.');return json(res,200,{events:store.get().audit.slice(-500)});}
   if(req.method==='GET'&&path==='/api/providers')return json(res,200,{providers:store.get().providers});
   if(req.method==='POST'&&path==='/api/files'){
    const input=await body(req,8*1024*1024),driverId=user.role==='driver'?user.driverId:input.driverId;if(!store.get().workspace.ops.drivers.some(dr=>dr.id===driverId))fail(422,'Motorista inválido.');
    const content=Buffer.from(String(input.content||''),'base64'),mime=String(input.mime||''),magic=content.subarray(0,8),valid=mime==='application/pdf'&&magic.subarray(0,5).toString()==='%PDF-'||mime==='image/png'&&magic.equals(Buffer.from([137,80,78,71,13,10,26,10]))||mime==='image/jpeg'&&magic[0]===255&&magic[1]===216&&magic[2]===255;
    if(!valid||content.length>5*1024*1024||content.length<8)fail(422,'Use PDF, PNG ou JPEG válido com até 5 MB.');
    if(input.inspectionId){if(!['image/png','image/jpeg'].includes(mime))fail(422,'A vistoria precisa de foto PNG ou JPEG.');const inspection=d.I.lookup(store.get().workspace.ops,input.inspectionId);if(inspection.driverId!==driverId||!d.I.slots.some(([slot])=>slot===input.slot))fail(422,'Vínculo ou vista da foto inválidos.');}
    const id=randomUUID(),metadata={id,driverId,inspectionId:input.inspectionId||null,slot:input.slot||null,name:String(input.name||'Arquivo de homologação').replace(/[\x00-\x1f/\\]/g,'').slice(0,150),mime,size:content.length,sha256:digest(content.toString('base64')),createdAt:new Date().toISOString(),by:user.id};
    await writeFile(resolve(dataDir,'files',id),content,{flag:'wx',mode:0o600});await store.transact(state=>{state.files.push(metadata);audit(state,user,'private_file_added',id);});return json(res,201,{file:metadata});
   }
   if(req.method==='GET'&&path==='/api/files')return json(res,200,{files:store.get().files.filter(f=>user.role==='admin'||f.driverId===user.driverId)});
   const fileMatch=/^\/api\/files\/([0-9a-f-]{36})$/.exec(path);if(req.method==='GET'&&fileMatch){const f=store.get().files.find(f=>f.id===fileMatch[1]&&(user.role==='admin'||f.driverId===user.driverId));if(!f)fail(404,'Arquivo não encontrado.');const bytes=await readFile(resolve(dataDir,'files',f.id));res.writeHead(200,{'Content-Type':f.mime,'Content-Disposition':`attachment; filename="arquivo-${f.id}.${f.mime==='application/pdf'?'pdf':f.mime==='image/png'?'png':'jpg'}"`});return res.end(bytes);}
   if(req.method==='GET'&&path==='/api/backup'){
    if(user.role!=='admin')fail(403,'Acesso da gestão necessário.');const state=store.get(),files=[];for(const f of state.files)files.push({...f,content:(await readFile(resolve(dataDir,'files',f.id))).toString('base64')});
    const payload={workspace:adminWorkspace(state),files,audit:state.audit,createdAt:new Date().toISOString()};return json(res,200,{format:'rodavolt-local-backup-v1',payload,sha256:digest(payload)});
   }
   if(req.method==='POST'&&path==='/api/restore'){
    if(user.role!=='admin')fail(403,'Acesso da gestão necessário.');const input=await body(req,50*1024*1024);if(input.format!=='rodavolt-local-backup-v1'||input.sha256!==digest(input.payload))fail(422,'Backup inválido ou alterado.');validateWorkspace(input.payload.workspace,d);
    const newFiles=[],fileIds=new Map();for(const f of input.payload.files||[]){if(!/^[0-9a-f-]{36}$/.test(f.id)||f.sha256!==digest(f.content)||fileIds.has(f.id)||!input.payload.workspace.ops.drivers.some(driver=>driver.id===f.driverId))fail(422,'Arquivo do backup inválido.');const content=Buffer.from(f.content,'base64');if(content.length!==f.size||content.length>5*1024*1024)fail(422,'Tamanho de arquivo inválido.');const id=randomUUID();await writeFile(resolve(dataDir,'files',id),content,{flag:'wx',mode:0o600});const {content:unused,...metadata}=f;newFiles.push({...metadata,id});fileIds.set(f.id,id);}
    const restored=structuredClone(input.payload.workspace);for(const inspection of restored.ops.inspections?.records||[])for(const evidence of inspection.evidence||[])if(evidence.source==='private'){if(!fileIds.has(evidence.fileId))fail(422,'O backup não contém uma das fotos referenciadas pela vistoria.');evidence.fileId=fileIds.get(evidence.fileId);}
    await store.transact(state=>{if(Number(req.headers['if-match'])!==state.revision)fail(409,'A operação mudou. Atualize antes de restaurar.');state.workspace=restored;state.files=newFiles;state.idempotency={};for(const account of state.users)if(account.role==='driver')account.disabled=true;audit(state,user,'backup_restored',input.sha256+' · acessos de motorista revogados; revincular conscientemente.');});sessions.clear();return json(res,200,{ok:true,reauthenticate:true});
   }
   if(req.method==='GET'&&path==='/api/personal/export'){if(user.role!=='driver')fail(403,'Acesso do próprio motorista necessário.');return json(res,200,{personal:store.get().personal[user.id]||null});}
   if(path.startsWith('/api/'))fail(404,'Rota não encontrada.');
   if(req.method!=='GET')fail(405,'Método não permitido.');
   if(path==='/operacao/gestao'){
    if(!user||user.role!=='admin'){res.writeHead(302,{Location:'/operacao'});return res.end();}
    const state=store.get(),boot={...view(state,user),csrf:s.csrf},html=await readFile(resolve(root,'index.html'),'utf8');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://tile.openstreetmap.org https://*.tile.openstreetmap.org; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(html.replace('<script>',`<script>globalThis.RODAVOLT_SESSION=${safeJSON(boot)};</script><script>`));
   }
   const asset={'/operacao':'prototype/operational.html','/':'prototype/operational.html','/operation.js':'prototype/operational.js','/operation.css':'prototype/operational.css','/driver-engine.js':'src/driver.js'}[path];
   if(!asset)fail(404,'Página não encontrada.');res.writeHead(200,{'Content-Type':asset.endsWith('.js')?'text/javascript; charset=utf-8':asset.endsWith('.css')?'text/css; charset=utf-8':'text/html; charset=utf-8'});return res.end(await readFile(resolve(root,asset)));
  }catch(error){if(!res.headersSent)json(res,error.status||((error instanceof RangeError||error.name==='RangeError')?422:500),{error:error.status||error.name==='RangeError'?error.message:'Não foi possível concluir. A operação anterior foi preservada.'});else res.end();}
 });
 server.requestTimeout=30000;server.headersTimeout=15000;
 return {server,domain:d,store,async listen(){await new Promise((yes,no)=>{server.once('error',no);server.listen(port,'127.0.0.1',yes);});cookieName='rodavolt_session_'+server.address().port;return server.address().port;},async close(){if(server.listening)await new Promise(resolve=>server.close(resolve));sessions.clear();await store.close();}};
}
