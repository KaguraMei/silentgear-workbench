import {test,expect} from '@playwright/test';
import {createServer,type Server} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
let server:Server;let origin:string;
test.beforeAll(async()=>{
 const root=resolve('dist');
 server=createServer(async(req,res)=>{
  const url=new URL(req.url!,'http://localhost');
  if(!url.pathname.startsWith('/silentgear-workbench/')){res.writeHead(404);res.end();return;}
  const path=resolve(root,decodeURIComponent(url.pathname.slice('/silentgear-workbench/'.length))||'index.html');
  if(!path.startsWith(root)){res.writeHead(403);res.end();return;}
  try{const file=await readFile(path);const types:Record<string,string>={'.html':'text/html','.js':'application/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png'};res.setHeader('Content-Type',types[extname(path)]||'text/plain');res.end(file);}catch{res.writeHead(404);res.end();}
 });
 await new Promise<void>(done=>server.listen(0,'127.0.0.1',done));
 origin=`http://127.0.0.1:${(server.address() as {port:number}).port}`;
});
test.afterAll(async()=>{await new Promise<void>(done=>server.close(()=>done()));});
test('GitHub Pages repository subpath resolves every local asset',async({page},info)=>{
 test.skip(info.project.name!=='desktop-chrome','Static path check shared across browser targets.');
 const failed:string[]=[];page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
 await page.goto(origin+'/silentgear-workbench/');
 await expect(page.locator('#gear-art')).toHaveAttribute('data-ready','true');
 await page.evaluate(()=>document.fonts.ready);
 const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name));
 expect(resources.filter(url=>url.endsWith('.woff2'))).toHaveLength(3);
 expect(resources.every(url=>url.startsWith(origin+'/silentgear-workbench/'))).toBe(true);
 await page.getByRole('button',{name:'计算范围与数据来源'}).click();
 await expect(page.getByRole('dialog')).toContainText('HarmonyOS Sans SC');
 expect(failed).toEqual([]);
});
