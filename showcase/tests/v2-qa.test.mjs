import test from 'node:test';
import assert from 'node:assert/strict';
import {percentile} from '../qa-metrics.js';
test('lab frame percentile ignores invalid samples; does not invent hardware metrics',()=>{
 assert.equal(percentile([]),null);
 assert.equal(percentile([10,12,16,17,20,25,NaN,Infinity,-1],.95),25);
 assert.equal(percentile([10,12,16,17,20,25],.5),16);
});
