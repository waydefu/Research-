import test from 'node:test';
import assert from 'node:assert/strict';
import {mountArtifact} from '../artifact.js';

function harness() {
  const original = new Map();
  const save = (name, value) => {
    original.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, {configurable: true, writable: true, value});
  };
  const listeners = new Map();
  const emitter = () => ({
    addEventListener(type, cb) {listeners.set(type, cb)},
    removeEventListener(type, cb) {if (listeners.get(type) === cb) listeners.delete(type)},
    dispatch(type, event = {}) {const handler = listeners.get(type); assert.ok(handler, `missing handler ${type}`); handler(event)}
  });
  const classes = new Set();
  let draws = 0, deletes = 0, id = 0;
  const queue = new Map();
  const gl = {
    VERTEX_SHADER: 35633, FRAGMENT_SHADER: 35632, COMPILE_STATUS: 35713,
    LINK_STATUS: 35714, ARRAY_BUFFER: 34962, STATIC_DRAW: 35044,
    FLOAT: 5126, TRIANGLES: 4,
    createShader: () => ({}), shaderSource() {}, compileShader() {},
    getShaderParameter: () => true, getShaderInfoLog: () => '', deleteShader() {},
    createProgram: () => ({}), attachShader() {}, linkProgram() {},
    getProgramParameter: () => true, getProgramInfoLog: () => '',
    deleteProgram() {deletes++}, createBuffer: () => ({}),
    bindBuffer() {}, bufferData() {}, deleteBuffer() {deletes++},
    getAttribLocation: () => 0, vertexAttribPointer() {}, enableVertexAttribArray() {},
    getUniformLocation: () => ({}), useProgram() {}, uniform2f() {}, uniform1f() {},
    viewport() {}, drawArrays() {draws++}
  };
  const canvas = {
    ...emitter(), width: 0, height: 0, getContext: () => gl,
    classList: {add: k => classes.add(k), remove: k => classes.delete(k), contains: k => classes.has(k)},
    getBoundingClientRect: () => ({width: 400, height: 400, left: 0, top: 0})
  };
  const mq = {matches: false, ...emitter()};
  let intersect;
  save('navigator', {connection: {saveData: false}});
  save('matchMedia', () => mq);
  save('window', {devicePixelRatio: 1, ...emitter()});
  save('document', {hidden: false, ...emitter()});
  save('IntersectionObserver', class {constructor(cb) {intersect = cb} observe() {} disconnect() {}});
  save('ResizeObserver', class {observe() {} disconnect() {}});
  save('requestAnimationFrame', cb => {queue.set(++id, cb); return id});
  save('cancelAnimationFrame', n => {queue.delete(n)});
  const label = {textContent: ''};
  return {
    canvas, label, classes, gl, mq,
    show: on => intersect([{isIntersecting: on}]),
    frame: now => {const entry = queue.entries().next().value; assert.ok(entry, 'a frame is scheduled'); queue.delete(entry[0]); entry[1](now)},
    get draws() {return draws}, get deletes() {return deletes}, get pending() {return queue.size},
    restore() {for (const [key, descriptor] of original) {if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]}}
  };
}

test('GPU downshift ultimately stays in CSS fallback after re-entering viewport', () => {
  const h = harness();
  let dispose;
  try {
    dispose = mountArtifact(h.canvas, h.label);
    h.show(true);
    for (let i = 0; i < 110 && h.pending; i++) h.frame(i * 55);
    assert.match(h.label.textContent, /CSS \/ PERFORMANCE FALLBACK/);
    assert.equal(h.classes.has('is-ready'), false);
    assert.equal(h.pending, 0);
    assert.ok(h.deletes >= 2, 'buffers and programs released');
    const before = h.draws;
    h.show(false);
    h.show(true);
    assert.equal(h.pending, 0, 'disabled renderer must not restart invisibly');
    assert.equal(h.draws, before);
  } finally {dispose?.(); h.restore()}
});

test('context loss returns poster then restoration allows exactly one frame loop', () => {
  const h = harness();
  let dispose;
  try {
    dispose = mountArtifact(h.canvas, h.label);
    h.show(true);
    assert.equal(h.pending, 1);
    let prevented = false;
    h.canvas.dispatch('webglcontextlost', {preventDefault() {prevented = true}});
    assert.equal(prevented, true);
    assert.match(h.label.textContent, /CONTEXT LOST/);
    assert.equal(h.pending, 0);
    assert.equal(h.classes.has('is-ready'), false);
    h.canvas.dispatch('webglcontextrestored');
    assert.equal(h.classes.has('is-ready'), true);
    assert.equal(h.pending, 1, 'one recovered animation loop');
    h.frame(16);
    assert.equal(h.pending, 1);
  } finally {dispose?.(); h.restore()}
});
