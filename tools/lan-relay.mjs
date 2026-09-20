#!/usr/bin/env node
// Adapted from the supplied Bible Game Library relay. Rooms exist only in RAM.
import http from 'node:http';import os from 'node:os';import fs from 'node:fs/promises';import path from 'node:path';import dgram from 'node:dgram';import {fileURLToPath} from 'node:url';import {randomBytes} from 'node:crypto';import {WebSocketServer} from 'ws';
const root=fileURLToPath(new URL('../public/',import.meta.url)),port=Number(process.env.LAN_PORT||17831),alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const arg=(n,d)=>{const i=process.argv.indexOf('--'+n);return i<0?d:process.argv[i+1];};
const code=arg('code',Array.from(randomBytes(6),b=>alphabet[b%alphabet.length]).join('')).toUpperCase();const name=arg('name','Kairos living room');
let hostId=null,status='lobby',gameId='ark-park',snapshot=null;const clients=new Map();
const types={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4','.json':'application/json'};
const server=http.createServer(async(req,res)=>{const url=new URL(req.url,'http://localhost');if(url.pathname==='/relay-info'){res.setHeader('content-type','application/json');return res.end(JSON.stringify({code,name,taken:clients.size,status,gameId}));}if(url.pathname.startsWith('/api/')){res.writeHead(503,{'content-type':'application/json'});return res.end(JSON.stringify({error:'Accounts and online chapter rooms are available on the hosted site. Guest arcade play works here.'}));}try{const target=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!target.startsWith(root))throw Error();const body=await fs.readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(body);}catch{res.writeHead(404);res.end('Not found');}});
const wss=new WebSocketServer({server,maxPayload:65536});
const send=(ws,m)=>ws?.readyState===1&&ws.send(JSON.stringify(m));const broadcast=m=>{for(const {ws}of clients.values())send(ws,m);};
const presence=()=>broadcast({t:'presence',members:[...clients.values()].map(({member})=>member),hostId,gameId,status});
wss.on('connection',(ws,req)=>{const u=new URL(req.url,'http://localhost');const id=u.searchParams.get('clientId');
 if(u.searchParams.get('code')!==code||!id||id.length>80||clients.has(id)||clients.size>=8||status==='live'){send(ws,{t:'error',reason:status==='live'?'A match is already in progress. Join after it finishes.':'Check the room code. The room may be full or this player is already connected.'});ws.close();return;}
 const member={id,name:(u.searchParams.get('name')||'Explorer').slice(0,24),character:Math.max(0,Math.min(3,Number(u.searchParams.get('character'))||0)),age:['little','kid','teen'].includes(u.searchParams.get('age'))?u.searchParams.get('age'):'kid',ready:false};clients.set(id,{ws,member});hostId||=id;
 send(ws,{t:'welcome',clientId:id,hostId,code});presence();let last=Date.now(),count=0;
 ws.on('message',buf=>{if(Date.now()-last>1000){last=Date.now();count=0;}if(++count>100)return;let m;try{m=JSON.parse(buf.toString());}catch{return;}if(!m||typeof m!=='object')return;
  if(m.t==='ready'){member.ready=!!m.ready;presence();}
  if(m.t==='intent'&&status==='live')send(clients.get(hostId)?.ws,{t:'intent',clientId:id,intent:m.intent});
  if(m.t==='emote'&&['wow','go','oops','gg'].includes(m.kind))broadcast({t:'emote',name:member.name,kind:m.kind});
  if(id!==hostId)return;
  if(m.t==='pick-game'&&status==='lobby'&&['ark-park','galilee','pharaoh-chase','plague-party','lost-sheep'].includes(m.gameId)){gameId=m.gameId;presence();}
  if(m.t==='start'&&status==='lobby'){status='live';snapshot=m.state;broadcast({t:'start',state:snapshot});presence();}
  if(m.t==='state'&&status==='live'){snapshot=m.state;broadcast({t:'state',state:snapshot});}
  if(m.t==='pause'&&status==='live')broadcast({t:'pause',paused:!!m.paused});
  if(m.t==='results'&&status==='live'){snapshot=m.state;status='lobby';broadcast({t:'results',state:snapshot});presence();}
 });
 ws.on('close',()=>{clients.delete(id);if(hostId===id){hostId=[...clients.keys()].sort()[0]||null;if(!hostId){status='lobby';snapshot=null;}else{if(snapshot?.players){const p=snapshot.players.find(p=>p.id===id);if(p)p.cpu=true;}broadcast({t:'host',hostId,state:snapshot});}}presence();});
});
const ips=Object.values(os.networkInterfaces()).flat().filter(n=>n?.family==='IPv4'&&!n.internal).map(n=>n.address);const udp=dgram.createSocket({type:'udp4',reuseAddr:true});udp.on('error',()=>{});udp.bind(0,()=>{try{udp.setBroadcast(true);}catch{}});
const beacon=setInterval(()=>{const data=Buffer.from(JSON.stringify({v:1,app:'bible-library',code,ip:ips[0]||'127.0.0.1',port,gameId,hostName:name,taken:clients.size,max:8,status}));for(const dest of ['255.255.255.255','239.42.14.16'])try{udp.send(data,17832,dest);}catch{}},1000);
server.listen(port,'0.0.0.0',()=>console.log(`Kairos LAN ready\nOpen: http://${ips[0]||'127.0.0.1'}:${port}\nLocal: http://127.0.0.1:${port}\nRoom code: ${code}`));
for(const sig of ['SIGINT','SIGTERM'])process.on(sig,()=>{clearInterval(beacon);udp.close();wss.close();server.close();process.exit();});
