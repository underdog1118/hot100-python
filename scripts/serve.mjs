import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;
const port = Number(process.env.PORT || 4173);
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webp': 'image/webp',
};

createServer(async (req, res) => {
  try {
    const requestPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    const relative = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
    const filePath = normalize(join(root, relative));
    if (!filePath.startsWith(normalize(root))) throw new Error('Invalid path');
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error('Not a file');
    res.writeHead(200, { 'Content-Type': types[extname(filePath)] || 'application/octet-stream' });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Local site: http://127.0.0.1:${port}`);
});
