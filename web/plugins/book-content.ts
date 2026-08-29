import fs from 'node:fs';
import path from 'node:path';
import MarkdownIt from 'markdown-it';
import type { Plugin } from 'vite';

export const VIRTUAL_ID = 'virtual:book';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

export interface Chapter {
  /** Stable DOM id / hash anchor target, e.g. "chapter-01". */
  id: string;
  /** Zero-padded source number, e.g. "01". */
  number: string;
  /** Spelled-out label taken from the heading, e.g. "Chapter One". */
  label: string;
  /** Chapter title without the label, e.g. "Shambu". */
  title: string;
  /** Rendered HTML body (the H1 heading is stripped out). */
  html: string;
  wordCount: number;
  /** Whole minutes, floored at 1. */
  readingMinutes: number;
}

/**
 * Splits "# Chapter Two: A Glass of Water" into its label and title halves.
 * Falls back gracefully when a heading has no colon.
 */
function splitHeading(heading: string): { label: string; title: string } {
  const idx = heading.indexOf(':');
  if (idx === -1) return { label: '', title: heading.trim() };
  return {
    label: heading.slice(0, idx).trim(),
    title: heading.slice(idx + 1).trim(),
  };
}

function createRenderer(): MarkdownIt {
  const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    breaks: false,
  });

  // A thematic break in the source is a scene break in the book, not a rule.
  // Render it as a decorative ornament that screen readers skip.
  md.renderer.rules.hr = () =>
    '<div class="scene-break" role="separator"><span aria-hidden="true">❧</span></div>\n';

  // Tag the opening paragraph so CSS can give it a drop cap.
  const defaultParagraph =
    md.renderer.rules.paragraph_open ??
    ((tokens, i, opts, _env, self) => self.renderToken(tokens, i, opts));
  md.renderer.rules.paragraph_open = (tokens, i, opts, env, self) => {
    if (env.firstParagraphRendered !== true) {
      env.firstParagraphRendered = true;
      tokens[i].attrJoin('class', 'lede');
    }
    return defaultParagraph(tokens, i, opts, env, self);
  };

  return md;
}

const WORDS_PER_MINUTE = 220;

export function readChapters(chaptersDir: string): Chapter[] {
  if (!fs.existsSync(chaptersDir)) {
    throw new Error(`[book-content] Chapters directory not found: ${chaptersDir}`);
  }

  const md = createRenderer();

  const files = fs
    .readdirSync(chaptersDir)
    .filter((f) => f.toLowerCase().endsWith('.md'))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));

  const chapters = files.map((file): Chapter | null => {
    const raw = fs.readFileSync(path.join(chaptersDir, file), 'utf8').trim();
    if (!raw) return null;

    const headingMatch = raw.match(/^#\s+(.+?)\s*$/m);
    const heading = headingMatch ? headingMatch[1] : path.basename(file, '.md');
    const { label, title } = splitHeading(heading);

    // Drop the H1 from the body; the page renders it as structured markup.
    const body = headingMatch
      ? raw.slice(0, headingMatch.index).concat(raw.slice(headingMatch.index! + headingMatch[0].length))
      : raw;

    const numberMatch = file.match(/(\d+)/);
    const number = numberMatch ? numberMatch[1].padStart(2, '0') : String(files.indexOf(file) + 1).padStart(2, '0');

    const html = md.render(body.trim(), {});
    const wordCount = body.split(/\s+/).filter(Boolean).length;

    return {
      id: `chapter-${number}`,
      number,
      label: label || `Chapter ${Number(number)}`,
      title,
      html,
      wordCount,
      readingMinutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
    };
  });

  const result = chapters.filter((c): c is Chapter => c !== null);

  if (result.length === 0) {
    throw new Error(`[book-content] No non-empty .md chapters found in ${chaptersDir}`);
  }

  return result;
}

/**
 * Exposes the book as `virtual:book`, read from disk at build time so the
 * shipped site is fully static and makes no runtime requests for content.
 */
export function bookContent(chaptersDir: string): Plugin {
  return {
    name: 'book-content',

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },

    load(id) {
      if (id !== RESOLVED_ID) return;
      const chapters = readChapters(chaptersDir);
      return `export const chapters = ${JSON.stringify(chapters)};\n`;
    },

    configureServer(server) {
      server.watcher.add(chaptersDir);

      const invalidate = (file: string) => {
        if (!file.toLowerCase().endsWith('.md')) return;
        if (!path.resolve(file).startsWith(path.resolve(chaptersDir))) return;

        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };

      server.watcher.on('add', invalidate);
      server.watcher.on('change', invalidate);
      server.watcher.on('unlink', invalidate);
    },
  };
}
