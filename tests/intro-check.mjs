import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('public');
const types={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4'};
const server=createServer(async(req,res)=>{try{const file=path.resolve(root,'.'+(new URL(req.url,'http://localhost').pathname==='/'?'/index.html':new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep))throw new Error();const bytes=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(bytes);}catch{res.writeHead(404);res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.goto(url);assert.equal(await page.locator('#site-intro').count(),1,'intro is present before any click');
 assert.equal(await page.locator('#app').evaluate(el=>el.inert),true);
 assert.equal(await page.locator('#intro-video').evaluate(el=>el.paused),true);
 const bounds=await page.locator('#site-intro').boundingBox();assert.equal(bounds.width,1440);assert.equal(bounds.height,900);
 await page.locator('#intro-start').click();
 await page.waitForFunction(()=>document.querySelector('#intro-video').currentTime>0);
 assert.equal(await page.locator('#site-intro').getAttribute('data-state'),'playing');
 // Exercise the real media-ended event near the end, rather than waiting through the full clip.
 await page.locator('#intro-video').evaluate(v=>{v.currentTime=v.duration-.25;});
 await page.waitForSelector('#site-intro',{state:'detached'});
 assert.equal(await page.locator('#app').evaluate(el=>el.inert),false);
 assert.equal(await page.locator('body').evaluate(el=>el.classList.contains('intro-active')),false);
 await page.goto(url);await page.locator('#intro-start').focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('#intro-video').currentTime>0);await page.locator('#intro-skip').click();await page.waitForSelector('#site-intro',{state:'detached'});
 await page.setViewportSize({width:390,height:844});await page.goto(url);assert.equal((await page.locator('#site-intro').boundingBox()).height,844);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/tmp/kairos-intro-mobile.png'});
 await page.locator('#intro-start').click();await page.waitForFunction(()=>document.querySelector('#intro-video').currentTime>0);await page.screenshot({path:'/tmp/kairos-intro-video.png'});
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#intro-skip').click();await page.waitForSelector('#site-intro',{state:'detached'});
 await page.route('**/intro.mp4',route=>route.abort());await page.goto(url);await page.locator('#intro-start').click();await page.waitForFunction(()=>!document.querySelector('#intro-status').hidden);assert.match(await page.locator('#intro-status').innerText(),/play|load/i);await page.locator('#intro-skip').click();await page.waitForSelector('#site-intro',{state:'detached'});
 console.log('PASS fullscreen poster, click/keyboard playback, real video end, fade, mobile, skip, reduced motion and media failure recovery');
}finally{await browser.close();await new Promise(r=>server.close(r));}
