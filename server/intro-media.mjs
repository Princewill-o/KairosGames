// Byte ranges let browsers stream/seek the supplied opening video, including iOS.
export function serveIntroMedia(request,asset){
 const binary=atob(asset.data),size=binary.length;
 const headers={'Content-Type':asset.type,'Accept-Ranges':'bytes','Cache-Control':'public, max-age=3600','X-Content-Type-Options':'nosniff'};
 let start=0,end=size-1,status=200;
 const range=request.headers.get('Range');
 if(range&&request.method!=='HEAD'){
  const match=/^bytes=(\d*)-(\d*)$/.exec(range);
  if(!match||(!match[1]&&!match[2]))return new Response(null,{status:416,headers:{...headers,'Content-Range':`bytes */${size}`}});
  if(!match[1]){start=Math.max(0,size-Number(match[2]));}else{start=Number(match[1]);if(match[2])end=Math.min(end,Number(match[2]));}
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start> end||start>=size)return new Response(null,{status:416,headers:{...headers,'Content-Range':`bytes */${size}`}});
  status=206;headers['Content-Range']=`bytes ${start}-${end}/${size}`;
 }
 headers['Content-Length']=String(end-start+1);
 return new Response(request.method==='HEAD'?null:Uint8Array.from(binary.slice(start,end+1),c=>c.charCodeAt(0)),{status,headers});
}
