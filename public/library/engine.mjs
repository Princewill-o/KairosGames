// Pure deterministic simulation. I/O belongs in the transports and shell.
import {arcadeGames,animals,fish,crates,bushes,walls} from './data.mjs';
export function rng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
export function dailySeed(game,day){let h=2166136261;for(const c of game+day)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
export function makeCourse(seed){const r=rng(seed);return Array.from({length:90},(_,i)=>({at:3+i*.95,lane:Math.floor(r()*3),kind:['gap','hurdle','coin','coin','sand'][Math.floor(r()*5)]}));}
export const timing=t=>(Math.sin(t*Math.PI-Math.PI/2)+1)/2;
export const greenCatch=(t,age)=>Math.abs(timing(t)-.5)<(age==='little'?.36:.21);
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
export function createMatch(gameId,seed,members,age='kid',matchId=`${gameId}-${seed}`){
 if(!arcadeGames.some(g=>g.id===gameId))throw Error('Unknown game');
 const r=rng(seed),list=members.slice(0,8).map(m=>({...m}));
 if(['plague-party','lost-sheep'].includes(gameId))while(list.length<4)list.push({id:`cpu-${list.length}`,name:['Pip','Clover','Bramble','Sunny'][list.length],character:list.length%4,cpu:true});
 const players=list.map((m,i)=>({...m,x:120+(i%3)*230,y:140+Math.floor(i/3)*210,lane:i%3,score:0,hits:0,alive:true,lost:false,saved:false,hidden:false,jump:0,catches:[],lastCast:-1,lastAttempt:-5,combo:0,flash:0,moving:false,lastAction:-5,role:i===0?'shepherd':i===1?'wolf':'sheep',biome:'meadow'}));
 return{gameId,seed,matchId,age,time:0,duration:arcadeGames.find(g=>g.id===gameId).duration,status:'live',players,wave:0,course:makeCourse(seed),spawns:Array.from({length:48},()=>Math.floor(r()*8)),claims:{},winner:null};
}
export function act(state,id,intent){
 if(state.status!=='live')return state;
 const s=structuredClone(state),p=s.players.find(p=>p.id===id);if(!p||!intent)return state;
 if(intent.type==='biome'&&['meadow','forest','river'].includes(intent.value)){p.biome=intent.value;return s;}
 if(intent.type==='catch'&&['ark-park','galilee'].includes(s.gameId)){
  const slot=Math.floor(s.time/4);if(p.lastCast===slot||s.time-p.lastAttempt<.35)return s;p.lastAttempt=s.time;
  if(!greenCatch(s.time,s.age)){p.combo=0;return s;}
  if(s.gameId==='ark-park'){if(s.claims[slot])return s;s.claims[slot]=id;const pool=animals.filter(a=>a[3]===p.biome);p.catches.push(pool[s.spawns[slot%s.spawns.length]%pool.length][0]);}
  else p.catches.push(fish[(s.spawns[slot%s.spawns.length]+slot)%fish.length][0]);
  p.lastCast=slot;p.combo++;p.flash=1;p.score+=10+Math.min(5,p.combo-1)*2;
 }
 if(intent.type==='jump'&&p.jump<=0)p.jump=.8;
 if(intent.type==='lane')p.lane=clamp(p.lane+(intent.value<0?-1:1),0,2);
 if(intent.type==='hide'&&p.role==='sheep')p.hidden=!p.hidden&&bushes.some(b=>distance(p,b)<65);
 if(['tag','call'].includes(intent.type)&&s.time-p.lastAction>.5){p.lastAction=s.time;
  for(const other of s.players){if(other.role!=='sheep'||other.saved)continue;
   if(p.role==='wolf'&&intent.type==='tag'&&!other.hidden&&distance(p,other)<40)other.lost=true;
   if(p.role==='shepherd'&&intent.type==='call'&&distance(p,other)<90){other.lost=false;other.following=p.id;p.score+=other.called?0:10;other.called=true;}
  }
 }
 return s;
}
export function hazards(s){const t=s.time%15;
 if(s.wave===1)return Array.from({length:7},(_,i)=>({x:60+((i*97+s.seed%71)%580),y:45+((t*105+i*71)%420),r:23}));
 if(s.wave===3)return[{x:235,y:250,r:0},{x:465,y:250,r:0}];
 return [];
}
export function stepMatch(state,dt,inputs={}){
 if(state.status!=='live')return state;
 const s=structuredClone(state);dt=clamp(Number(dt)||0,0,.1);const previous=s.time;s.time=Math.min(s.duration,s.time+dt);
 const wave=Math.min(3,Math.floor(s.time/15));if(wave!==s.wave){s.players.forEach(p=>{p.alive=true;});s.wave=wave;}
 for(const p of s.players){p.jump=Math.max(0,p.jump-dt);p.flash=Math.max(0,(p.flash||0)-dt);p.moving=false;let input=inputs[p.id]||{x:0,y:0};
  if(p.cpu){let target=crates[s.players.indexOf(p)%crates.length];
   if(s.gameId==='lost-sheep'){
    if(p.role==='wolf')target=s.players.find(q=>q.role==='sheep'&&!q.saved&&!q.lost)||bushes[0];
    else target=p.following?s.players.find(q=>q.id===p.following):bushes[s.players.indexOf(p)%bushes.length];
   }
   input={x:Math.sign(target.x-p.x),y:Math.sign(target.y-p.y)};
  }
  if(s.gameId==='lost-sheep'&&p.following&&!p.lost){const leader=s.players.find(q=>q.id===p.following);if(leader&&distance(p,leader)>42)input={x:Math.sign(leader.x-p.x),y:Math.sign(leader.y-p.y)};}
  if(['plague-party','lost-sheep'].includes(s.gameId)&&p.alive&&!p.lost&&!p.saved){let x=clamp(Number(input.x)||0,-1,1),y=clamp(Number(input.y)||0,-1,1),len=Math.hypot(x,y)||1;
   const speed=p.cpu?85:145,nx=clamp(p.x+x/len*speed*dt,28,672),ny=clamp(p.y+y/len*speed*dt,55,460);
   const blocked=(x,y)=>s.gameId==='plague-party'&&walls.some(w=>x>w.x-15&&x<w.x+w.w+15&&y>w.y-15&&y<w.y+w.h+15);
   if(!blocked(nx,p.y))p.x=nx;if(!blocked(p.x,ny))p.y=ny;p.moving=!!(x||y);if(x)p.facing=Math.sign(x);if(x||y)p.hidden=false;
  }
  if(s.gameId==='plague-party'&&p.alive){const t=s.time%15,safe=crates.some(c=>distance(c,p)<49);let hit=false;
   if(t>3&&t<12){if(s.wave===0)hit=!safe&&p.x<(t-3)*90;if(s.wave===1)hit=hazards(s).some(h=>distance(h,p)<h.r+12);if(s.wave===3)hit=!safe&&Math.abs(p.x-350)>65&&p.jump<=0;}
   if(hit){p.alive=false;p.hits++;}else p.score+=dt;
  }
  if(s.gameId==='pharaoh-chase'){
   for(const obstacle of s.course){if(obstacle.at<=s.time&&obstacle.at>previous&&obstacle.lane===p.lane){
    if(obstacle.kind==='coin')p.score+=5;
    else if(['gap','hurdle'].includes(obstacle.kind)&&p.jump<=0&&s.age!=='little'){p.hits++;p.score=Math.max(0,p.score-3);} }
   }p.moving=true;p.x=170+p.lane*180;p.y=395;p.score+=dt;
  }
  if(s.gameId==='lost-sheep'){
   if(p.role==='sheep'&&!p.lost&&distance(p,{x:350,y:435})<60){p.saved=true;p.score=50;}
   if(p.cpu&&p.role==='wolf')for(const q of s.players)if(q.role==='sheep'&&!q.hidden&&!q.saved&&distance(q,p)<40)q.lost=true;
  }
 }
 if(s.time>=s.duration||(s.gameId==='lost-sheep'&&s.players.filter(p=>p.role==='sheep').every(p=>p.saved))){s.status='results';
  if(s.gameId==='lost-sheep'){const sheep=s.players.filter(p=>p.role==='sheep');s.winner=sheep.some(p=>p.saved||!p.lost)?'shepherd':'wolf';s.players.forEach(p=>p.score+=(p.role===s.winner||p.role==='sheep'&&!p.lost)?50:10);}
  else s.winner=[...s.players].sort((a,b)=>b.score-a.score)[0]?.id;
 }
 return s;
}
