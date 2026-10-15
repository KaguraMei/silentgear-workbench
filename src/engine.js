/* Silent Gear 3.6.7 data calculator. Pure material per compound part. */
import D from './data.js';
  const short = s => String(s).split(':').pop();
  const parents = {tool:'all',weapon:'tool',harvest_tool:'tool',melee_weapon:'weapon',ranged_weapon:'weapon',armor:'all',projectile:'all',curio:'all',axe:'harvest_tool',saw:'axe',pickaxe:'harvest_tool',hammer:'pickaxe',prospector_hammer:'pickaxe',shovel:'harvest_tool',excavator:'shovel',hoe:'harvest_tool',mattock:'harvest_tool',paxel:'harvest_tool',shears:'harvest_tool',sickle:'harvest_tool',fishing_rod:'tool',shield:'tool',arrow:'projectile',ring:'curio',bracelet:'curio'};
  for (const x of ['sword','katana','dagger','knife','machete','spear','trident']) parents[x]='melee_weapon';
  for (const x of ['bow','crossbow','slingshot']) parents[x]='ranged_weapon';
  for (const x of ['helmet','chestplate','leggings','boots','elytra']) parents[x]='armor';
  const names = {sword:'剑',katana:'太刀',dagger:'匕首',knife:'小刀',machete:'砍刀',spear:'长矛',trident:'三叉戟',bow:'弓',crossbow:'弩',slingshot:'弹弓',axe:'斧',saw:'锯',pickaxe:'镐',hammer:'锤',prospector_hammer:'探矿锤',shovel:'锹',excavator:'挖掘铲',hoe:'锄',mattock:'鹤嘴锄',paxel:'镐斧',shears:'剪刀',sickle:'镰刀',fishing_rod:'钓鱼竿',shield:'盾牌',arrow:'箭',ring:'戒指',bracelet:'手镯',helmet:'头盔',chestplate:'胸甲',leggings:'护腿',boots:'靴子',elytra:'鞘翅'};
  const slotNames={main:'主体',rod:'工具杆',tip:'尖端',binding:'绑定',grip:'握把',coating:'涂层',cord:'弓弦',lining:'内衬',fletching:'箭羽',adornment:'饰件'};
  const grades={NONE:0,E:.01,D:.02,C:.03,B:.04,A:.05,S:.1,SS:.15,SSS:.25,MAX:.3};
  const gradeStats=new Set('durability armor_durability enchantment_value harvest_speed melee_damage magic_damage ranged_damage armor armor_toughness knockback_resistance magic_armor'.split(' '));
  const synergyStats=new Set([...gradeStats,'projectile_speed']);
  const durabilityMult={helmet:11,chestplate:16,leggings:15,boots:13,elytra:25,shield:337/15};
  function chain(gear){const a=[];for(let x=gear;x;x=parents[x])a.push(x);return a;}
  function is(gear,type){return chain(gear).includes(short(type));}
  function lookup(map,stat,gear){for(const x of chain(gear)){if(map?.[stat+'/'+x]!==undefined)return map[stat+'/'+x];}return map?.[stat];}
  function mods(value){if(value===undefined)return [];if(typeof value==='number')return [{op:'avg',v:value}];if(Array.isArray(value))return value.flatMap(mods);if(Object.hasOwn(value,'value'))return [{op:(value.op||'avg').toLowerCase(),v:value.value}];return Object.entries(value).map(([op,v])=>({op:op.toLowerCase(),v}));}
  function average(a){if(!a.length)return 0;let primary=-1;for(const v of a)if(primary<0)primary=v;primary=primary>0?primary:1;let sum=0,wSum=0;a.forEach((v,i)=>{let w=Math.pow(Math.max(2,Math.min(40,2+2*(v-primary)/primary)),-.5-.5*(i+1));sum+=v*w;wSum+=w;});return sum/wSum;}
  function compute(a,base=0){let groups={avg:[],max:[],mul1:[],mul2:[],add:[]};for(const m of a)if(groups[m.op])groups[m.op].push(m.v);let v=Math.max(base+average(groups.avg),...groups.max);v*=1+groups.mul1.reduce((a,b)=>a+b,0);for(const m of groups.mul2)v*=1+m;return v+groups.add.reduce((a,b)=>a+b,0);}
  function clamp(v,stat){const limits={armor_durability:[0,Math.floor(2147483647/16)],attack_speed:[-3.9,4],attack_reach:[0,100],reach_distance:[-100,100],ranged_speed:[-10,10],projectile_accuracy:[0,10000],repair_efficiency:[0,1000],repair_value:[0,1000]};const [lo,hi]=limits[stat]||[0,2147483647];return Math.max(lo,Math.min(hi,v));}
  const toolExcluded='armor_durability repair_value ranged_damage ranged_speed projectile_accuracy projectile_speed armor armor_toughness magic_armor knockback_resistance'.split(' ');
  const armorExcluded='repair_value harvest_speed reach_distance melee_damage magic_damage attack_speed attack_reach ranged_damage ranged_speed'.split(' ');
  function excludedStats(g){
    if(is(g,'curio'))return Object.keys(D.stats).filter(s=>s!=='durability');
    if(is(g,'armor'))return armorExcluded;
    if(g==='shield')return armorExcluded.filter(s=>s!=='repair_value');
    if(g==='arrow')return 'armor_durability repair_value melee_damage attack_speed attack_reach ranged_speed armor armor_toughness magic_armor knockback_resistance'.split(' ');
    if(is(g,'ranged_weapon'))return 'armor_durability repair_value harvest_speed reach_distance melee_damage armor armor_toughness magic_armor knockback_resistance'.split(' ');
    return g==='fishing_rod'?[...toolExcluded,'harvest_speed']:toolExcluded;
  }
  function relevantStats(g){
    if(is(g,'curio'))return ['durability'];
    if(g==='elytra')return ['durability','repair_efficiency','armor'];
    if(is(g,'armor'))return 'durability repair_efficiency enchantment_value armor magic_armor armor_toughness knockback_resistance'.split(' ');
    if(g==='shield')return ['durability','enchantment_value'];
    if(g==='arrow')return 'durability repair_efficiency ranged_damage projectile_speed projectile_accuracy'.split(' ');
    if(is(g,'ranged_weapon'))return 'durability repair_efficiency enchantment_value ranged_damage ranged_speed'.split(' ');
    if(g==='fishing_rod')return ['durability','repair_efficiency','enchantment_value'];
    return 'durability repair_efficiency enchantment_value harvest_speed melee_damage attack_speed'.split(' ');
  }
  function category(g){return is(g,'weapon')?'weapon':is(g,'harvest_tool')?'tool':is(g,'armor')||g==='shield'?'armor':'other';}
  const gears=Object.entries(D.parts).filter(([,p])=>p.part_type==='silentgear:main').map(([part,p])=>({id:p.gear_type,name:names[p.gear_type],part,category:category(p.gear_type)}));
  function partId(g,s){return s==='main'?gears.find(x=>x.id===g)?.part:s==='cord'?'bowstring':s;}
  function materialCount(g,s){return D.partMaterialCounts?.[partId(g,s)]??(g==='shield'&&s==='main'?2:1);}
  function slots(g){if(g==='elytra')return ['main','binding','lining'];if(is(g,'armor'))return ['main','tip','lining','coating'];if(g==='arrow')return ['main','rod','fletching','coating'];if(is(g,'curio'))return ['main','adornment','coating'];return ['main','rod',...(is(g,'ranged_weapon')||g==='fishing_rod'?['cord']:[]),'tip','binding','grip','coating'];}
  function required(g,s){return s==='main'||s==='rod'||s==='cord'||s==='fletching'||s==='adornment'||(g==='elytra'&&s==='binding');}
  const excluded=new Set(['barrier','example','metal_alloy','hybrid_gem','mixed_fabric','sheet_metal']);
  function compatible(id,g,s){const m=Object.hasOwn(D.materials,id)?D.materials[id]:null;if(!m||!names[g]||!slots(g).includes(s)||excluded.has(id)||m.availability?.visible===false||!(s in (m.stats||{})))return false;if((m.availability?.gear_blacklist||[]).some(x=>is(g,short(x))))return false;if(s==='main'){const categories=D.partCategories?.[partId(g,s)]||[];if(categories.length&&!categories.some(c=>(m.availability?.categories||[]).includes(c)))return false;let stat=durabilityMult[g]?'armor_durability':'durability';return compute(mods(lookup(m.stats.main,stat,g)))>0;}return true;}
  function materials(g,s){return Object.values(D.materials).filter(m=>compatible(m.id,g,s));}
  function defaultBuild(g='sword'){let parts={};for(const s of slots(g)){const choices={main:g==='elytra'?'phantom_membrane':'refined_obsidian',rod:'wood/oak',cord:'string',fletching:'feather',adornment:'diamond',binding:'string'};let id=choices[s];parts[s]={material:required(g,s)?(compatible(id,g,s)?id:materials(g,s)[0]?.id||null):null,grade:'NONE',star:0};}return {version:1,gear:g,wear:0,parts};}
  function validate(value){if(!value||value.version!==1||!gears.some(g=>g.id===value.gear))throw new Error('不是受支持的配装文件');let b=defaultBuild(value.gear);b.wear=Math.max(0,Math.min(90,Number(value.wear)||0));for(const s of slots(b.gear)){const p=value.parts?.[s];if(!p)continue;if(p.material===null&&!required(b.gear,s)){b.parts[s].material=null;continue;}if(!compatible(p.material,b.gear,s))throw new Error(slotNames[s]+'材料不兼容');b.parts[s]={material:p.material,grade:Object.hasOwn(grades,p.grade)?p.grade:'NONE',star:Math.max(0,Math.min(3,Math.floor(Number(p.star)||0)))};}for(const s of slots(b.gear))if(required(b.gear,s)&&!compatible(b.parts[s].material,b.gear,s))throw new Error(slotNames[s]+'缺少有效材料');return b;}
  function condition(c,g,count=1){if(!c||typeof c.type!=='string')return false;switch(short(c.type)){case 'gear_type':return is(g,c.gear_type);case 'material_ratio':return 1>=c.ratio;case 'material_count':return count>=c.count;case 'or':return c.values.some(x=>condition(x,g,count));case 'and':return c.values.every(x=>condition(x,g,count));case 'not':return !condition(c.value,g,count);default:return false;}}
  // TraitHelper checks only the earlier trait's cancellation list, in insertion order.
  function cancel(list){const a=list.map(t=>({...t,sources:[...t.sources]}));for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length&&a[i].level>0;j++){if(a[j].level<=0)continue;if((D.traits[a[i].id].cancels_with||[]).includes('silentgear:'+a[j].id)){let n=Math.min(a[i].level,a[j].level);a[i].level-=n;a[j].level-=n;a[i].reason='与「'+D.traits[a[j].id].name+'」抵消 '+n+' 级';a[j].reason='与「'+D.traits[a[i].id].name+'」抵消 '+n+' 级';}}return a;}
  function partTraits(m,s,g){return (m.traits?.[s]||[]).map(t=>{let id=short(t.name),def=D.traits[id];let ok=[...(t.conditions||[]),...(def.conditions||[])].every(c=>condition(c,g,materialCount(g,s)));return {id,level:Math.max(1,Math.min(t.level??1,def.max_level)),originalLevel:t.level,sources:[slotNames[s]+' · '+m.name],valid:ok,reason:ok?'':'装备类型或材料数量条件未满足'};});}
  function charge(v,op,stat,L,g){if(!L||!['avg','max','add'].includes(op))return v;const q=L;switch(stat){case 'durability':return v*Math.pow(1.25,q);case 'armor_durability':return v*Math.pow(1.1,q);case 'harvest_speed':return v+1.5*L*q;case 'melee_damage':case 'magic_damage':return v+q;case 'armor':return v+q/2*(['helmet','chestplate','leggings','boots'].includes(g)?1:4);case 'ranged_damage':case 'armor_toughness':case 'magic_armor':return v+q/2;default:return v;}}
  function calculate(input){const b=validate(input),g=b.gear,allMods={},rawTraits=[],partDetails=[],omitted=new Set(excludedStats(g)),relevant=new Set(relevantStats(g));
    for(const s of slots(g)){const p=b.parts[s];if(!p.material)continue;const m=D.materials[p.material];let ts=partTraits(m,s,g),local=cancel(ts.filter(t=>t.valid));rawTraits.push(...ts.filter(t=>!t.valid),...local.map(t=>({...t,valid:t.level>0})));let synergy=1;for(const t of local.filter(t=>t.level>0)){let d=D.traits[t.id];if(d.type==='silentgear:synergy'&&synergy>(d.applicable_range?.min??0)&&synergy<(d.applicable_range?.max??Infinity))synergy+=t.level*d.synergy_multi;}synergy=Math.max(.1,Math.min(2,synergy));partDetails.push({slot:s,material:m.id,synergy});
      const base=s==='main'?D.parts[gears.find(x=>x.id===g).part].stats||{}:{};
      for(const stat of Object.keys(D.stats)){let a=mods(lookup(m.stats[s],stat,g)).map(x=>({...x}));if(p.star&&stat==='charging_value')a=[];
        for(const x of a){if(gradeStats.has(stat))x.v+=Math.abs(x.v)*grades[p.grade];x.v=charge(x.v,x.op,stat,p.star,g);}
        // A pure part still stores one material instance per crafting ingredient.
        a=Array.from({length:materialCount(g,s)},()=>a).flat();
        a.push(...mods(lookup(base,stat,g)));const combined=[];for(const op of ['avg','max','mul1','mul2','add']){const values=a.filter(x=>x.op===op).map(x=>x.v);if(!values.length)continue;let v=op==='max'?Math.max(...values):average(values);if(synergyStats.has(stat))v+=Math.abs(v)*(synergy-1);combined.push({op,v});}
        (allMods[stat]??=[]).push(...combined);
      }
    }
    const activeMap=new Map(),inactive=rawTraits.filter(t=>!t.valid);
    for(const t of rawTraits.filter(t=>t.valid)){if(activeMap.has(t.id)){let old=activeMap.get(t.id);old.level=Math.max(old.level,t.level);old.sources.push(...t.sources);}else activeMap.set(t.id,{...t,sources:[...t.sources]});}
    const merged=cancel([...activeMap.values()]);inactive.push(...merged.filter(t=>t.level===0));const traits=merged.filter(t=>t.level>0),stats={};
    for(const stat of Object.keys(D.stats)){if(omitted.has(stat)){stats[stat]=0;continue;}let v=clamp(compute(allMods[stat],stat==='attack_reach'?3:0),stat);if(stat==='armor_toughness'||stat==='magic_armor')v/=4;
      for(const t of traits){const def=D.traits[t.id];if(def.type!=='silentgear:stat_modifier')continue;for(const mod of def.stats||[]){if(short(mod.name)===stat)v+=mod.value*t.level*(mod.factor_damage!==false?b.wear/100:1)*(mod.factor_value!==false?v:1);}}
      stats[stat]=clamp(v,stat);if(!allMods[stat].length&&v===0&&relevant.has(stat)&&['projectile_speed','projectile_accuracy','repair_efficiency','repair_value','charging_value'].includes(stat))stats[stat]=1;
    }
    stats.final_durability=g==='arrow'?256:durabilityMult[g]?(g==='shield'?Math.round(stats.armor_durability*durabilityMult[g]):Math.round(stats.armor_durability)*durabilityMult[g]):Math.round(stats.durability);
    stats.attack_damage=omitted.has('melee_damage')?0:1+stats.melee_damage;stats.attacks_per_second=omitted.has('attack_speed')?0:4+stats.attack_speed;stats.armor_bonus=0;
    for(const t of traits){const def=D.traits[t.id];for(const a of def.attribute_modifiers?.all||[]){if(a.attribute==='minecraft:generic.armor'&&a.operation===0)stats.armor_bonus+=a.value[Math.min(t.level,a.value.length)-1];}}
    stats.final_armor=stats.armor+stats.armor_bonus;stats.knockback_percent=stats.knockback_resistance*10;
    let tiers=partDetails.map(p=>D.materials[p.material]).filter(m=>m.harvest_tier).sort((a,b)=>(b.availability?.tier||0)-(a.availability?.tier||0));
    return {build:b,stats,traits,inactive,parts:partDetails,tier:tiers[0]?.harvest_tier||'minecraft:wood',excludedStats:[...omitted],relevantStats:[...relevant]};
  }
  const api={gears,names,slotNames,grades,slots,required,compatible,materials,defaultBuild,validate,calculate,chain,is,category,lookup,mods,compute,average,excludedStats,relevantStats,materialCount};
export default api;
