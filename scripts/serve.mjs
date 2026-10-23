import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const args = process.argv.slice(2);
const option = (key, fallback) => { const i = args.indexOf(key); return i < 0 ? fallback : args[i + 1]; };
const port = Number(option('--port', process.env.PORT || 4173));
const host = option('--host', '127.0.0.1');
const root = resolve(args.includes('--dist') ? 'dist' : '.');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8' };
const policy = "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'; object-src 'none'; frame-ancestors 'none'";
const server = http.createServer(async (req, res) => {
  const headers = { 'Content-Security-Policy': policy, 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Cache-Control': 'no-cache' };
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { ...headers, Allow: 'GET, HEAD' }); res.end(); return; }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (['/xray', '/xray/', '/xray.html'].includes(pathname)) { res.writeHead(302, { ...headers, Location: '/' }); res.end(); return; }
    if (!(pathname === '/' || pathname === '/index.html' || pathname.startsWith('/src/'))) throw new Error('not public');
    const file = resolve(root, pathname === '/' ? 'index.html' : `.${pathname}`);
    if (!(file === resolve(root, 'index.html') || file.startsWith(resolve(root, 'src') + sep)) || !(await stat(file)).isFile()) throw new Error('not public');
    const data = await readFile(file);
    res.writeHead(200, { ...headers, 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Content-Length': data.length });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(404, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Not found'); }
});
server.on('error', error => { console.error(`Cannot start NYQVRA: ${error.message}`); process.exitCode = 1; });
server.listen(port, host, () => console.log(`NYQVRA: http://${host}:${server.address().port}${args.includes('--dist') ? ' (production build)' : ''}`));
