// Serve Unity exports outside the Worker bundle; forward the existing site/API unchanged.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../unity-build/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.json':'application/json','.js':'text/javascript','.wasm':'application/wasm','.data':'application/octet-stream','.png':'image/png','.css':'text/css'};
const port=Number(process.env.UNITY_PREVIEW_PORT||4174);
http.createServer(async(req,res)=>{
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(!pathname.startsWith('/unity-build/')){
  const upstream=http.request({hostname:'127.0.0.1',port:4173,path:req.url,method:req.method,headers:{...req.headers,host:'localhost:4173'}},response=>{res.writeHead(response.statusCode,response.headers);response.pipe(res);});
  upstream.on('error',()=>{res.writeHead(503);res.end('Start npm run dev on port 4173 first.');});req.pipe(upstream);return;
 }
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
 try{
  const target=path.resolve(root,decodeURIComponent(pathname.slice('/unity-build/'.length)));
  if(!target.startsWith(root))throw Error();
  const data=await fs.readFile(target);
  res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404);res.end('Unity export not installed.');}
}).listen(port,'127.0.0.1',()=>console.log(`Unity + Kairos preview: http://localhost:${port}/#unity/ark-park`));
