import E from './engine.js';
export const presets=[
 {name:'轻装启程',description:'铁剑 + 橡木杆。用基础装备了解材料的变化。',gear:'sword',parts:{main:'iron',rod:'wood/oak'}},
 {name:'黑曜锋刃',description:'强化黑曜石 + 钛杆 + 石英尖端 + 下界合金涂层，偏重近战面板。',gear:'sword',parts:{main:'refined_obsidian',rod:'titanium',tip:'quartz',coating:'netherite',grip:'phantom_membrane'}},
 {name:'矿脉探寻',description:'绯红钢镐 + 橡木杆 + 钻石尖端，兼顾采掘与耐久。',gear:'pickaxe',parts:{main:'crimson_steel',rod:'wood/oak',tip:'diamond'}},
 {name:'坚实壁垒',description:'强化黑曜石胸甲 + 下界合金涂层。查看单件护甲与韧性。',gear:'chestplate',parts:{main:'refined_obsidian',coating:'netherite'}},
 {name:'远行之弓',description:'钻石弓身 + 橡木杆 + 丝线弓弦。探索远程属性。',gear:'bow',parts:{main:'diamond',rod:'wood/oak',cord:'string'}}
];
export function fromPreset(index:number){const p=presets[index],b=E.defaultBuild(p.gear);for(const [slot,material] of Object.entries(p.parts))if(material&&E.compatible(material,p.gear,slot))b.parts[slot].material=material;return E.validate(b);}
