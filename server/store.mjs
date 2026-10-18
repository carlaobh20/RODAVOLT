import {mkdir,readFile,open,rename,unlink} from 'node:fs/promises';
import {resolve} from 'node:path';
import {randomUUID,createHash} from 'node:crypto';
export const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const NO_COMMIT=Symbol('no-commit');
export async function openStore(directory,initial){
 await mkdir(directory,{recursive:true,mode:0o700});const path=resolve(directory,'state.json'),lockPath=resolve(directory,'server.lock');
 let lock;try{lock=await open(lockPath,'wx',0o600);}catch(error){if(error.code!=='EEXIST')throw error;const pid=Number(await readFile(lockPath,'utf8'));let alive=true;try{process.kill(pid,0);}catch(e){alive=e.code!=='ESRCH';}if(alive)throw new Error('Já existe um serviço usando este diretório de dados.');await unlink(lockPath);lock=await open(lockPath,'wx',0o600);}await lock.writeFile(String(process.pid));
 let state;try{state=JSON.parse(await readFile(path,'utf8'));if(state.schema!==1||!state.workspace||!state.users)throw new Error('Formato inválido.');}catch(e){if(e.code!=='ENOENT'){await lock.close();await unlink(lockPath);throw new Error('Não foi possível abrir os dados. Preserve o arquivo e restaure um backup validado.');}state=initial;}
 async function save(value){const temp=path+'.'+randomUUID()+'.tmp';const file=await open(temp,'wx',0o600);try{await file.writeFile(JSON.stringify(value));await file.sync();}finally{await file.close();}await rename(temp,path);const dir=await open(directory,'r');try{await dir.sync();}finally{await dir.close();}}
 await save(state);let queue=Promise.resolve(),closed=false;
 return {get:()=>structuredClone(state),transact(fn){const work=queue.then(async()=>{if(closed)throw new Error('Serviço encerrado.');const draft=structuredClone(state),result=await fn(draft);if(result===NO_COMMIT)return;draft.revision=state.revision+1;await save(draft);state=draft;return result;});queue=work.catch(()=>{});return work;},async close(){await queue;closed=true;await lock.close();await unlink(lockPath);}};
}
