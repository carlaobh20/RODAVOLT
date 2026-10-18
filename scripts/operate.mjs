import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createOperationalServer} from '../server/api.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const app=await createOperationalServer({root,dataDir:resolve(root,'.local/rodavolt'),port:Number(process.env.RODAVOLT_PORT||4174)});
const port=await app.listen();console.log(`RODAVOLT · homologação com acesso individual: http://127.0.0.1:${port}/operacao`);
for(const signal of ['SIGTERM','SIGINT'])process.once(signal,async()=>{await app.close();process.exit(0);});
