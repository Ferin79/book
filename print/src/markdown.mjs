// Turns one chapter markdown file into the HTML the print stylesheet expects.
//
// The chapters use a small, fixed vocabulary (checked across all files):
//   # Label: Title          -> chapter opener
//   ---                     -> scene break ornament
//   > verse lines           -> scripture figure (verse, source, translation)
//   > — *Source*
//   >
//   > **Translation:** ...
// Anything else is ordinary paragraphs with *em* / **strong**.

import MarkdownIt from 'markdown-it';
import hyphenEnGb from 'hyphen/en-gb/index.js';
const hyphenateEn = hyphenEnGb.hyphenateSync;

const md = new MarkdownIt({ html: true, typographer: true });

const DEVANAGARI = /[ऀ-ॿ]/;
const GUJARATI = /[઀-૿]/;

const scriptOf = (text) =>
  DEVANAGARI.test(text) ? 'deva' : GUJARATI.test(text) ? 'gujr' : 'latn';

const inline = (text) => md.renderInline(text);

function renderQuote(rawLines) {
  const lines = rawLines.map((l) => l.replace(/^>\s?/, ''));

  // Paragraphs inside the quote are separated by a bare ">" line.
  const paras = [[]];
  for (const l of lines) {
    if (l.trim() === '') paras.push([]);
    else paras.at(-1).push(l);
  }
  const [first = [], ...rest] = paras.filter((p) => p.length);

  const sourceLine = first.find((l) => /^—\s/.test(l));
  const textLines = first.filter((l) => l !== sourceLine);
  const isProse = /^["“]/.test(textLines[0] ?? '');
  const script = scriptOf(textLines.join(' '));

  const body = isProse
    ? `<p class="verse-line">${inline(textLines.join(' '))}</p>`
    : textLines.map((l) => `<span class="verse-line">${inline(l)}</span>`).join('');

  const source = sourceLine
    ? `<figcaption class="verse-source">${inline(sourceLine.replace(/^—\s*/, ''))}</figcaption>`
    : '';

  const translation = rest
    .map((p) => {
      const html = inline(p.join(' ')).replace(
        /^<strong>(.+?):?<\/strong>:?\s*/,
        (_, label) => `<span class="verse-label">${label.replace(/:$/, '')}</span> `,
      );
      return `<p class="verse-translation">${html}</p>`;
    })
    .join('');

  return (
    `<figure class="verse${isProse ? ' verse--prose' : ''}">` +
    `<blockquote class="verse-text script-${script}">${body}</blockquote>` +
    `${source}${translation}</figure>`
  );
}

/**
 * @returns {{ label: string, title: string, html: string }}
 */
export function renderChapter(source, lang) {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');

  const h = lines.findIndex((l) => /^#\s/.test(l));
  if (h === -1) throw new Error('chapter has no "# " heading');
  const heading = lines[h].replace(/^#\s+/, '').trim();
  const m = heading.match(/^(.+?)\s*:\s*(.+)$/);
  const label = m ? m[1] : '';
  const title = m ? m[2] : heading;

  // Swap each blockquote run for a one-line HTML block, then let markdown-it
  // handle the rest. Blank lines around it keep it a standalone HTML block.
  const out = [];
  let quote = [];
  const flush = () => {
    if (!quote.length) return;
    out.push('', renderQuote(quote), '');
    quote = [];
  };
  for (const l of lines.slice(h + 1)) {
    if (l.startsWith('>')) quote.push(l);
    else {
      flush();
      out.push(l);
    }
  }
  flush();

  let html = md
    .render(out.join('\n'))
    .replace(/<hr>/g, '<div class="scene-break" role="separator"><span></span><span></span><span></span></div>');

  // Mark the chapter's first paragraph for the book-style first-line lead-in.
  // A class (not :first-child) because Paged.js re-clones the body on every page.
  html = html.replace(/^<p>/, '<p class="opening">');

  if (lang === 'en') html = hyphenateEn(html, { minWordLength: 7 });

  return { label, title, html };
}
