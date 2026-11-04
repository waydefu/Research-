// Source review dispositions are an editorial overlay, never a claim that
// every original Markdown statement is independently verified.
import manifest from '../../P1-ISSUE59-REVIEW.json';
const records=new Map(manifest.items.map(x=>[x.path,x]));
export function reviewForSource(file){
  return records.get(file)||null;
}
export const REVIEW_COUNT=records.size;
