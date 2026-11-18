// Builds the print-ready bilingual PDF.
//
//   npm run build            (from print/)
//
// Steps: read chapters -> HTML -> Paged.js layout in headless Chromium -> PDF.
// Covers are read from print/assets (exported from book.pen via the Pencil MCP).

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import os from 'node:os';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import config from '../book.config.mjs';
import { renderChapter } from './markdown.mjs';
import { makeInterior, makeCover } from './pothi.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'); // print/
const REPO = path.resolve(ROOT, '..');
const OUT_DIR = path.join(ROOT, 'output');
const HTML_FILE = path.join(OUT_DIR, 'book.html');
const PDF_FILE = path.join(ROOT, config.output);

const GU_DIGITS = '૦૧૨૩૪૫૬૭૮૯';
const toGu = (n) => String(n).replace(/\d/g, (d) => GU_DIGITS[d]);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const warnings = [];

// ---------- 1. Read chapters ------------------------------------------------

const langs = config.languages.map((l) => {
  const dir = path.resolve(ROOT, l.dir);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
  const chapters = files.map((file, i) => {
    const { label, title, html } = renderChapter(fs.readFileSync(path.join(dir, file), 'utf8'), l.code);
    return { file, label, title, html, id: `${l.code}-ch${String(i + 1).padStart(2, '0')}`, n: i + 1 };
  });
  return { ...l, chapters };
});

const [a, b] = langs;
const fa = new Set(a.chapters.map((c) => c.file));
const fb = new Set(b.chapters.map((c) => c.file));
for (const f of fa) if (!fb.has(f)) warnings.push(`${f} exists in ${a.dir} but not in ${b.dir}`);
for (const f of fb) if (!fa.has(f)) warnings.push(`${f} exists in ${b.dir} but not in ${a.dir}`);

// ---------- 2. Revision info for the imprint page ---------------------------

function git(cmd) {
  try { return execSync(`git ${cmd}`, { cwd: REPO, encoding: 'utf8' }).trim(); } catch { return ''; }
}
const rev = git('log -1 --format=%h -- Chapters') || 'unknown';
const dirty = git('status --porcelain -- Chapters') !== '';
const now = new Date();
const dateEn = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(now);
const dateGu = new Intl.DateTimeFormat('gu-IN-u-nu-gujr', { dateStyle: 'long' }).format(now);
const year = now.getFullYear();

// ---------- 3. Compose HTML -------------------------------------------------

function coverHtml(which) {
  const rel = config.covers[which];
  const abs = path.join(ROOT, rel);
  const cls = `cover cover--${which} no-folio`;
  if (!fs.existsSync(abs)) {
    warnings.push(`cover image missing: print/${rel} (export it from book.pen)`);
    return `<section class="${cls} cover--missing"><p>${which} cover missing<br>print/${esc(rel)}</p></section>`;
  }
  return `<section class="${cls}"><img src="../${rel}" alt=""></section>`;
}

const ornament = '<div class="ornament"><span></span></div>';

const titlePage = `
<section class="title-page no-folio">
  <div>
    <h1 class="tp-gu" lang="gu">${esc(config.title.gu)}</h1>
    <div class="ornament" style="margin:6mm 0"><span></span></div>
    <p class="tp-en" lang="en">${esc(config.title.en)}</p>
    <div class="tp-tagline"><span lang="gu">${esc(config.tagline.gu)}</span><span lang="en">${esc(config.tagline.en)}</span></div>
  </div>
  <div class="tp-author"><span lang="gu">${esc(config.author.gu)}</span><span lang="en">${esc(config.author.en)}</span></div>
</section>`;

const imprint = `
<section class="imprint no-folio">
  <p lang="gu">${esc(config.draftNotice.gu)}<br>છાપ્યું: ${esc(dateGu)} · પાઠ આવૃત્તિ ${esc(rev)}${dirty ? ' (સાચવ્યા વગરના ફેરફારો સાથે)' : ''}</p>
  <p lang="en">${esc(config.draftNotice.en)}<br>Printed ${esc(dateEn)} · text revision ${esc(rev)}${dirty ? ' (with uncommitted changes)' : ''}</p>
  <p lang="en">This is a true story. Every person named is real and every event is real, or the author’s honest recollection of it.</p>
  <p lang="en">© ${year} ${esc(config.author.en)}. All rights reserved.</p>
</section>`;

const toc = (l) => `
<div class="toc" lang="${l.code}">
  <h2 class="toc-part" lang="${l.code}">${esc(l.partName)}</h2>
  <ol>${l.chapters
    .map(
      (c) => `
    <li><span class="toc-num">${l.code === 'gu' ? toGu(c.n) : c.n}</span><span class="toc-title">${esc(c.title)}</span><span class="toc-leader"></span><span class="toc-page" data-target="${c.id}"></span></li>`,
    )
    .join('')}
  </ol>
</div>`;

const contents = `
<section class="contents no-folio">
  <h1 class="contents-heading"><span lang="gu">${esc(langs[0].contentsTitle)}</span><span class="sep">&nbsp;</span><span lang="en">${esc(langs[1].contentsTitle)}</span></h1>
  ${langs.map(toc).join('')}
</section>`;

const body = langs
  .map(
    (l) => `
<section class="part no-folio" lang="${l.code}" data-lang="${l.code}" id="part-${l.code}">
  <h1 class="part-name">${esc(l.partName)}</h1>
  ${ornament}
  <p class="part-title">${esc(config.title[l.code])}</p>
</section>
${l.chapters
  .map(
    (c) => `
<section class="chapter" id="${c.id}" lang="${l.code}" data-lang="${l.code}" data-title="${esc(c.title)}">
  <header class="chapter-opener">
    ${c.label ? `<p class="chapter-label">${esc(c.label)}</p>` : ''}
    <h1 class="chapter-title">${esc(c.title)}</h1>
    ${ornament}
  </header>
  <div class="chapter-body">${c.html}</div>
</section>`,
  )
  .join('')}`,
  )
  .join('');

// Static (non-variable) font files on purpose: Chromium embeds variable fonts
// in PDFs as Type 3 glyphs, which print-shop preflight checks often reject.
const fontCss = [
  '@fontsource/eb-garamond/400.css',
  '@fontsource/eb-garamond/400-italic.css',
  '@fontsource/noto-serif-gujarati/400.css',
  '@fontsource/noto-serif-gujarati/600.css',
  '@fontsource/tiro-devanagari-sanskrit/devanagari-400.css',
];

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(config.title.en)} · ${esc(config.title.gu)}</title>
<meta name="author" content="${esc(config.author.en)}">
${fontCss.map((f) => `<link rel="stylesheet" href="../node_modules/${f}">`).join('\n')}
<link rel="stylesheet" href="../src/book.css">
<script>window.__BOOK__ = ${JSON.stringify({ title: config.title })};</script>
<script src="../src/postprocess.js"></script>
<script src="../node_modules/pagedjs/dist/paged.polyfill.js"></script>
</head>
<body>
${coverHtml('front')}
${titlePage}
${imprint}
${contents}
${body}
${coverHtml('back')}
</body>
</html>`;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(HTML_FILE, html);

// ---------- 4. Serve print/ over HTTP (web fonts refuse file://) ------------

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const p = path.normalize(path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/output/book.html`;

// ---------- 5. Lay out and print -------------------------------------------

async function launch() {
  const pwDir = path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), '.cache'), 'ms-playwright');
  const cached = fs.existsSync(pwDir)
    ? fs.readdirSync(pwDir).filter((d) => /^chromium-\d+$/.test(d)).sort((x, y) => +y.split('-')[1] - +x.split('-')[1])
    : [];
  for (const d of cached) {
    const exe = path.join(pwDir, d, 'chrome-win64', 'chrome.exe');
    if (fs.existsSync(exe)) return chromium.launch({ executablePath: exe });
  }
  for (const channel of ['chrome', 'msedge']) {
    try { return await chromium.launch({ channel }); } catch {}
  }
  throw new Error('No Chromium found. Run: npx playwright install chromium');
}

const started = Date.now();
const browser = await launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1.6 });
  page.on('pageerror', (e) => warnings.push(`page error: ${e.message}`));
  page.on('requestfailed', (r) => warnings.push(`failed to load: ${r.url()}`));
  await page.goto(url);
  await page.waitForFunction(() => window.__bookReady === true, null, { timeout: 10 * 60_000, polling: 500 });
  const stats = await page.evaluate(() => window.__bookStats);

  // --preview 3,7,8  -> also save those PDF pages as PNGs in output/preview/
  const pi = process.argv.indexOf('--preview');
  if (pi !== -1) {
    const want = (process.argv[pi + 1] || '')
      .split(',')
      .map((s) => (s === 'last' ? stats.pages : s === 'last-1' ? stats.pages - 1 : Number(s)))
      .filter((n) => n >= 1 && n <= stats.pages);
    const dir = path.join(OUT_DIR, 'preview');
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    await page.setViewportSize({ width: 1400, height: 1000 });
    for (const n of want) {
      const loc = page.locator('.pagedjs_page').nth(n - 1);
      await loc.scrollIntoViewIfNeeded();
      await loc.screenshot({ path: path.join(dir, `page-${String(n).padStart(3, '0')}.png`), scale: 'device' });
    }
    console.log(`Preview PNGs: ${path.relative(REPO, dir)}`);
  }

  fs.mkdirSync(path.dirname(PDF_FILE), { recursive: true });
  await page.pdf({ path: PDF_FILE, preferCSSPageSize: true, printBackground: true, outline: true, tagged: true });

  // ---------- 6. Pothi.com upload files ------------------------------------
  const P = config.pothi;
  const abs = (rel) => path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs(P.interior)), { recursive: true });

  const interior = await makeInterior({
    fullPdf: PDF_FILE, stats, out: abs(P.interior), title: config.title.en, author: config.author.en,
  });
  for (const i of interior.issues) warnings.push(`pothi interior: ${i}`);
  for (const t of stats.tooClose) warnings.push(`page ${t.page}: "${t.text}" is ${t.mm}mm from the trim (Pothi minimum 15.24mm)`);

  let cover = null;
  if (stats.coverPages.length === 2) {
    cover = await makeCover({
      frontPng: abs(config.covers.front),
      backPng: abs(config.covers.back),
      interiorPages: interior.pages,
      spec: P,
      outPdf: abs(P.cover),
      title: config.title.en,
      author: config.author.en,
      outPreview: abs(P.coverPreview),
      renderSpine: async ({ width, height }) => {
        const s = P.spine;
        fs.writeFileSync(path.join(OUT_DIR, 'spine.html'), `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="../node_modules/@fontsource/rasa/gujarati-500.css">
<link rel="stylesheet" href="../node_modules/@fontsource/hind-vadodara/gujarati-600.css">
<style>
  html, body { margin: 0; background: transparent; }
  .spine { width: ${width}px; height: ${height}px; box-sizing: border-box; padding: 0 ${Math.round(height * 0.9)}px;
    display: flex; align-items: center; justify-content: space-between; color: ${s.ink}; }
  .t { font: 500 ${Math.round(height * 0.4)}px/1 'Rasa'; }
  .dot { width: ${Math.round(height * 0.14)}px; height: ${Math.round(height * 0.14)}px; border-radius: 50%; background: ${s.accent}; }
  .a { font: 600 ${Math.round(height * 0.24)}px/1 'Hind Vadodara'; }
</style>
<div class="spine"><span class="t">${esc(s.title)}</span><span class="dot"></span><span class="a">${esc(s.author)}</span></div>`);
        const sp = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
        await sp.goto(url.replace('book.html', 'spine.html'));
        await sp.evaluate(async () => {
          await document.fonts.load('500 20px Rasa', 'પિતૃ');
          await document.fonts.load('600 20px "Hind Vadodara"', 'પટેલ');
          await document.fonts.ready;
        });
        const png = await sp.locator('.spine').screenshot({ omitBackground: true });
        await sp.close();
        return png;
      },
    });
    if (Math.abs(cover.widthIn - cover.expectedWidthIn) > 0.01) {
      warnings.push(`cover width ${cover.widthIn.toFixed(3)}in, expected ${cover.expectedWidthIn.toFixed(3)}in`);
    }
    if (cover.space !== 'cmyk') warnings.push(`cover colour space is ${cover.space}, not CMYK`);
    if (cover.maxInkPct > P.maxInkPct) warnings.push(`cover total ink ${cover.maxInkPct}% exceeds ${P.maxInkPct}%`);
    if (!cover.spineText) warnings.push('spine narrower than 0.25in, so it has no text');
  } else {
    warnings.push('no Pothi cover made: cover images missing');
  }

  // ---------- 7. Report ----------------------------------------------------
  const secs = ((Date.now() - started) / 1000).toFixed(0);
  console.log(`\nBuilt ${path.relative(REPO, PDF_FILE)} in ${secs}s`);
  console.log(`\nPothi interior: ${path.relative(REPO, abs(P.interior))}`);
  console.log(`  ${interior.pages} pages, A5, grayscale, no covers; closest text to any trim edge: ${stats.minEdgeMm}mm`);
  if (cover) {
    console.log(`Pothi cover:    ${path.relative(REPO, abs(P.cover))}`);
    console.log(
      `  ${cover.widthIn.toFixed(3)} x ${cover.heightIn.toFixed(3)} in (${cover.pixels}px, ${cover.density} dpi, ${cover.space}),` +
        ` spine ${cover.spineIn.toFixed(3)}in / ${cover.spineMm.toFixed(1)}mm for ${interior.pages} pages, max ink ${cover.maxInkPct}%`,
    );
    console.log(`  preview with trim/fold guides: ${path.relative(REPO, abs(P.coverPreview))}`);
  }
  console.log('');
  console.log(`  ${stats.pages} pages (${stats.gu} Gujarati text pages, ${stats.en} English, ${stats.blank} blank)`);
  console.log(`  text revision ${rev}${dirty ? ' + uncommitted changes' : ''}`);
  for (const l of langs) {
    console.log(`  ${l.partName}:`);
    for (const c of l.chapters) {
      const s = stats.chapters[c.id];
      console.log(`    ${String(c.n).padStart(2)}  ${c.title.padEnd(22)} p.${s ? s.folio : '?'}`);
    }
  }
  if (stats.pages % 2) warnings.push(`odd page count (${stats.pages}); back cover is not on a verso`);
} finally {
  await browser.close();
  server.close();
}

if (warnings.length) {
  console.log('\nWarnings:');
  for (const w of warnings) console.log('  - ' + w);
}
