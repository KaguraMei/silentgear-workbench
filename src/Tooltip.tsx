import {createContext,useContext,useEffect,useId,useLayoutEffect,useRef,useState,type ReactNode} from 'react';
type Tip={content:ReactNode;rect:DOMRect;id:string};
const Context=createContext<{tip:Tip|null;show:(t:Tip)=>void;hide:()=>void}>({tip:null,show:()=>{},hide:()=>{}});
export function TooltipProvider({children}:{children:ReactNode}){
 const [tip,setTip]=useState<Tip|null>(null),[pos,setPos]=useState({left:0,top:0}),ref=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{if(!tip||!ref.current)return;const r=ref.current.getBoundingClientRect();setPos({left:Math.max(12,Math.min(innerWidth-r.width-12,tip.rect.left-r.width-12)),top:Math.max(12,Math.min(innerHeight-r.height-12,tip.rect.top))});},[tip]);
 useEffect(()=>{const close=()=>setTip(null);const key=(e:KeyboardEvent)=>{if(e.key==='Escape')close();};window.addEventListener('scroll',close,true);window.addEventListener('resize',close);window.addEventListener('keydown',key);return()=>{window.removeEventListener('scroll',close,true);window.removeEventListener('resize',close);window.removeEventListener('keydown',key);};},[]);
 return <Context.Provider value={{tip,show:setTip,hide:()=>setTip(null)}}>{children}{tip&&<div id={tip.id} className="tooltip" role="tooltip" ref={ref} style={pos}>{tip.content}</div>}</Context.Provider>;
}
export function Hint({children,content,className='',onClick,label}:{children:ReactNode;content:ReactNode;className?:string;onClick?:()=>void;label?:string}){
 const {tip,show,hide}=useContext(Context),id=useId();const open=(el:HTMLElement)=>show({id,content,rect:el.getBoundingClientRect()});
 return <button className={className} aria-label={label} aria-describedby={tip?.id===id?id:undefined} onPointerEnter={e=>{if(e.pointerType==='mouse'&&matchMedia('(hover: hover)').matches)open(e.currentTarget);}} onPointerLeave={hide} onFocus={e=>{if(!onClick||matchMedia('(hover: hover)').matches)open(e.currentTarget);}} onBlur={hide} onClick={e=>{if(onClick){hide();onClick();}else if(tip?.id!==id)open(e.currentTarget);}}>{children}</button>;
}
