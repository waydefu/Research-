/** Dependency-free, reproducible Markdown -> browseable static research index. */
import {readFile,readdir,writeFile,mkdir,cp,rm} from 'node:fs/promises';
import {resolve,relative,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const DIR=dirname(fileURLToPath(import.meta.url));
export const SHOWCASE=resolve(DIR,'..');
export const ROOT=resolve(SHOWCASE,'..');
export const GROUPS=['web','agents','security','data','creative','research'];
const ALLOWED=['research','docs/governance'];
const isMarkdown=name=>name.toLowerCase().endsWith('.md');
export function classify(path){
 const p=path.toLowerCase();
 if(p.startsWith('docs/governance/')||p.endsWith('/eag-100.md')||p.includes('security-and-ci')||p.includes('secure-agent-cicd'))return 'security';
 if(p.includes('search-routing')||p.includes('index-database')||p.includes('memory-and-rag')||p.includes('code-intelligence')||p.includes('search-result')||p.includes('evaluation-and-benchmarks'))return 'data';
 if(p.includes('creative-direction')||p.includes('motion-graphics')||p.includes('github-creative')||p.includes('design-performance')||p.includes('effects-recipes')||p.includes('creative-web')||p.includes('web-motion-3d')||p.includes('ui-design-skills'))return 'creative';
 if(p.includes('universal-web-engine'))return 'web';
 if(p.includes('agent-engineering')||p.includes('agent-repository-operations')||p.includes('agent-orchestration')||p.includes('agent-skills')||p.includes('agent-workflows')||p.includes('agent-usage'))return 'agents';
 return 'research';
}
function strip(s){return s.replace(/`([^`]*)`/g,'$1').replace(/!\[([^\]]*)\]\([^)]*\)/g,'$1').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[*_~>]/g,'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim()}
export function documentFromMarkdown(path,markdown){
 const lines=markdown.replace(/\r\n/g,'\n').split('\n');
 const title=strip(lines.find(line=>/^#\s+/.test(line))?.replace(/^#\s+/,'')||path.split('/').at(-1).replace(/\.md$/i,''));
 const headings=lines.filter(l=>/^#{2,3}\s+/.test(l)).map(l=>strip(l.replace(/^#{2,3}\s+/,''))).filter(Boolean).slice(0,16);
 const paras=lines.map(x=>x.trim()).filter(s=>s&&!s.startsWith('#')&&!s.startsWith('|')&&!s.startsWith('```')&&!s.startsWith('- ')&&!s.startsWith('>')&&!/^\d+\./.test(s)&&!s.startsWith('![')&&!s.startsWith('[')&&!s.startsWith('---'));
 const summary=strip(paras.find(x=>x.length>26)||paras[0]||'').slice(0,150);
 const tags=[...new Set([...(title.match(/[A-Za-z][A-Za-z0-9+.\-/]{2,}/g)||[]),...(headings.join(' ').match(/WebGPU|WebGL|Agent|MCP|CI\/CD|EAG-100|React|Next\.js|Shader|SEO|FTS5|GSAP|GPU|HRTF/gi)||[])])].slice(0,20);
 return {id:path,title:title.slice(0,170),path,group:classify(path),summary,headings,tags};
}
async function walk(dir){let results=[];for(const item of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name,'en'))){const path=join(dir,item.name);if(item.isDirectory()){if(!item.name.startsWith('.'))results.push(...await walk(path))}else if(item.isFile()&&isMarkdown(item.name))results.push(path)}return results}
export async function collect(root=ROOT){let all=[];for(const allowed of ALLOWED){try{all.push(...await walk(join(root,allowed)))}catch(e){if(e.code!=='ENOENT')throw e}}try{await readFile(join(root,'README.md'),'utf8');all.push(join(root,'README.md'))}catch{}return (await Promise.all(all.map(async abs=>documentFromMarkdown(relative(root,abs).replaceAll('\\','/'),await readFile(abs,'utf8'))))).sort((a,b)=>a.path.localeCompare(b.path,'en'))}
function sourceCommit(root){try{return execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim()}catch{return ''}}
export async function makeIndex(root=ROOT){const documents=await collect(root);if(!documents.length)throw new Error('Research Markdown not found; run build from a full Repository checkout');return {schema:1,sourceCommit:sourceCommit(root),documents}}
export async function build(){const data=await makeIndex();await (await import('./fonts.mjs')).prepareFonts();await mkdir(join(SHOWCASE,'data'),{recursive:true});await writeFile(join(SHOWCASE,'data','research-index.json'),JSON.stringify(data,null,2)+'\n');const out=join(SHOWCASE,'dist');await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});for(const name of ['index.html','styles.css','app.js','artifact.js','mesh-core.js','scene-director.js','interaction-core.js'])await cp(join(SHOWCASE,name),join(out,name));await cp(join(SHOWCASE,'assets'),join(out,'assets'),{recursive:true});await cp(join(SHOWCASE,'data'),join(out,'data'),{recursive:true});console.log(`Built ${data.documents.length} documents from ${data.sourceCommit||'non-Git checkout'} to ${out}`);return data}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){build().catch(e=>{console.error(e);process.exitCode=1})}