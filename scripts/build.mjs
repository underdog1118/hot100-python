import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { marked } from 'marked';

const root = new URL('../', import.meta.url);
const docsPath = new URL('docs/hot100-python.md', root);
const templatePath = new URL('src/template.html', root);
const stylesPath = new URL('src/styles.css', root);
const scriptPath = new URL('src/site.js', root);
const assetsPath = new URL('assets/', root);
const distPath = new URL('dist/', root);

await rm(distPath, { recursive: true, force: true });
await mkdir(distPath, { recursive: true });

const [markdown, template, styles, script] = await Promise.all([
  readFile(docsPath, 'utf8'),
  readFile(templatePath, 'utf8'),
  readFile(stylesPath, 'utf8'),
  readFile(scriptPath, 'utf8'),
]);

marked.setOptions({ gfm: true, breaks: false });
const frontMatter = markdown
  .replace(/^---\n[\s\S]*?\n---\n/, '')
  .replaceAll('../assets/', 'assets/');
const content = marked.parse(frontMatter);
const html = template
  .replace('/* INLINE_STYLES */', styles)
  .replace('<!-- DOCUMENT_CONTENT -->', content)
  .replace('/* INLINE_SCRIPT */', script);

await writeFile(new URL('index.html', distPath), html);
await cp(assetsPath, new URL('assets/', distPath), { recursive: true });

console.log('Built dist/index.html');
