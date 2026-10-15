import {useEffect,useRef,useState} from 'react';
import E from './engine.js';
import {data} from './data-model';
type Build=ReturnType<typeof E.defaultBuild>;
const textureSet=new Set(data.textures),images=new Map<string,Promise<HTMLImageElement>>();
function load(url:string){if(!images.has(url))images.set(url,new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('贴图加载失败'));im.src=import.meta.env.BASE_URL+url;}));return images.get(url)!;}
export function BackgroundCanvas(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{const canvas=ref.current!,ctx=canvas.getContext('2d')!;function draw(){const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#101714';ctx.fillRect(0,0,w,h);const gradient=ctx.createRadialGradient(w*.5,h*.43,20,w*.5,h*.43,w*.52);gradient.addColorStop(0,'#2a3e2b');gradient.addColorStop(.5,'#18261e');gradient.addColorStop(1,'#101714');ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h);ctx.strokeStyle='#a9c9aa09';ctx.lineWidth=1;ctx.beginPath();for(let x=w%40;x<w;x+=40){ctx.moveTo(x,0);ctx.lineTo(x,h);}for(let y=h%40;y<h;y+=40){ctx.moveTo(0,y);ctx.lineTo(w,y);}ctx.stroke();ctx.fillStyle='#adc5ac35';for(let x=w%160;x<w;x+=160)for(let y=h%160;y<h;y+=160){ctx.fillRect(x-2,y,5,1);ctx.fillRect(x,y-2,1,5);}ctx.strokeStyle='#b4cea212';ctx.beginPath();ctx.moveTo(w/2,0);ctx.lineTo(w/2,h);ctx.stroke();}draw();window.addEventListener('resize',draw);return()=>window.removeEventListener('resize',draw);},[]);
 return <canvas id="world" ref={ref} aria-hidden="true"/>;
}
export function GearArt({build}:{build:Build}){
 const ref=useRef<HTMLCanvasElement>(null),[failed,setFailed]=useState(false);
 useEffect(()=>{let cancelled=false;setFailed(false);const draw=async()=>{const buffer=document.createElement('canvas');buffer.width=64;buffer.height=64;const ctx=buffer.getContext('2d')!;ctx.imageSmoothingEnabled=false;let painted=0;
  for(const slot of ['rod','main','coating','binding','grip','cord','tip','fletching','adornment']){const part=build.parts[slot];if(!part?.material)continue;const mat=data.materials[part.material];const layers=E.chain(build.gear).map(g=>mat.model?.[slot+'/'+g]).find(Boolean)||[];
   for(const layer of layers){let suffix=layer.texture.split(':').pop()!,path='textures/'+build.gear+'/'+suffix+'.png';if(!textureSet.has(path)){path='textures/'+build.gear+'/'+slot+'_generic_hc.png';if(!textureSet.has(path))continue;}const im=await load(path);const tmp=document.createElement('canvas');tmp.width=64;tmp.height=64;const tc=tmp.getContext('2d')!;tc.imageSmoothingEnabled=false;tc.drawImage(im,0,0,64,64);if(layer.color){tc.globalCompositeOperation='multiply';tc.fillStyle=layer.color;tc.fillRect(0,0,64,64);tc.globalCompositeOperation='destination-in';tc.drawImage(im,0,0,64,64);}ctx.drawImage(tmp,0,0);painted++;}
   if(slot==='main'&&textureSet.has('textures/'+build.gear+'/guard_generic_hc.png')){const im=await load('textures/'+build.gear+'/guard_generic_hc.png');ctx.drawImage(im,0,0,64,64);}
  }
  if(!cancelled&&ref.current){const out=ref.current.getContext('2d')!;out.clearRect(0,0,256,256);out.imageSmoothingEnabled=false;out.drawImage(buffer,0,0,256,256);setFailed(painted===0);}
 };draw().catch(()=>{if(!cancelled)setFailed(true);});return()=>{cancelled=true;};},[build.gear,build.parts]);
 return <><canvas id="gear-art" width="256" height="256" ref={ref} aria-label={E.names[build.gear]+'材质示意图'}/>{failed&&<span className="art-error">贴图加载失败，属性计算仍可使用</span>}</>;
}
