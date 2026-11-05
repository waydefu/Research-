import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const root = resolve('pages-dist');
const base = '/Research-/';
const port = 4326;
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.wasm':'application/wasm', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.ttf':'font/ttf', '.png':'image/png', '.webp':'image/webp', '.pf_index':'application/octet-stream', '.pf_meta':'application/octet-stream', '.pf_filter':'application/octet-stream', '.pf_fragment':'application/octet-stream' };

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1:' + port);
    if (!url.pathname.startsWith(base)) { response.writeHead(404); response.end(); return; }
    const tail = decodeURIComponent(url.pathname.slice(base.length));
    let file = resolve(root, tail);
    if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const data = await readFile(file);
    response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    response.end(data);
  } catch { response.writeHead(404); response.end('Not found'); }
}).listen(port,'127.0.0.1', () => console.log('Combined V2/V3 Pages test server active on ' + port));
