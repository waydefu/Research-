// P0.5-C: metadata validation only. Do not rewrite the research Markdown or infer unknown facts.
// Legacy entries keep their existing public behavior; canonical v1 is opt-in until migration is approved.
export const METADATA_SCHEMA_VERSION = 1;
export const CANONICAL_FIELDS = Object.freeze([
  'publicTitle','summary','domain','topic','tags','creator','originalSource',
  'demo','license','verifiedAt','image','evidenceLevel'
]);
export const EVIDENCE_LEVELS = Object.freeze(['primary','secondary','self-reported','unverified']);
const LEGACY_FIELDS = new Set(['title','lead','topic','creator','demos']);
const REQUIRED_KEYS = new Set(['schemaVersion',...CANONICAL_FIELDS]);
const nonblank = value => typeof value === 'string' && value.trim().length > 0;
const traditionalReadable = value => nonblank(value) && /[\u3400-\u9fff]/u.test(value);
const httpsUrl = value => {
  if (!nonblank(value)) return false;
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
};
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const reference = value => record(value) && nonblank(value.label) && httpsUrl(value.url);
const demoRecord = value => record(value) && nonblank(value.label) && httpsUrl(value.url)
  && nonblank(value.note);

export function validateMetadataEntry(file, entry) {
  const errors = [];
  const add = message => errors.push(file + '：' + message);
  if (!nonblank(file) || !record(entry)) return [String(file) + '：metadata 必須是物件，且來源路徑不可為空'];
  const canonical = Object.hasOwn(entry,'schemaVersion');
  if (!canonical) {
    for (const key of Object.keys(entry)) if (!LEGACY_FIELDS.has(key)) add('舊欄位不認得 '+key+'；新格式請明示 schemaVersion: 1');
    for (const key of ['title','lead','topic']) if (Object.hasOwn(entry,key) && !traditionalReadable(entry[key])) add(key+' 必須為非空中文');
    if (entry.creator !== undefined && entry.creator !== null && !reference(entry.creator)) add('creator 需要 HTTPS url 與 label');
    if (entry.demos !== undefined && (!Array.isArray(entry.demos) || !entry.demos.every(demoRecord))) add('demos 必須是完整的 HTTPS 示範陣列');
    return errors;
  }
  if (entry.schemaVersion !== METADATA_SCHEMA_VERSION) add('schemaVersion 只能是 1');
  for (const key of REQUIRED_KEYS) if (!Object.hasOwn(entry,key)) add('缺必要欄位 '+key+'（未知值請明示 null，不可猜測）');
  for (const key of Object.keys(entry)) if (!REQUIRED_KEYS.has(key)) add('未定義欄位 '+key);
  for (const key of ['publicTitle','summary','topic']) if (!traditionalReadable(entry[key])) add(key+' 必須是非空中文');
  if (!nonblank(entry.domain)) add('domain 必須對應原始來源資料夾');
  if (!Array.isArray(entry.tags) || !entry.tags.every(nonblank) || new Set(entry.tags).size !== entry.tags.length) add('tags 必須是無重複的非空文字陣列');
  if (entry.creator !== null && !reference(entry.creator)) add('creator 應為 null 或 {label, https url}');
  if (entry.originalSource !== null && !reference(entry.originalSource)) add('originalSource 應為 null 或 {label, https url}');
  if (!Array.isArray(entry.demo) || !entry.demo.every(demoRecord)) add('demo 必須是 [{label, https url, note}] 或 []');
  if (entry.license !== null && !(record(entry.license) && nonblank(entry.license.expression) && httpsUrl(entry.license.sourceUrl))) add('license 應為 null 或 {expression, sourceUrl}；無來源不可推定授權');
  const dateValid=entry.verifiedAt===null || (typeof entry.verifiedAt==='string' && /^\d{4}-\d{2}-\d{2}$/.test(entry.verifiedAt) && !Number.isNaN(Date.parse(entry.verifiedAt)) && new Date(entry.verifiedAt).toISOString().slice(0,10)===entry.verifiedAt);
  if (!dateValid) add('verifiedAt 應為 null 或有效 YYYY-MM-DD');
  if (!EVIDENCE_LEVELS.includes(entry.evidenceLevel)) add('evidenceLevel 必須是 primary、secondary、self-reported 或 unverified');
  if (entry.evidenceLevel && entry.evidenceLevel !== 'unverified' && !entry.verifiedAt) add('已查證的 evidenceLevel 必須附 verifiedAt');
  if (entry.image !== null && !(record(entry.image) && nonblank(entry.image.src) && nonblank(entry.image.alt) && (entry.image.src.startsWith('/Research-/v3/') || httpsUrl(entry.image.src)))) add('image 應為 null 或 {src, alt}，來源須可追溯');
  return errors;
}

export function validateMetadataRegistry(registry) {
  if (!record(registry)) throw new Error('Metadata registry 必須是以來源檔案為 key 的物件');
  const errors = Object.entries(registry).flatMap(([file,entry]) => validateMetadataEntry(file,entry));
  if (errors.length) throw new Error('研究 Metadata Schema 未通過：\n'+errors.join('\n'));
  return true;
}
