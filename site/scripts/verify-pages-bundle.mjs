// Verify the single-page-host artifact; no copied legacy V2 application.
import {readdirSync,readFileSync,existsSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join,relative,resolve} from 'node:path';
import {allDocs,BASE} from '../src/lib/catalog.mjs';

const source=resolve(process.cwd(),'dist');
const publish=resolve(process.cwd(),'pages-dist');
const v3=join(publish,'v3');
const assert=(check,msg)=>{if(!check)throw Error('Single Pages artifact invalid: '+msg);};
const hash=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
const walk=(dir,root=dir)=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
  const full=join(dir,e.name);
  if(e.isDirectory())return walk(full,root);
  assert(e.isFile(),'Unexpected non-file asset '+full);
  return [relative(root,full)];
}).sort();

assert(existsSync(join(publish,'.nojekyll')),'nojekyll marker missing');
const home=readFileSync(join(publish,'index.html'),'utf8');
assert(home.includes('技術研究與實作知識庫'),'Canonical Sanctum missing');
assert(home.includes('class="world-backdrop"'),'Primary art scene missing');
assert(!home.includes('THE UNKNOWN,'),'Retired V2 incorrectly owns root');
assert(home.includes('href="https://waydefu.github.io/Research-/"'),'Canonical URL missing');
assert(!home.includes('content="noindex"'),'Production home blocked from indexing');
assert(home.includes('/Research-/v3/atlas/sanctum/assets/world-desktop.webp'),'Real local world image missing');
assert(home.includes('href="/Research-/v3/library/"'),'Research library route missing');
assert(!home.includes('href="/Research-/v2/"'),'Retired V2 linked from primary home');

const previous=walk(join(publish,'v2'));
assert(JSON.stringify(previous)===JSON.stringify(['index.html']),'Unexpected retired V2 application still published: '+previous);
const redirect=readFileSync(join(publish,'v2/index.html'),'utf8');
assert(redirect.includes('url=/Research-/v3/library/'),'Old V2 URL must lead to research');
assert(redirect.includes('noindex,follow'),'Retired route indexed as independent site');
for(const name of ['app.js','styles.css','reader-links.js','data/research-index.json']){
  assert(!existsSync(join(publish,'v2',name)),'Legacy site artifact still published: '+name);
}
const original=walk(source),copied=walk(v3);
assert(original.length>70,'Research site artifacts unexpectedly few');
assert(JSON.stringify(original)===JSON.stringify(copied),'Astro V3 copied incompletely');
for(const path of original)assert(hash(join(source,path))===hash(join(v3,path)),'Altered research file: '+path);

for(const path of ['index.html','library/index.html','search/index.html','graph.json','pagefind/pagefind.js','404.html','atlas/sanctum/assets/world-mobile.webp']){
  assert(existsSync(join(v3,path)),'Missing V3 route or asset: '+path);
}
const docs=allDocs();
assert(docs.length>=60,'Original research Markdown removed');
for(const doc of docs){
  assert(doc.href.startsWith(BASE),'Invalid original research URL: '+doc.file);
  const route=join(v3,decodeURIComponent(doc.href.slice(BASE.length)),'index.html');
  assert(existsSync(route)&&statSync(route).size>100,'Research page missing: '+doc.file);
}
assert(!existsSync(join(v3,'governance/THREAT-MODEL/index.html')),'Excluded security source published');
const graph=JSON.parse(readFileSync(join(v3,'graph.json'),'utf8'));
assert(graph.nodes.length===docs.length,'Graph and research document counts differ');
const v3index=readFileSync(join(v3,'index.html'),'utf8');
assert(v3index.includes('url=/Research-/'),'Secondary home must redirect to canonical root');
console.log('Single-site Pages PASS: 1 home, 1 original V3 archive, 1 V2 compatibility redirect, '+docs.length+' source articles, '+original.length+' assets.');
