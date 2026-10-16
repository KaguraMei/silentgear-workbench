import {test} from 'node:test';
import assert from 'node:assert/strict';
import E from '../src/engine.js';
import {materialCandidate,blueprintCandidate,buildKey,restoreSnapshots,mergeSnapshots,applicableStats,statDelta} from '../src/comparison.js';

test('material candidates preserve conditions and do not mutate the live build',()=>{
 const source=E.defaultBuild('sword');source.parts.main.grade='MAX';source.parts.main.star=3;source.wear=50;
 const original=structuredClone(source);const candidate=materialCandidate(source,'main','iron');
 assert.deepEqual(source,original);assert.equal(candidate.parts.main.material,'iron');
 assert.equal(candidate.parts.main.grade,'MAX');assert.equal(candidate.parts.main.star,3);assert.equal(candidate.wear,50);
 assert.deepEqual(candidate.parts.rod,source.parts.rod);
 assert.throws(()=>materialCandidate(source,'cord','string'));
 assert.throws(()=>materialCandidate(source,'main','no-such-material'));
});
test('blueprints preserve compatible selections and explicitly identify defaults',()=>{
 const source=E.defaultBuild('sword');source.parts.main.grade='MAX';source.parts.main.star=2;source.wear=40;
 for(const gear of E.gears){const result=blueprintCandidate(source,gear.id);assert.equal(result.build.gear,gear.id);assert.equal(result.build.wear,40);E.calculate(result.build);
  for(const slot of E.slots(gear.id)){const part=source.parts[slot];if(part&&(E.compatible(part.material,gear.id,slot)||(part.material===null&&!E.required(gear.id,slot)))){assert.deepEqual(result.build.parts[slot],part);assert.ok(!result.replacedSlots.includes(slot));}else{assert.deepEqual(result.build.parts[slot],E.defaultBuild(gear.id).parts[slot]);assert.ok(result.replacedSlots.includes(slot));}}
 }
 const bow=blueprintCandidate(source,'bow');assert.ok(bow.replacedSlots.includes('cord'));assert.equal(bow.build.parts.cord.material,'string');
 assert.throws(()=>blueprintCandidate(source,'not-a-blueprint'));
});
test('snapshots validate, deduplicate and round trip without sharing live objects',()=>{
 const source=E.defaultBuild(),iron=materialCandidate(source,'main','iron');
 const raw=JSON.stringify({version:1,snapshots:[{id:'a',title:'原配装',build:source},{id:'b',title:'铁剑',build:iron},{id:'c',title:'重复',build:iron},{id:'live',title:'非法 ID',build:source},{id:'d',title:'非法品级',build:{...source,parts:{...source.parts,main:{...source.parts.main,grade:'BAD'}}}}]});
 const result=restoreSnapshots(raw);assert.equal(result.snapshots.length,2);assert.equal(result.discarded,3);
 assert.deepEqual(restoreSnapshots(JSON.stringify({version:1,snapshots:result.snapshots})),{snapshots:result.snapshots,discarded:0});
 assert.equal(restoreSnapshots('null').discarded,1);assert.equal(restoreSnapshots('{bad').discarded,1);
 source.parts.main.material='diamond';assert.notEqual(result.snapshots[0].build.parts.main.material,source.parts.main.material);
});
test('merge keeps existing records, resolves ID collisions, and reports overflow',()=>{
 const source=E.defaultBuild();const a={id:'x'.repeat(100),title:'原配装',build:source};
 const candidates=['iron','diamond','gold'].map(id=>({id:a.id,title:id,build:materialCandidate(source,'main',id)}));
 const merged=mergeSnapshots([a],[a,...candidates]);assert.equal(merged.added,2);assert.equal(merged.duplicates,1);assert.equal(merged.overflow,1);assert.equal(merged.snapshots[0],a);
 assert.equal(new Set(merged.snapshots.map(item=>item.id)).size,3);
 assert.equal(restoreSnapshots(JSON.stringify({version:1,snapshots:merged.snapshots})).discarded,0);
 assert.equal(buildKey(source),buildKey(E.validate(source)));
});
test('deltas use final gear values and never compare different equipment mechanics',()=>{
 const iron=materialCandidate(E.defaultBuild(),'main','iron'),diamond=materialCandidate(iron,'main','diamond'),helmet=E.defaultBuild('helmet');
 assert.equal(statDelta(diamond,E.calculate(diamond),iron,E.calculate(iron),'attack_damage'),1);
 assert.equal(statDelta(helmet,E.calculate(helmet),iron,E.calculate(iron),'attack_damage'),null);
 assert.equal(statDelta(iron,E.calculate(iron),iron,E.calculate(iron),'final_armor'),null);
 assert.ok(applicableStats(helmet).includes('final_durability'));assert.ok(!applicableStats(helmet).includes('attack_damage'));
});
