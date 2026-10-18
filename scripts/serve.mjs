import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT||4173);
createServer(async(req,res)=>{
  const path=new URL(req.url,'http://localhost').pathname;
  const responsive=/^\/_responsive\/(320|390|736|1024)$/.exec(path);
  if(responsive){
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.end(`<!doctype html><html><head><meta charset="utf-8"><title>RODAVOLT · teste ${responsive[1]}px</title></head><body style="margin:0;background:#777"><iframe title="RODAVOLT responsivo" src="/" width="${responsive[1]}" height="2400" style="display:block;border:0"></iframe></body></html>`);return;
  }
  if(!['/','/index.html'].includes(path)){res.writeHead(404);res.end('Página não encontrada');return;}
  try{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(await readFile(resolve(root,'index.html')));}catch{res.writeHead(500);res.end('Execute npm run build primeiro.');}
}).listen(port,'127.0.0.1',()=>console.log(`RODAVOLT: http://127.0.0.1:${port}`));
