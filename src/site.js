const article = document.querySelector('.doc');
const toc = document.querySelector('#toc');
const search = document.querySelector('#toc-search');
const menuButton = document.querySelector('.menu-button');
const scrim = document.querySelector('.scrim');
const usedIds = new Set();

function slugify(text) {
  const base = text.trim().toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}\-_]+/gu, '') || 'section';
  let id = base;
  let suffix = 2;
  while (usedIds.has(id)) id = `${base}-${suffix++}`;
  usedIds.add(id);
  return id;
}

const headings = [...article.querySelectorAll('h2, h3, h4, h5, h6')];
for (const heading of headings) {
  heading.id = slugify(heading.textContent);
  const link = document.createElement('a');
  link.href = `#${heading.id}`;
  link.className = `toc-link level-${heading.tagName.slice(1)}`;
  link.textContent = heading.textContent;
  link.dataset.search = heading.textContent.toLowerCase();
  toc.append(link);
}

for (const block of article.querySelectorAll('pre')) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-button';
  button.textContent = '复制';
  button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(block.textContent);
    button.textContent = '已复制';
    setTimeout(() => { button.textContent = '复制'; }, 1200);
  });
  block.append(button);
}

search.addEventListener('input', () => {
  const query = search.value.trim().toLowerCase();
  for (const link of toc.querySelectorAll('a')) {
    link.hidden = Boolean(query) && !link.dataset.search.includes(query);
  }
});

const tocLinks = new Map([...toc.querySelectorAll('a')].map((link) => [link.hash.slice(1), link]));
const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
  if (!visible.length) return;
  for (const link of tocLinks.values()) link.removeAttribute('aria-current');
  const active = tocLinks.get(visible[0].target.id);
  if (active) active.setAttribute('aria-current', 'location');
}, { rootMargin: '-72px 0px -75% 0px' });
headings.forEach((heading) => observer.observe(heading));

function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  scrim.hidden = !open;
}
menuButton.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
scrim.addEventListener('click', () => setMenu(false));
toc.addEventListener('click', () => setMenu(false));
