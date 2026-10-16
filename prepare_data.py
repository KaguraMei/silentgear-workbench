from pathlib import Path
import json,ast,zipfile,re,copy,runpy

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
data=json.loads((ROOT/'docs/atm9-equipment-data/silentgear-extracted.json').read_text(encoding='utf-8'))
tree=ast.parse((ROOT/'docs/atm9-equipment-data/build_materials.py').read_text(encoding='utf-8'))
maps={}
for node in tree.body:
    if isinstance(node,ast.Assign) and isinstance(node.targets[0],ast.Name) and node.targets[0].id in ['desc','statinfo']:
        maps[node.targets[0].id]=ast.literal_eval(node.value)
def resolve(key):
    m=copy.deepcopy(data['materials'][key])
    for stats in m.get('stats',{}).values():
        if 'armor' in stats:
            for gear,weight in [('helmet',3),('chestplate',8),('leggings',6),('boots',3)]:
                value=stats['armor']
                def split(v):
                    if isinstance(v,(int,float)):return v*weight/20
                    if isinstance(v,list):return [split(x) for x in v]
                    return {op:(n*weight/20 if op=='avg' else n) for op,n in v.items()}
                value=split(value)
                stats.setdefault('armor/'+gear,value)
    if not m.get('parent'):return copy.deepcopy(m)
    base=resolve(m['parent'].split(':')[1])
    for k,v in m.items():
        if k in ['stats','traits','model']:
            for a,b in v.items():
                if b:
                    if k=='stats':base.setdefault(k,{}).setdefault(a,{}).update(copy.deepcopy(b))
                    else:base.setdefault(k,{})[a]=copy.deepcopy(b)
        else:base[k]=v
    return base
out={'version':'3.6.7','minecraft':'1.20.1','date':'2026-10-14','materials':{},'traits':{},'parts':data['parts'],'stats':maps['statinfo']}
for k in data['materials']:
    m=resolve(k)
    m.pop('name_prefix',None)
    m['id']=k
    m['name']=data['zh_cn'].get('material.silentgear.'+k.replace('/','.'),k)
    m['english']=data['en_us'].get('material.silentgear.'+k.replace('/','.'),k)
    m['color']=next((v.get('color','#c4d1d6') for layers in m.get('model',{}).values() for v in layers if v.get('color')),'#c4d1d6')
    out['materials'][k]=m
for k,t in data['traits'].items():
    t=copy.deepcopy(t);t['name']=data['zh_cn'].get('trait.silentgear.'+k,k);t['english']=data['en_us'].get('trait.silentgear.'+k,k);t['description']=maps['desc'][k]
    out['traits'][k]=t
with zipfile.ZipFile(ROOT/'mods/silent-gear-1.20.1-3.6.7.jar') as z:
    out['partMaterialCounts']={}
    out['partCategories']={}
    for n in z.namelist():
        if not n.startswith('data/silentgear/recipes/') or not n.endswith('.json'):continue
        recipe=json.loads(z.read(n))
        if recipe.get('type')!='silentgear:compound_part':continue
        inputs=[i for i in recipe.get('ingredients',[]) if isinstance(i,dict) and i.get('type')=='silentgear:material']
        result=recipe.get('result',{}).get('item')
        for part,p in out['parts'].items():
            if p.get('crafting_item',{}).get('item')==result and inputs:
                out['partMaterialCounts'][part]=len(inputs)
                if inputs[0].get('categories'):out['partCategories'][part]=inputs[0]['categories']
    for n in z.namelist():
        if n.startswith('assets/silentgear/textures/item/') and n.endswith('.png') and '/broken/' not in n:
            target=HERE/'public/textures'/n.split('/textures/item/')[1]
            target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(z.read(n))
out['textures']=[p.relative_to(HERE/'public').as_posix() for p in (HERE/'public/textures').rglob('*.png')]
translation_snapshot=HERE/'translations/silentgear.zh_cn.json'
if translation_snapshot.exists():
    apply=runpy.run_path(str(HERE/'scripts/extract-translations.py'))['apply_translations']
    apply(out,json.loads(translation_snapshot.read_text(encoding='utf-8')))
(HERE/'src/data.js').write_text('export default '+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print('Prepared',len(out['materials']),'materials;',len(out['traits']),'traits;',len(out['textures']),'textures')
