import {spawnSync,spawn} from 'node:child_process';
for(const args of [['scripts/build.mjs'],['node_modules/wrangler/bin/wrangler.js','d1','migrations','apply','DB','--local']]){const r=spawnSync(process.execPath,args,{stdio:'inherit',env:{...process.env,WRANGLER_SEND_METRICS:'false'}});if(r.status!==0)process.exit(r.status||1);}
const p=spawn(process.execPath,['node_modules/wrangler/bin/wrangler.js','dev','--local','--port','4173'],{stdio:'inherit',env:{...process.env,WRANGLER_SEND_METRICS:'false'}});for(const s of ['SIGINT','SIGTERM'])process.on(s,()=>p.kill(s));
