import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {createOperationalServer} from '../server/api.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT||4173);
let operational=null;
try{const response=await fetch('http://127.0.0.1:4174/api/session',{signal:AbortSignal.timeout(1000)}),status=await response.json();if(response.status!==200||typeof status.setupRequired!=='boolean')throw new Error('Outro serviço na porta da base.');console.log('Base local disponível: http://127.0.0.1:4174/operacao');}catch{
 try{operational=await createOperationalServer({root,dataDir:resolve(root,'.local/rodavolt'),port:4174});await operational.listen();console.log('Base local: http://127.0.0.1:4174/operacao');}catch(error){if(operational)await operational.store.close();operational=null;console.log('Base local não iniciada: '+error.message+' Use npm run operate quando a porta e os dados estiverem disponíveis.');}
}
createServer(async(req,res)=>{
  const requestURL=new URL(req.url,'http://localhost'),path=requestURL.pathname;
  const responsive=/^\/_responsive\/(320|390|736|1024)$/.exec(path);
  if(responsive){
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.end(`<!doctype html><html><head><meta charset="utf-8"><title>RODAVOLT · teste ${responsive[1]}px</title></head><body style="margin:0;background:#777"><iframe title="RODAVOLT responsivo" src="${requestURL.searchParams.has('qa')?'/?qa=1':'/'}" width="${responsive[1]}" style="display:block;border:0;height:100vh"></iframe></body></html>`);return;
  }
  if(!['/','/index.html'].includes(path)){res.writeHead(404);res.end('Página não encontrada');return;}
  try{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(await readFile(resolve(root,'index.html')));}catch{res.writeHead(500);res.end('Execute npm run build primeiro.');}
}).listen(port,'127.0.0.1',()=>console.log(`RODAVOLT: http://127.0.0.1:${port}`));
for(const signal of ['SIGTERM','SIGINT'])process.once(signal,async()=>{if(operational)await operational.close();process.exit(0);});
