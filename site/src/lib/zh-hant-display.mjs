// Public display only: do not mutate source Markdown, file IDs, review evidence or SHA.
// Dictionaries: OpenCC, Apache-2.0, pinned in site/vendor/opencc/README.md.
// This is a deliberately small, deterministic build-time subset of s2tw:
// longest-phrase match, then character fallback, then Taiwanese glyph variants.
// It does not claim the exact mmseg behavior of OpenCC's native engine.
import {readFileSync} from 'node:fs';

const dir=new URL('../../vendor/opencc/',import.meta.url);
const load=name=>{
  const rows=new Map();
  for(const line of readFileSync(new URL(name,dir),'utf8').split(/\r?\n/)){
    if(!line||line.startsWith('#'))continue;
    const tab=line.indexOf('\t');
    if(tab<=0)continue;
    const from=line.slice(0,tab),to=line.slice(tab+1).trim().split(/\s+/)[0];
    if(from&&to)rows.set(from,to);
  }
  return rows;
};
const trieOf=dict=>{
  const root=new Map();
  for(const [from,to] of dict){
    let node=root;
    for(const c of from){
      if(!node.has(c))node.set(c,new Map());
      node=node.get(c);
    }
    node.set(null,to);
  }
  return root;
};
const phrase=load('STPhrases.txt'),characters=load('STCharacters.txt');
const variants=load('TWVariants.txt'),variantPhrases=load('TWVariantsPhrases.txt');
const stage1=trieOf(new Map([...characters,...phrase]));
const stage2=trieOf(new Map([...variants,...variantPhrases]));
function applyTrie(text,trie){
  const units=Array.from(text);
  const out=[];
  for(let i=0;i<units.length;){
    let cursor=trie,last=-1,replacement;
    for(let j=i;j<units.length;j++){
      cursor=cursor.get(units[j]);
      if(!cursor)break;
      if(cursor.has(null)){last=j+1;replacement=cursor.get(null);}
    }
    if(last>=0){out.push(replacement);i=last;}
    else out.push(units[i++]);
  }
  return out.join('');
}
// English, digits and punctuation are never dictionary keys.
export const toTaiwanHant=value=>{
  if(typeof value!=='string'||!value)return value;
  return applyTrie(applyTrie(value,stage1),stage2);
};

// Never convert program syntax, raw source blocks or URL/ID attributes.
// Readable visible text and alt/aria/title/placeholder/meta descriptions are
// localized before Pagefind creates its public search index.
const RAW=new Set(['script','style','code','pre','kbd','samp','textarea','template','svg','math','iframe','noscript']);
const HUMAN_ATTR=/\b(aria-label|aria-description|alt|placeholder|title)\s*=\s*(["'])([\s\S]*?)\2/gi;
const CONTENT_ATTR=/\b(content)\s*=\s*(["'])([\s\S]*?)\2/i;
const attrConvert=tag=>{
  let out=tag.replace(HUMAN_ATTR,(_all,key,quote,value)=>key+'='+quote+toTaiwanHant(value)+quote);
  if(/^<meta\b/i.test(out)&&/(?:name|property)\s*=\s*["'](?:description|og:title|og:description|twitter:title|twitter:description)["']/i.test(out))
    out=out.replace(CONTENT_ATTR,(_all,key,quote,value)=>key+'='+quote+toTaiwanHant(value)+quote);
  return out;
};
export function localizeHtml(html){
  if(typeof html!=='string')throw new TypeError('Expected HTML string');
  const out=[];
  const stack=[];
  let i=0;
  while(i<html.length){
    if(stack.length&&['script','style','textarea'].includes(stack.at(-1))){
      const tag=stack.at(-1);
      const re=new RegExp('</'+tag+'\\s*>','ig');re.lastIndex=i;
      const hit=re.exec(html);
      if(!hit){out.push(html.slice(i));break;}
      out.push(html.slice(i,hit.index));
      i=hit.index;
    }
    if(html.startsWith('<!--',i)){
      const end=html.indexOf('-->',i+4);const next=end<0?html.length:end+3;
      out.push(html.slice(i,next));i=next;continue;
    }
    if(html[i]==='<'){
      let j=i+1,quote=null;
      while(j<html.length){
        const c=html[j];
        if(quote){if(c===quote)quote=null;}
        else if(c==='"'||c==="'")quote=c;
        else if(c==='>'){j++;break;}
        j++;
      }
      const raw=html.slice(i,j),match=/^<\s*(\/?)\s*([a-z][\w:-]*)\b/i.exec(raw);
      const name=match?.[2]?.toLowerCase(),closing=match?.[1]==='/';
      const withinRaw=stack.length>0;
      out.push(withinRaw||closing||!name?raw:attrConvert(raw));
      if(name&&RAW.has(name)){
        if(closing){const k=stack.lastIndexOf(name);if(k>=0)stack.splice(k,1);}
        else if(!/\/\s*>$/.test(raw))stack.push(name);
      }
      i=j;continue;
    }
    const next=html.indexOf('<',i),end=next<0?html.length:next;
    out.push(stack.length?html.slice(i,end):toTaiwanHant(html.slice(i,end)));
    i=end;
  }
  return out.join('');
}
