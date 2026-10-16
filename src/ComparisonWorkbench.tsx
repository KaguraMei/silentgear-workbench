import {useMemo, useRef, useState, type CSSProperties} from 'react';
import E, {type Build} from './engine.js';
import {data, format, roman} from './data-model';
import {applicableStats, blueprintCandidate, buildKey, materialCandidate, mergeSnapshots, MAX_SNAPSHOTS, restoreSnapshots, statDelta, STORAGE_KEY, type Snapshot} from './comparison.js';
import './comparison.css';

const statLabels: Record<string, [string, string, string]> = {
  final_durability: ['最大耐久', '点', '按当前装备类型换算的成品最大耐久；箭为固定弹药容量。'],
  attack_damage: ['攻击伤害', '点', '含角色基础 1 点，不含附魔、暴击、药水与目标减伤。'],
  attacks_per_second: ['攻击速度', '次/秒', '角色基础速度 4 加装备攻击速度修正。'],
  final_armor: ['护甲值', '点', '此单件装备提供的护甲，含常驻词条修正。'],
  knockback_percent: ['击退抗性', '%', '按角色属性换算成百分比的击退抗性。'],
  repair_efficiency: ['修复效率', '倍率', '材料与词条汇总后的修复效率倍率。'],
  enchantment_value: ['附魔能力', '点', '影响附魔台附魔品质的数值。'],
  harvest_speed: ['采掘速度', '系数', '材料与词条汇总的采掘速度系数，并非每秒挖掘方块数量。'],
  ranged_damage: ['远程伤害', '系数', '远程伤害属性；实际伤害还取决于弹药、蓄力与附魔。'],
  ranged_speed: ['远程速度', '修正值', '远程速度修正属性；不同武器的使用机制不同。'],
  projectile_speed: ['弹射物速度', '倍率', '弹射物初速度倍率。'],
  projectile_accuracy: ['弹射物精度', '系数', '弹射物精度属性；实际效果取决于装备机制。'],
  armor_toughness: ['护甲韧性', '点', '参与伤害减免计算的护甲韧性。'],
  magic_armor: ['魔法护甲', '点', '材料与词条汇总后的魔法护甲属性。'],
};
const statInfo = (key: string): [string, string, string] => {
  const info = statLabels[key];
  return info ? [data.stats[key]?.[0] || info[0], info[1], data.stats[key]?.[1] || info[2]] : [data.stats[key]?.[0] || key, '数值', data.stats[key]?.[1] || '当前装备的最终汇总属性。'];
};
const gearName = (build: Build) => E.names[build.gear] || build.gear;
const buildTitle = (build: Build) => `${data.materials[build.parts.main?.material || '']?.name || ''}${gearName(build)}`;
const partText = (build: Build, slot: string) => {
  const part = build.parts[slot];
  if (!part) return '—';
  if (!part.material) return '未装配';
  return `${data.materials[part.material]?.name || part.material} · ${part.grade === 'NONE' ? '未评级' : part.grade} · ${part.star ? `星光 ${roman(part.star)}` : '未充能'}`;
};
const differs = (values: unknown[]) => new Set(values.map(value => JSON.stringify(value))).size > 1;
function TraitDescription({id}: {id: string}) {
  const definition = data.traits[id] as (typeof data.traits[string] & {localizedDescription?: string; localizedDescriptionLong?: string}) | undefined;
  const localized = definition?.localizedDescriptionLong || definition?.localizedDescription;
  return <>{localized && <p><b>游戏汉化：</b>{localized}</p>}<p><b>{localized ? '计算说明：' : ''}</b>{definition?.description || '暂无词条说明。'}</p></>;
}

export default function ComparisonWorkbench({build, slot, onApply}: {build: Build; slot: string; onApply: (build: Build) => void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const importInput = useRef<HTMLInputElement>(null);
  const [initial] = useState(() => {
    try { return restoreSnapshots(localStorage.getItem(STORAGE_KEY)); }
    catch { return {snapshots: [] as Snapshot[], discarded: 0}; }
  });
  const [snapshots, setSnapshots] = useState(initial.snapshots);
  const snapshotsRef=useRef(snapshots);snapshotsRef.current=snapshots;
  const [baseline, setBaseline] = useState('live');
  const [isOpen,setIsOpen]=useState(false);
  const [view, setView] = useState<'builds' | 'materials'>('builds');
  const [query, setQuery] = useState('');
  const [candidateSlot, setCandidateSlot] = useState(slot);
  const [candidateStat, setCandidateStat] = useState('');
  const [candidateSort, setCandidateSort] = useState('name');
  const [blueprint, setBlueprint] = useState(build.gear);
  const [carryMaterials, setCarryMaterials] = useState(true);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');
  const [title, setTitle] = useState('');
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const [message, setMessage] = useState(initial.discarded ? `已跳过 ${initial.discarded} 条无效、重复或超出数量限制的历史记录。` : '');
  const currentSlot = E.slots(build.gear).includes(candidateSlot) ? candidateSlot : 'main';
  const columns = useMemo(() => [{id: 'live', title: '当前配装 · 实时', build}, ...snapshots].map(item => ({...item, result: E.calculate(item.build), applicable: applicableStats(item.build)})), [build, snapshots]);
  const base = columns.find(column => column.id === baseline) || columns[0];
  const statKeys = [...new Set(columns.flatMap(column => column.applicable))];
  const allSlots = [...new Set(columns.flatMap(column => E.slots(column.build.gear)))];
  const traitIds = [...new Set(columns.flatMap(column => [...column.result.traits, ...column.result.inactive].map(trait => trait.id)))];
  const metrics = columns[0].applicable;
  const metric = metrics.includes(candidateStat) ? candidateStat : ['attack_damage','final_armor','ranged_damage','final_durability'].find(key => metrics.includes(key)) || metrics[0];
  const candidates = useMemo(() => !isOpen || view!=='materials' ? [] : E.materials(build.gear, currentSlot)
    .filter(material => `${material.name} ${material.english} ${material.id}`.toLowerCase().includes(query.trim().toLowerCase()))
    .map(material => {const candidate = materialCandidate(build, currentSlot, material.id); return {material, build: candidate, result: E.calculate(candidate)};})
    .sort((a,b) => candidateSort === 'name' ? a.material.name.localeCompare(b.material.name,'zh-CN') : (candidateSort === 'descending' ? -1 : 1) * (a.result.stats[metric] - b.result.stats[metric]) || a.material.name.localeCompare(b.material.name,'zh-CN')),
    [build, currentSlot, query, metric, candidateSort, isOpen, view]);
  const nextBlueprint = useMemo(() => carryMaterials ? blueprintCandidate(build, blueprint) : {build: E.defaultBuild(blueprint), replacedSlots: []}, [build, blueprint, carryMaterials]);
  const snapshotKeys = new Set(snapshots.map(item => buildKey(item.build)));

  function commit(next: Snapshot[], notice: string) {
    snapshotsRef.current=next;setSnapshots(next);
    setBaseline(previous=>next.some(item=>item.id===previous)?previous:'live');
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({version: 1, snapshots: next}));
      setMessage(notice);
    } catch { setMessage(`${notice} 浏览器存储不可用，本次仅在页面内保留。`); }
  }
  function add(candidate: Build, name: string, material = false) {
    if (material && buildKey(candidate) === buildKey(build)) { setMessage('这个材料已经装配在当前部件上，请选择另一种材料。'); return; }
    if (snapshots.some(item => buildKey(item.build) === buildKey(candidate))) { setMessage('相同的配装已经在对比表中，无需重复加入。'); return; }
    if (snapshots.length >= MAX_SNAPSHOTS) { setMessage('已达到 4 列上限（当前配装 + 3 个快照），请先移除一列。'); return; }
    commit([...snapshots, {id: crypto.randomUUID(), title: name, build: E.validate(candidate)}], `已加入「${name}」。`);
    setTitle('');
  }
  function exportSnapshots() {
    const url = URL.createObjectURL(new Blob([JSON.stringify({version:1,snapshots},null,2)],{type:'application/json'}));
    const link = document.createElement('a');link.href=url;link.download='silentgear-comparisons.json';link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    setMessage(`已导出 ${snapshots.length} 个快照；当前实时列请先保存为快照再导出。`);
  }
  async function importSnapshots(file: File) {
    try {
      if(file.size>200000) throw new Error('文件不能超过 200 KB');
      const restored=restoreSnapshots(await file.text());
      if(!restored.snapshots.length) throw new Error('文件中没有有效快照，请选择本工作台导出的 JSON');
      // Merge with the latest state: a file read must never resurrect removed snapshots.
      const merged=mergeSnapshots(snapshotsRef.current,restored.snapshots);
      commit(merged.snapshots,`导入 ${merged.added} 个快照；跳过 ${merged.duplicates} 个重复、${restored.discarded} 个无效记录、${merged.overflow} 个超出容量的记录。`);
    } catch(error) {setMessage(`导入失败：${error instanceof Error ? error.message : '无法读取文件'}。已有快照保留。`);}
  }
  function renameSnapshot(id: string) {
    const name=renameTitle.trim();if(!name){setMessage('快照名称不能为空。');return;}
    commit(snapshots.map(item=>item.id===id?{...item,title:name}:item),`已重命名为「${name}」。`);setRenameId(null);
  }
  const visibleStats = statKeys.filter(key => !differencesOnly || differs(columns.map(column => column.applicable.includes(key) && Number.isFinite(column.result.stats[key]) ? Number(column.result.stats[key].toFixed(2)) : null)));
  const visibleSlots = allSlots.filter(part => !differencesOnly || differs(columns.map(column => partText(column.build, part))));
  const traitState = (column: typeof columns[number], id: string) => {
    const active = column.result.traits.find(trait => trait.id === id);
    const inactive = column.result.inactive.filter(trait => trait.id === id);
    return {active, inactive};
  };
  const visibleTraits = traitIds.filter(id => !differencesOnly || differs(columns.map(column => {
    const state = traitState(column, id);
    return [state.active?.level, state.active?.sources, state.inactive.map(trait => [trait.originalLevel, trait.reason, trait.sources])];
  })));

  return <>
    <button className="chip-button" onClick={() => {setCandidateSlot(slot);setBlueprint(build.gear);setIsOpen(true);dialog.current?.showModal();}}>对比工作台{snapshots.length>0&&<span className="comparison-badge">{snapshots.length}</span>}</button>
    <dialog className="comparison-dialog" onClose={()=>setIsOpen(false)} ref={dialog} aria-labelledby="comparison-title">
      <header className="comparison-heading"><div><span className="eyebrow">COMPARISON / {columns.length} OF 4</span><h2 id="comparison-title">配装对比工作台</h2></div><button className="comparison-close" onClick={() => dialog.current?.close()} aria-label="关闭对比工作台">×</button></header>
      <div className="comparison-body">
        <p className="comparison-intro">保留多个蓝图，或只替换一个部件来检验材料选择。当前列随主界面实时更新，快照保持保存时的状态。</p>
        <div className="comparison-tabs" role="group" aria-label="添加对比方式"><button aria-pressed={view === 'builds'} onClick={() => setView('builds')}>蓝图快照</button><button aria-pressed={view === 'materials'} onClick={() => setView('materials')}>材料候选</button></div>
        {view === 'builds' ? <section className="comparison-builds" aria-label="添加蓝图快照">
          <div className="comparison-add"><label htmlFor="comparison-name">当前配装名称<input id="comparison-name" value={title} maxLength={40} placeholder={buildTitle(build)} onChange={event => setTitle(event.target.value)}/></label><button className="comparison-primary" disabled={snapshots.length>=MAX_SNAPSHOTS} onClick={() => add(build, title.trim() || buildTitle(build))}>保存当前配装</button></div>
          <div className="comparison-blueprint"><label htmlFor="comparison-blueprint">其他装备蓝图<select id="comparison-blueprint" value={blueprint} onChange={event=>setBlueprint(event.target.value)}>{[['weapon','武器'],['tool','工具'],['armor','防具'],['other','其他']].map(([id,name])=><optgroup key={id} label={name}>{E.gears.filter(gear=>gear.category===id).map(gear=><option key={gear.id} value={gear.id}>{gear.name}</option>)}</optgroup>)}</select></label><label className="comparison-check"><input type="checkbox" checked={carryMaterials} onChange={event=>setCarryMaterials(event.target.checked)}/>沿用兼容材料与品级</label><button className="comparison-primary" disabled={snapshots.length>=MAX_SNAPSHOTS} onClick={()=>add(nextBlueprint.build,buildTitle(nextBlueprint.build))}>加入蓝图对比</button></div>
          <p className="comparison-transfer-note">{carryMaterials ? `保留兼容部件、品级、星光与 ${format(build.wear)}% 磨损。` : '使用此蓝图的默认材料、未评级、未充能和 0% 磨损。'}{nextBlueprint.replacedSlots.length>0&&`「${nextBlueprint.replacedSlots.map(part=>E.slotNames[part]).join('、')}」缺少兼容部件，将使用蓝图默认配置。`}加入对比不会改变当前配装。</p>
          <details className="comparison-blueprint-parts"><summary>查看待加入的部件配置</summary><ul>{E.slots(nextBlueprint.build.gear).map(part=><li key={part}><b>{E.slotNames[part]}</b><span>{partText(nextBlueprint.build,part)}</span></li>)}</ul></details>
        </section> : <section className="comparison-materials" aria-label="选择材料候选">
          <div className="comparison-material-heading"><div><h3>{gearName(build)} / {E.slotNames[currentSlot]}材料候选</h3><p>仅替换「{E.slotNames[currentSlot]}」材料，保留其余部件、品级、星光充能和 {format(build.wear)}% 磨损。数值为换材后的成品属性，差值相对当前配装。</p></div><label htmlFor="comparison-search">搜索候选材料<input type="search" id="comparison-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="名称、英文或 ID"/></label></div>
          <div className="comparison-candidate-options"><label>比较部件<select aria-label="比较部件" value={currentSlot} onChange={event=>{setCandidateSlot(event.target.value);setQuery('');}}>{E.slots(build.gear).map(part=><option key={part} value={part}>{E.slotNames[part]}</option>)}</select></label><label>预览属性<select aria-label="预览属性" value={metric} onChange={event=>setCandidateStat(event.target.value)}>{metrics.map(key=><option key={key} value={key}>{statInfo(key)[0]}</option>)}</select></label><label>候选排序<select aria-label="候选排序" value={candidateSort} onChange={event=>setCandidateSort(event.target.value)}><option value="name">名称</option><option value="descending">数值从高到低</option><option value="ascending">数值从低到高</option></select></label><span>{candidates.length} 种兼容材料</span></div>
          <div className="comparison-candidates">{candidates.map(candidate=>{const material=candidate.material;const current=build.parts[currentSlot]?.material===material.id,added=snapshotKeys.has(buildKey(candidate.build));const value=candidate.result.stats[metric],delta=value-columns[0].result.stats[metric];return <button key={material.id} aria-label={'加入材料候选'+material.name} disabled={current||added||snapshots.length>=MAX_SNAPSHOTS} onClick={()=>add(candidate.build,`${E.slotNames[currentSlot]}候选 · ${material.name} · ${gearName(build)}`,true)}><span className="comparison-color" style={{backgroundColor:material.color}}/><span>{material.name}<small>{material.id}</small><span className="candidate-value">{format(value)} <small>{statInfo(metric)[1]} · {delta>0?'+':''}{format(delta)}</small></span></span><b>{current?'当前':added?'已加入':'+ 加入'}</b></button>;})}{!candidates.length&&<p>没有匹配的兼容材料。</p>}</div>
        </section>}
        <div className="comparison-file-actions"><span>已保存 {snapshots.length} / {MAX_SNAPSHOTS} 个快照{snapshots.length===MAX_SNAPSHOTS?' · 已满，请移除一列后再添加':''}</span><button disabled={!snapshots.length} onClick={exportSnapshots}>导出快照</button><button onClick={()=>importInput.current?.click()}>导入快照</button><input hidden ref={importInput} type="file" accept=".json,application/json" aria-label="导入对比快照文件" onChange={event=>{const file=event.target.files?.[0];event.target.value='';if(file)void importSnapshots(file);}}/></div>
        <div className="comparison-toolbar"><label><input type="checkbox" checked={differencesOnly} onChange={event => setDifferencesOnly(event.target.checked)}/>只看差异</label><label htmlFor="comparison-baseline">基准<select id="comparison-baseline" aria-label="基准" value={base.id} onChange={event => setBaseline(event.target.value)}>{columns.map(column => <option value={column.id} key={column.id}>{column.title}</option>)}</select></label><button disabled={!snapshots.length} onClick={() => commit([], '已清空保存的对比快照。')}>清空快照</button></div>
        <p className="comparison-message" role="status" aria-live="polite">{message || '数值差值仅在同一种装备之间显示；跨装备保留原值，不作统一排名或属性加总。'}</p>
        <div className="comparison-scroll" tabIndex={0} role="region" aria-label="装备横向对比表，可左右滚动">
          <table className="comparison-table" style={{minWidth:170+columns.length*225,'--comparison-columns':columns.length} as CSSProperties}><caption>最终属性、完整部件配置与词条对照。— 表示不适用或没有此词条；差值为相对所选基准的数值变化。</caption><thead><tr><th scope="col">检验项目</th>{columns.map(column => <th scope="col" key={column.id} className={column.id === base.id ? 'is-baseline' : ''}><span className="comparison-column-type">{column.id === 'live' ? 'LIVE / 实时' : 'SAVED / 快照'}{column.id === base.id ? ' · 基准' : ''}</span>{renameId===column.id?<form className="comparison-rename" onSubmit={event=>{event.preventDefault();renameSnapshot(column.id);}}><input aria-label="编辑快照名称" autoFocus maxLength={40} value={renameTitle} onChange={event=>setRenameTitle(event.target.value)}/><button type="submit">保存名称</button><button type="button" onClick={()=>setRenameId(null)}>取消</button></form>:<strong>{column.title}</strong>}<span className="comparison-gear">{gearName(column.build)} · {column.build.gear}</span>{column.id !== 'live' && <div className="comparison-column-actions"><button onClick={() => {onApply(E.validate(column.build)); dialog.current?.close();}}>应用此配装</button><button aria-label={`重命名${column.title}`} onClick={()=>{setRenameId(column.id);setRenameTitle(column.title);}}>改名</button><button aria-label={`删除${column.title}`} onClick={() => commit(snapshots.filter(item => item.id !== column.id), `已删除「${column.title}」。`)}>移除</button></div>}</th>)}</tr></thead>
          <tbody><tr className="comparison-section"><th colSpan={columns.length + 1}>01 / 最终属性</th></tr>{visibleStats.map(key => {const [name, unit, description] = statInfo(key); return <tr key={key} data-compare-stat={key}><th scope="row"><details><summary>{name}<small>{unit}</small></summary><p>{description}</p></details></th>{columns.map(column => {const value = column.result.stats[key]; const applicable = column.applicable.includes(key) && Number.isFinite(value); const delta = statDelta(column.build, column.result, base.build, base.result, key); return <td key={column.id} data-compare-id={column.id} className={column.id === base.id ? 'is-baseline' : ''}>{applicable ? <><span className="comparison-number">{format(value)}</span>{column.id!==base.id && column.build.gear!==base.build.gear && <small>不同蓝图 · 仅展示原值</small>}{column.id !== base.id && delta !== null && <small className="comparison-delta">较基准 {delta > 0 ? '+' : ''}{format(delta)} {unit}</small>}</> : <span aria-label="不适用">—</span>}</td>;})}</tr>;})}
          <tr className="comparison-section"><th colSpan={columns.length + 1}>02 / 装配条件</th></tr>{(!differencesOnly || differs(columns.map(column => column.build.wear))) && <tr><th scope="row">耐久损耗<small>%</small></th>{columns.map(column => <td key={column.id}>{format(column.build.wear)}%</td>)}</tr>}{visibleSlots.map(part => <tr key={part}><th scope="row">{E.slotNames[part]}<small>材料 / 品级 / 星光</small></th>{columns.map(column => <td key={column.id} className="comparison-part">{partText(column.build, part)}</td>)}</tr>)}
          <tr className="comparison-section"><th colSpan={columns.length + 1}>03 / 词条与生效条件 <small>点击词条状态展开说明</small></th></tr>{visibleTraits.map(id => {const definition = data.traits[id]; return <tr key={id}><th scope="row">{definition?.name || id}<small>{definition?.english || id}</small></th>{columns.map(column => {const {active, inactive} = traitState(column, id); return <td key={column.id}>{active || inactive.length ? <details className="comparison-trait"><summary>{active && <span className="comparison-active">生效 {roman(active.level)}</span>}{inactive.length > 0 && <span className="comparison-inactive">未生效{inactive.length > 1 ? ` ×${inactive.length}` : ''}</span>}</summary><TraitDescription id={id}/>{active && <p>生效来源：{active.sources.join('；')}</p>}{inactive.map((trait, index) => <p key={index}>未生效 {roman(trait.originalLevel || 1)}：{trait.reason || '未满足生效条件'}<br/>来源：{trait.sources.join('；')}</p>)}</details> : '—'}</td>;})}</tr>;})}</tbody>
          </table>
          {differencesOnly && !visibleStats.length && !visibleSlots.length && !visibleTraits.length && !differs(columns.map(column => column.build.wear)) && <p className="comparison-empty">当前没有可显示的差异。加入另一种材料或配装后再比较。</p>}
        </div>
        <footer className="comparison-footer">同一计算引擎 · 单件装备基础值 · 未计附魔与实战减伤<span>手机可左右滑动查看各列</span></footer>
      </div>
    </dialog>
  </>;
}
