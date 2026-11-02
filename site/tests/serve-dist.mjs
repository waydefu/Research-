import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist');
const prefix = '/Research-/v3/';
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.wasm':'application/wasm', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.png':'image/png', '.webp':'image/webp', '.pf_index':'application/octet-stream', '.pf_meta':'application/octet-stream', '.pf_filter':'application/octet-stream', '.pf_fragment':'application/octet-stream' };
const port = Number(process.env.P0_TEST_PORT || 4325);
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1:' + port);
    if (!url.pathname.startsWith(prefix)) { res.writeHead(404); res.end('Outside V3 base'); return; }
    const suffix = decodeURIComponent(url.pathname.slice(prefix.length));
    let path = resolve(root, suffix);
    if (path !== root && !path.startsWith(root + sep)) { res.writeHead(403); res.end('Forbidden'); return; }
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    const data = await readFile(path);
    res.writeHead(200, {'Content-Type': mime[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin':'*'});
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log('P0 static test server on ' + port));
