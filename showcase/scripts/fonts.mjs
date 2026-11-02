/* Pinned, verified SIL OFL font acquisition for static self-hosting. No runtime CDN. */
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {SHOWCASE} from './build.mjs';

export const FONT_REF='6c1dbe27dcf7d817d4b62cec033ba77fa8e2a5ec';
export const FONTS=[
  {family:'Instrument Serif',path:'ofl/instrumentserif/InstrumentSerif-Regular.ttf',file:'instrument-serif-regular.ttf',blob:'36fac00ef9b7d523236df6536cb09c712bb2c7e4'},
  {family:'Instrument Serif Italic',path:'ofl/instrumentserif/InstrumentSerif-Italic.ttf',file:'instrument-serif-italic.ttf',blob:'192c3eda9864241ad280e9bcc84e258c80a4a588'},
  {family:'Manrope',path:'ofl/manrope/Manrope[wght].ttf',file:'manrope-variable.ttf',blob:'75274da58537d6123b14f2cd0c355ad4681fc2b3'},
  {family:'IBM Plex Mono',path:'ofl/ibmplexmono/IBMPlexMono-Regular.ttf',file:'ibm-plex-mono.ttf',blob:'0c9770d5183ba60dc4350d3e011b782a320761ae'}
];
function gitHash(data){return createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex')}
async function acquire(font){
  const dest=join(SHOWCASE,'assets/fonts',font.file);
  try {
    const current=await readFile(dest);
    if(gitHash(current)===font.blob)return;
  } catch { /* fetch on first build */ }
  const url=`https://raw.githubusercontent.com/google/fonts/${FONT_REF}/${font.path.split('/').map(encodeURIComponent).join('/')}`;
  const response=await fetch(url,{signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw new Error(`Font download ${font.file}: HTTP ${response.status}`);
  const data=Buffer.from(await response.arrayBuffer());
  if(gitHash(data)!==font.blob)throw new Error(`Font integrity mismatch: ${font.file}`);
  await writeFile(dest,data);
}
export async function prepareFonts(){
  await mkdir(join(SHOWCASE,'assets/fonts'),{recursive:true});
  for(const font of FONTS)await acquire(font);
  console.log(`OFL self-host fonts verified: ${FONTS.length} immutable Git blobs`);
}
