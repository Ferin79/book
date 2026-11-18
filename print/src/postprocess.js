// Runs in the browser after Paged.js has laid out every page.
// Fills in folios, running heads and the contents page numbers, then
// sets window.__bookReady so the build script knows it can print.
(function () {
  const GU_DIGITS = '૦૧૨૩૪૫૬૭૮૯';
  const toGu = (n) => String(n).replace(/\d/g, (d) => GU_DIGITS[d]);

  // Folio 1 is the title page: the front cover and its blank inside are not counted.
  const FOLIO_OFFSET = 2;

  function finish() {
    const book = window.__BOOK__;
    const pages = [...document.querySelectorAll('.pagedjs_page')];
    const folioOf = {};
    const stats = {
      pages: pages.length, chapters: {}, gu: 0, en: 0, blank: 0,
      blankPages: [], coverPages: [], minEdgeMm: Infinity, tooClose: [],
    };

    pages.forEach((page, i) => {
      const n = i + 1;
      const folio = n - FOLIO_OFFSET;
      const area = page.querySelector('.pagedjs_area');
      const langEl = area.querySelector('[data-lang]');
      const lang = langEl ? langEl.getAttribute('data-lang') : null;
      const chapter = area.querySelector('.chapter[data-title]');
      const opener = area.querySelector('.chapter-opener');
      const isBlank = !area.textContent.trim() && !area.querySelector('img');
      const quiet = isBlank || opener || area.querySelector('.no-folio');

      if (isBlank) { stats.blank++; stats.blankPages.push(n); }
      if (area.querySelector('.cover')) stats.coverPages.push(n);
      if (lang) page.classList.add('page-' + lang);
      if (chapter && lang) stats[lang]++;

      area.querySelectorAll('[id]').forEach((el) => {
        folioOf[el.id] = folio;
        if (el.classList.contains('chapter')) stats.chapters[el.id] = { pdfPage: n, folio };
      });

      const head = page.querySelector('.pagedjs_margin-top-center .pagedjs_margin-content');
      const foot = page.querySelector('.pagedjs_margin-bottom-center .pagedjs_margin-content');
      if (!head || !foot || quiet || !chapter) return;

      const isLeft = page.classList.contains('pagedjs_left_page');
      head.textContent = isLeft ? book.title[lang] : chapter.getAttribute('data-title');
      foot.textContent = lang === 'gu' ? toGu(folio) : String(folio);
    });

    document.querySelectorAll('.toc-page[data-target]').forEach((el) => {
      const folio = folioOf[el.getAttribute('data-target')];
      el.textContent = folio == null ? '?' : el.closest('[lang="gu"]') ? toGu(folio) : String(folio);
    });

    measureSafeZone(pages, stats);
    window.__bookStats = stats;
    window.__bookReady = true;
  }

  // Pothi: nothing printed within 0.6in of the trim. Measure the real ink
  // boxes of every text run (body, running heads, folios) on non-cover pages.
  const SAFE_MM = 15.24;
  const PX_PER_MM = 96 / 25.4;
  function measureSafeZone(pages, stats) {
    pages.forEach((page, i) => {
      if (page.querySelector('.cover')) return;
      const box = page.querySelector('.pagedjs_sheet').getBoundingClientRect();
      const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT, {
        acceptNode: (t) => (t.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
      });
      const range = document.createRange();
      let min = Infinity;
      let culprit = '';
      for (let t = walker.nextNode(); t; t = walker.nextNode()) {
        range.selectNodeContents(t);
        for (const r of range.getClientRects()) {
          if (!r.width || !r.height) continue;
          const d = Math.min(r.left - box.left, box.right - r.right, r.top - box.top, box.bottom - r.bottom);
          if (d < min) { min = d; culprit = t.textContent.trim().slice(0, 40); }
        }
      }
      const mm = min / PX_PER_MM;
      stats.minEdgeMm = Math.min(stats.minEdgeMm, mm);
      if (mm < SAFE_MM) stats.tooClose.push({ page: i + 1, mm: Math.round(mm * 10) / 10, text: culprit });
    });
    stats.minEdgeMm = Math.round(stats.minEdgeMm * 10) / 10;
  }

  // Layout starts only once stylesheets and every web font have loaded,
  // so line breaks are measured with the real fonts.
  async function waitForFonts() {
    if (document.readyState !== 'complete') {
      await new Promise((r) => window.addEventListener('load', r, { once: true }));
    }
    void document.body.offsetHeight; // force layout so lazy unicode-range fonts are requested
    const samples = [
      ['400 11pt "EB Garamond"', 'Ag'],
      ['italic 400 11pt "EB Garamond"', 'Ag'],
      ['400 11pt "Noto Serif Gujarati"', 'મોટી'],
      ['600 11pt "Noto Serif Gujarati"', 'મોટી'],
      ['400 11pt "Tiro Devanagari Sanskrit"', 'धर्म'],
    ];
    await Promise.all(samples.map(([font, text]) => document.fonts.load(font, text)));
    await document.fonts.ready;
  }

  // hyphenGlyph: Paged.js adds this when a word splits across pages; its default (U+2011)
  // is missing from EB Garamond and would fall back to Times New Roman.
  window.PagedConfig = { auto: true, before: waitForFonts, after: finish, settings: { hyphenGlyph: '-' } };
})();
