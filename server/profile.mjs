import {normalizeLibrary} from '../public/library/store.mjs';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
export async function handleProfile(request,env){
 const id=request.headers.get('oai-authenticated-user-id');if(!id)return json({error:'Sign in to save an account profile.'},401);
 if(!['GET','PUT'].includes(request.method))return json({error:'Method not allowed'},405);
 if(request.method==='PUT'){
  if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Origin not allowed'},403);
  if(Number(request.headers.get('content-length'))>65536)return json({error:'Profile too large'},413);
  const raw=await request.text();if(raw.length>65536)return json({error:'Profile too large'},413);
  let body;try{body=JSON.parse(raw);}catch{return json({error:'Invalid profile'},400);}
  try{const library=normalizeLibrary(body);await env.DB.prepare('INSERT INTO arcade_profiles (user_id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at').bind(id,JSON.stringify(library),Date.now()).run();return json({saved:true});}catch{return json({error:'Could not save your profile. Your device copy is still available.'},503);}
 }
 try{const row=await env.DB.prepare('SELECT data FROM arcade_profiles WHERE user_id = ?').bind(id).first();return json({signedIn:true,library:row?normalizeLibrary(JSON.parse(row.data)):null});}catch{return json({error:'Account saves are temporarily unavailable.'},503);}
}
