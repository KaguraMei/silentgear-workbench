import E from './engine.js';

export const STORAGE_KEY = 'silentgear.comparisons.v1';
export const MAX_SNAPSHOTS = 3;

export function buildKey(build) {
  const clean = E.validate(build);
  return JSON.stringify([clean.gear, clean.wear, E.slots(clean.gear).map(slot => [slot, clean.parts[slot].material, clean.parts[slot].grade, clean.parts[slot].star])]);
}

export function materialCandidate(build, slot, material) {
  if (!E.slots(build.gear).includes(slot) || !E.compatible(material, build.gear, slot)) throw new Error('该材料不适用于当前部件');
  return E.validate({...build, parts: {...build.parts, [slot]: {...build.parts[slot], material}}});
}

// Carry only compatible selections across blueprints; show every default replacement.
export function blueprintCandidate(source, gear) {
  if (!E.gears.some(item => item.id === gear)) throw new Error('未知蓝图');
  const current = E.validate(source), next = E.defaultBuild(gear), replacedSlots = [];
  next.wear = current.wear;
  for (const slot of E.slots(gear)) {
    const part = current.parts[slot];
    if (part && (E.compatible(part.material, gear, slot) || (part.material === null && !E.required(gear, slot)))) {
      next.parts[slot] = {...part};
    } else replacedSlots.push(slot);
  }
  return {build: E.validate(next), replacedSlots};
}

export function mergeSnapshots(existing, incoming) {
  const snapshots = [...existing], keys = new Set(existing.map(item => buildKey(item.build)));
  const ids = new Set(existing.map(item => item.id));
  let duplicates = 0, overflow = 0;
  for (const item of incoming) {
    const key = buildKey(item.build);
    if (keys.has(key)) { duplicates++; continue; }
    if (snapshots.length >= MAX_SNAPSHOTS) { overflow++; continue; }
    let id = item.id, serial = 0;
    while (ids.has(id) || id === 'live') id = item.id.slice(0,80) + '-import-' + (++serial);
    snapshots.push({...item, id, build: E.validate(item.build)});
    ids.add(id); keys.add(key);
  }
  return {snapshots, added: snapshots.length - existing.length, duplicates, overflow};
}

function strictBuild(value) {
  if (!value || value.version !== 1 || !E.gears.some(g => g.id === value.gear) || !Number.isFinite(value.wear) || value.wear < 0 || value.wear > 90) throw new Error('无效快照');
  for (const slot of E.slots(value.gear)) {
    const part = value.parts?.[slot];
    if (!part || !Object.hasOwn(E.grades, part.grade) || !Number.isInteger(part.star) || part.star < 0 || part.star > 3) throw new Error('无效部件');
  }
  return E.validate(value);
}

export function restoreSnapshots(raw) {
  if (!raw) return {snapshots: [], discarded: 0};
  try {
    const stored = JSON.parse(raw);
    if (stored.version !== 1 || !Array.isArray(stored.snapshots)) return {snapshots: [], discarded: 1};
    const snapshots = [], keys = new Set(), ids = new Set();
    let discarded = 0;
    for (const item of stored.snapshots) {
      try {
        if (!item || typeof item.id !== 'string' || !item.id || item.id === 'live' || item.id.length > 100 || typeof item.title !== 'string' || !item.title.trim() || snapshots.length >= MAX_SNAPSHOTS) throw new Error('无效记录');
        const build = strictBuild(item.build), key = buildKey(build);
        if (keys.has(key) || ids.has(item.id)) throw new Error('重复记录');
        snapshots.push({id: item.id, title: item.title.trim().slice(0, 64), build});
        keys.add(key); ids.add(item.id);
      } catch { discarded++; }
    }
    return {snapshots, discarded};
  } catch { return {snapshots: [], discarded: 1}; }
}

const finalKeys = {durability: 'final_durability', armor_durability: 'final_durability', melee_damage: 'attack_damage', attack_speed: 'attacks_per_second', armor: 'final_armor', knockback_resistance: 'knockback_percent'};
export function applicableStats(build) {
  return [...new Set(E.relevantStats(build.gear).filter(key => !E.excludedStats(build.gear).includes(key)).map(key => finalKeys[key] || key))];
}

export function statDelta(currentBuild, currentResult, baselineBuild, baselineResult, key) {
  if (currentBuild.gear !== baselineBuild.gear || !applicableStats(currentBuild).includes(key) || !applicableStats(baselineBuild).includes(key)) return null;
  const a = currentResult.stats[key], b = baselineResult.stats[key];
  return Number.isFinite(a) && Number.isFinite(b) ? a - b : null;
}
