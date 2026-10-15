import test from 'node:test';
import assert from 'node:assert/strict';
import E from '../src/engine.js';
import D from '../src/data.js';

const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);
function build(gear = 'sword', material = 'iron') {
  const b = E.defaultBuild(gear);
  b.parts.main.material = material;
  return b;
}
function fixtureMaterial(id, definition, callback) {
  assert.equal(D.materials[id], undefined);
  D.materials[id] = {id, name: id, english: id, color: '#ffffff', ...definition};
  try { callback(); } finally { delete D.materials[id]; }
}

test('known unenchanted iron, diamond and refined obsidian sword damage', () => {
  for (const [material, damage, durability] of [['iron', 6, 250], ['diamond', 7, 1561], ['refined_obsidian', 14, 2500]]) {
    const r = E.calculate(build('sword', material));
    near(r.stats.attack_damage, damage);
    assert.equal(r.stats.final_durability, durability);
  }
  near(E.calculate(build()).stats.attacks_per_second, 1.6);
});

test('component grades alter material stats but not the sword head +3 modifier', () => {
  const b = build();
  b.parts.main.grade = 'MAX';
  const r = E.calculate(b);
  near(r.stats.attack_damage, 6.6); // 1 player + 2*1.3 material + 3 head
  near(r.stats.enchantment_value, 18.2);
  assert.equal(r.stats.final_durability, 325);
  near(r.stats.attacks_per_second, 1.6);
});

test('local 3.6.7 star charging uses q=level and follows grading', () => {
  const b = build();
  b.parts.main.grade = 'MAX';
  b.parts.main.star = 3;
  const r = E.calculate(b);
  near(r.stats.attack_damage, 9.6);
  near(r.stats.durability, 325 * 1.25 ** 3);
  near(r.stats.harvest_speed, 6 * 1.3 + 13.5);
  near(r.stats.enchantment_value, 14 * 1.3);
  near(r.stats.charging_value, 0); // removed modifier; not a relevant-stat default
});

test('iron armor uses explicit slot values and rounds durability before multiplying', () => {
  for (const [g, armor, durability] of [['helmet', 2, 165], ['chestplate', 6, 240], ['leggings', 5, 225], ['boots', 2, 195]]) {
    const r = E.calculate(build(g));
    near(r.stats.final_armor, armor);
    near(r.stats.magic_armor, 1.5);
    assert.equal(r.stats.final_durability, durability);
    assert.equal(r.stats.attack_damage, 0);
  }
  const b = build('helmet'); b.parts.main.grade = 'S';
  assert.equal(E.calculate(b).stats.final_durability, 187); // round(16.5)*11
});

test('armor charge and netherite coating respect the toughness division', () => {
  const b = build('chestplate', 'diamond');
  b.parts.main.star = 3;
  b.parts.coating.material = 'netherite';
  const r = E.calculate(b);
  near(r.stats.final_armor, 9.5);
  near(r.stats.armor_toughness, (8 + 1.5 + 4) / 4);
  near(r.stats.knockback_percent, 10);
});

test('shield and arrow use their distinct actual durability rules', () => {
  assert.equal(E.calculate(build('shield')).stats.final_durability, 337);
  const arrow = build('arrow', 'diamond'); arrow.parts.main.star = 3;
  assert.equal(E.calculate(arrow).stats.final_durability, 256);
  assert.ok(E.calculate(arrow).stats.durability > 256);
});

test('stat operations are AVG/MAX, additive multipliers, compounded multipliers, then additions', () => {
  near(E.compute([{op:'avg',v:10},{op:'max',v:20},{op:'mul1',v:.1},{op:'mul1',v:.2},{op:'mul2',v:.5},{op:'add',v:3}]), 42);
  const w1=.5, w2=4**-1.5;
  near(E.average([10,20]), (10*w1+20*w2)/(w1+w2));
  assert.deepEqual(E.mods({value:2,op:'ADD'}), [{op:'add',v:2}]);
});

test('wear-sensitive traits apply in order and are zero at full durability', () => {
  const fresh = build('sword', 'obsidian');
  near(E.calculate(fresh).stats.attack_damage, 7);
  fresh.wear = 50;
  near(E.calculate(fresh).stats.attack_damage, 1 + 6 * (1 + .1667 * 3 * .5) * (1 - .1667 * 2 * .5));
});

test('duplicate component traits take maximum level, not sum', () => {
  const b = build(); b.parts.rod.material = 'iron';
  const r = E.calculate(b);
  assert.equal(r.traits.find(t=>t.id==='magnetic').level, 3);
  assert.equal(r.traits.find(t=>t.id==='magnetic').sources.length, 2);
});

test('gear conditions suppress harvest-only traits on swords', () => {
  assert.ok(E.calculate(build('sword','diamond')).inactive.some(t=>t.id==='lustrous'));
  assert.ok(E.calculate(build('pickaxe','diamond')).traits.some(t=>t.id==='lustrous'));
  assert.ok(E.calculate(build('helmet','refined_obsidian')).inactive.some(t=>t.id==='hard'));
});

test('one-ingredient part count conditions fail and levels are capped', () => {
  fixtureMaterial('test_count', {stats:{main:{durability:10}}, traits:{main:[{name:'silentgear:magnetic',level:99,conditions:[{type:'silentgear:material_count',count:2}]},{name:'silentgear:malleable',level:99}]}}, () => {
    const r = E.calculate(build('dagger','test_count'));
    assert.ok(r.inactive.some(t=>t.id==='magnetic'));
    assert.equal(r.traits.find(t=>t.id==='malleable').level, D.traits.malleable.max_level);
  });
});

test('pure turtle helmet counts five ingredient instances, enabling Turtle', () => {
  const r=E.calculate(build('helmet','turtle'));
  assert.equal(E.materialCount('helmet','main'),5);
  assert.equal(E.materialCount('sword','main'),2);
  assert.equal(E.materialCount('shield','main'),2);
  assert.ok(r.traits.some(t=>t.id==='turtle'));
});

test('pure repeated material modifiers precede the head in weighted compression', () => {
  fixtureMaterial('test_weighted', {stats:{main:{durability:10,melee_damage:{add:2}}}}, () => {
    const result=E.calculate(build('sword','test_weighted'));
    const w1=.5,w2=2**-1.5,w3=3**-2;
    near(result.stats.attack_damage,1+(2*w1+2*w2+3*w3)/(w1+w2+w3));
  });
});

test('asymmetric cancellations follow trait insertion order', () => {
  fixtureMaterial('test_organic', {stats:{main:{durability:10},rod:{}},traits:{main:[{name:'silentgear:organic',level:2}],rod:[{name:'silentgear:organic',level:2}]}}, () => {
    const organicFirst=build('sword','test_organic'); organicFirst.parts.rod.material='netherrack';
    const erodedFirst=build('sword','netherrack'); erodedFirst.parts.rod.material='test_organic';
    assert.equal(E.calculate(organicFirst).traits.some(t=>t.id==='organic'||t.id==='eroded'),false);
    assert.ok(E.calculate(erodedFirst).traits.some(t=>t.id==='organic'));
    assert.ok(E.calculate(erodedFirst).traits.some(t=>t.id==='eroded'));
  });
});

test('pure-part synergy is calculated before global cancellation', () => {
  const b=build('sword','terracotta'); b.parts.rod.material='aluminum';
  const r=E.calculate(b);
  near(r.parts.find(p=>p.slot==='main').synergy,1.05);
  near(r.parts.find(p=>p.slot==='rod').synergy,1);
  assert.equal(r.traits.some(t=>t.id==='rustic'),false);
  assert.equal(r.traits.find(t=>t.id==='synergistic').level,1);
});

test('required compatibility rejects missing mains, invalid slots and invalid gear', () => {
  assert.equal(E.compatible('netherite','sword','main'), false);
  assert.equal(E.compatible('iron','helmet','rod'), false);
  assert.equal(E.compatible('iron','unknown','main'), false);
  assert.equal(E.compatible('diamond','ring','main'), false);
  assert.equal(E.compatible('iron','ring','main'), true);
  assert.equal(E.compatible('iron','elytra','main'), false);
  assert.equal(E.compatible('phantom_membrane','elytra','main'), true);
  const b=build(); b.parts.main.material=null;
  assert.throws(()=>E.validate(b),/材料不兼容|缺少有效材料/);
  assert.throws(()=>E.validate({version:1,gear:'unknown'}),/不.*支持/);
});

test('excluded stats and missing relevant defaults match the gear interfaces', () => {
  const sword=E.calculate(build());
  for(const stat of sword.excludedStats)assert.equal(sword.stats[stat],0);
  fixtureMaterial('test_empty', {stats:{main:{durability:10},fletching:{}}}, () => {
    const b=build('arrow','test_empty'); b.parts.fletching.material='test_empty';
    const r=E.calculate(b);
    assert.equal(r.stats.projectile_speed,1);
    assert.equal(r.stats.projectile_accuracy,1);
    assert.equal(r.stats.charging_value,0);
  });
});

test('all default gear combinations, grades and star levels produce finite results', () => {
  assert.ok(E.gears.length>=29);
  for(const gear of E.gears)for(const grade of ['NONE','MAX'])for(const star of [0,3]){
    const b=E.defaultBuild(gear.id);
    for(const p of Object.values(b.parts)){p.grade=grade;p.star=star;}
    const r=E.calculate(b);
    for(const [stat,value] of Object.entries(r.stats))assert.ok(Number.isFinite(value),`${gear.id}/${grade}/${star}: ${stat}=${value}`);
    for(const slot of E.slots(gear.id))if(E.required(gear.id,slot))assert.ok(E.compatible(r.build.parts[slot].material,gear.id,slot));
  }
});
