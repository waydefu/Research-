// Localize generated public display, not source research or searchable provenance.
// Build order: Astro -> native HALOFLUX bridge -> Traditional output -> Pagefind.
// The OpenCC data is local, Apache-2.0, and never requested by the browser.
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {join,relative,resolve,sep} from 'node:path';
import {toTaiwanHant,localizeHtml} from '../src/lib/zh-hant-display.mjs';

const root=resolve('dist'),archive=join(root,'original-search-index.json');
let processed=0,changed=0;
async function visit(dir){
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const p=join(dir,entry.name),rel=relative(root,p).split(sep).join('/');
    // Faithful upstream references MUST remain byte-identical.
    if(rel==='haloflux'||rel.startsWith('haloflux/'))continue;
    if(entry.isDirectory())await visit(p);
    else if(entry.isFile()&&rel.endsWith('.html')){
      const original=await readFile(p,'utf8');
      const converted=localizeHtml(original);
      processed++;
      if(converted!==original){await writeFile(p,converted);changed++;}
    }
  }
}
await visit(root);

// Archive keeps original text + commit metadata byte-for-byte intact; only
// additional optional display fields are localized. Search still considers
// the original string for native Simplified-Chinese input and technical tokens.
// Search display stays Traditional, but quoted source code, inline code and
// literal URLs inside Markdown must not be transliterated as ordinary prose.
const displayMarkdown=text=>text.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`|https?:\/\/[^\s)>"']+)/g)
  .map((segment,i)=>i%2?segment:toTaiwanHant(segment)).join('');
const archived=JSON.parse(await readFile(archive,'utf8'));
if(archived.scope!=='archived-original-markdown'||!Array.isArray(archived.documents))
  throw Error('Refuse to localize invalid archival search index');
let archiveLocalized=0;
for(const d of archived.documents){
  for(const [field,output] of [['title','displayTitle'],['publicTitle','displayPublicTitle'],['text','displayText']]){
    const source=d[field];
    if(typeof source!=='string')continue;
    const target=field==='text'?displayMarkdown(source):toTaiwanHant(source);
    if(target!==source){d[output]=target;if(field==='text')archiveLocalized++;}
  }
}
await writeFile(archive,JSON.stringify(archived)+'\n','utf8');

const bridge=join(root,'haloflux-research','research-data.json');
const view=JSON.parse(await readFile(bridge,'utf8'));
if(view.scope!=='public-research-catalog'||!Array.isArray(view.documents))
  throw Error('Refuse to modify invalid HALOFLUX data bridge');
const fields=['title','summary','domain','topic','kind'];
for(const list of [view.documents,view.recent,view.areas]){
  for(const entry of list){
    for(const field of fields)if(typeof entry[field]==='string')
      entry[field]=toTaiwanHant(entry[field]);
  }
}
await writeFile(bridge,JSON.stringify(view)+'\n','utf8');
console.log('Taiwan Hant display: '+processed+' HTML pages ('+changed+' localized), '+archiveLocalized+
  ' archived source texts carry a separate display string; originals and English preserved.');
