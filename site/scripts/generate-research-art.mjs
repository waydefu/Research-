// Build-time output only; all sources are local authored SVG. No third-party assets.
import {mkdirSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {allDocs,ROOT} from '../src/lib/catalog.mjs';
import {visualForDoc,renderResearchArt,visualCoverage} from '../src/lib/research-visuals.mjs';

export function generateResearchArt(docs=allDocs()){
  const coverage=visualCoverage(docs);
  if(coverage.known!==coverage.total||coverage.filenames.length!==coverage.total)
    throw new Error('研究原創視覺覆蓋率／檔名不一致：'+JSON.stringify(coverage));
  const folder=resolve(ROOT,'site/public/research-figures');
  mkdirSync(folder,{recursive:true});
  const manifest=[];
  for(const doc of docs){
    const visual=visualForDoc(doc);
    const name=visual.src.split('/').at(-1);
    writeFileSync(join(folder,name),renderResearchArt(doc),'utf8');
    manifest.push({
      file:doc.file,src:visual.src,alt:visual.alt,kind:visual.kind,
      license:visual.license,source:visual.source,motif:visual.motif,scene:visual.scene,originalWork:false
    });
  }
  writeFileSync(join(folder,'manifest.json'),JSON.stringify({schemaVersion:1,originalAssets:true,items:manifest},null,2)+'\n','utf8');
  return {written:manifest.length,output:folder};
}
