export class LanTransport{
 constructor(onMessage,onClose){this.onMessage=onMessage;this.onClose=onClose;this.socket=null;}
 connect({host,code,name,character,age,clientId}){return new Promise((resolve,reject)=>{
  let url;try{url=new URL(host.includes('://')?host:`http://${host}`);if(!['http:','https:'].includes(url.protocol))throw Error();}catch{reject(Error('Enter the laptop address, such as 192.168.1.24:17831.'));return;}
  if(location.protocol==='https:'&&url.protocol==='http:'){reject(Error('Open the laptop’s http:// address in your browser first, then join there. This secure page cannot connect to an insecure relay.'));return;}
  url.protocol=url.protocol==='https:'?'wss:':'ws:';url.pathname='/';url.search=new URLSearchParams({code,name,character,age,clientId}).toString();const ws=this.socket=new WebSocket(url);let welcomed=false;
  const timeout=setTimeout(()=>{ws.close();reject(Error('Could not reach the laptop. Check the address and use the same Wi-Fi.'));},5000);
  ws.onmessage=e=>{let m;try{m=JSON.parse(e.data);}catch{return;}if(m.t==='error'&&!welcomed){clearTimeout(timeout);reject(Error(m.reason));ws.close();return;}if(m.t==='welcome'){welcomed=true;clearTimeout(timeout);resolve(m);}this.onMessage(m);};
  ws.onerror=()=>{clearTimeout(timeout);reject(Error('Connection failed. Check that the laptop relay is running.'));};ws.onclose=()=>{clearTimeout(timeout);this.onClose();};
 });}
 send(m){if(this.socket?.readyState===WebSocket.OPEN)this.socket.send(JSON.stringify(m));}
 disconnect(){if(this.socket){this.socket.onclose=null;this.socket.close();this.socket=null;}}
}
