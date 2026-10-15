import {test,expect} from '@playwright/test';
import {writeFileSync} from 'node:fs';

test('local fonts, WebGL inspection, responsive layout and context fallback',async({page,isMobile},info)=>{
 const errors:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await page.goto('/');
 const canvas=page.locator('#gear-art');
 await expect(canvas).toHaveAttribute('data-ready','true');
 await page.evaluate(()=>document.fonts.ready);
 expect(await page.evaluate(()=>document.fonts.check('500 14px "HarmonyOS Sans SC"')&&document.fonts.check('400 14px Monocraft'))).toBe(true);
 expect(await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>r.name.includes('fonts.googleapis')).length)).toBe(0);
 await expect(canvas).toHaveAttribute('data-renderer','three-webgl');
 const initial=await canvas.getAttribute('data-rotation');
 await canvas.focus();await page.keyboard.press('ArrowRight');
 await expect(canvas).not.toHaveAttribute('data-rotation',initial!);
 await page.getByRole('button',{name:'放大预览'}).click();
 await expect(canvas).toHaveAttribute('data-zoom','1.120');
 await page.getByRole('button',{name:'复位视角'}).click();
 await expect(canvas).toHaveAttribute('data-rotation',initial!);
 await expect(canvas).toHaveAttribute('data-zoom','1.000');
 if(!isMobile){const box=(await canvas.boundingBox())!;await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+65,box.y+box.height/2+15,{steps:6});await page.mouse.up();await expect(canvas).not.toHaveAttribute('data-rotation',initial!);await page.mouse.wheel(0,-100);await expect(canvas).toHaveAttribute('data-zoom','1.080');}
 else {const box=(await canvas.boundingBox())!;const touch=await page.context().newCDPSession(page);const x=box.x+box.width/2,y=box.y+box.height/2;await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+60,y:y+15}]});await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await touch.detach();await expect(canvas).not.toHaveAttribute('data-rotation',initial!);}
 await canvas.screenshot({path:`artifacts/${info.project.name}-rotated.png`});
 await page.getByRole('button',{name:'自动旋转',exact:true}).click();
 const spin=await canvas.getAttribute('data-rotation');await expect.poll(()=>canvas.getAttribute('data-rotation')).not.toBe(spin);
 await page.getByRole('button',{name:'停止旋转',exact:true}).click();
 await page.getByRole('button',{name:'复位视角'}).click();
 await page.mouse.move(0,0);await canvas.blur();
 const measurements=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,canvas:(()=>{const c=document.querySelector<HTMLCanvasElement>('#gear-art')!;return {...c.dataset,width:c.clientWidth,height:c.clientHeight};})(),fonts:getComputedStyle(document.body).fontFamily}));
 expect(measurements.scrollWidth).toBeLessThanOrEqual(measurements.width);
 expect(Number(measurements.canvas.calls)).toBeLessThan(30);expect(Number(measurements.canvas.geometries)).toBeLessThan(10);
 await page.screenshot({path:`artifacts/${info.project.name}-redesign.png`,fullPage:isMobile});
 await canvas.screenshot({path:`artifacts/${info.project.name}-front.png`});
 writeFileSync(`artifacts/${info.project.name}-inspector.json`,JSON.stringify(measurements,null,2));
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.getByRole('button',{name:'自动旋转',exact:true})).toBeDisabled();
 await canvas.evaluate((c:HTMLCanvasElement)=>{c.getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext();});
 await expect(canvas).toHaveAttribute('data-renderer','canvas-2d-fallback');
 await expect.poll(()=>canvas.evaluate((c:HTMLCanvasElement)=>{const pixels=c.getContext('2d')!.getImageData(0,0,c.width,c.height).data;return pixels.some((v,i)=>i%4===3&&v>0);})).toBe(true);
 await expect(page.getByRole('button',{name:'放大预览'})).toBeDisabled();
 expect(errors).toEqual([]);
});
