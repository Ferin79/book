# Book website

A single-page, fully static reading site for the book. Chapter Markdown is read
from `../Chapters` **at build time** and prerendered into HTML — the deployed
site makes no API calls and fetches no content at runtime.

## Commands

```bash
npm run dev        # dev server, hot-reloads when ../Chapters/*.md changes
npm run build      # prerender to dist/
npm run preview    # serve dist/ locally
npm run typecheck  # tsc --noEmit
npm run deploy     # build + wrangler deploy
```

## How content flows

```
../Chapters/*.md
   -> plugins/book-content.ts   (markdown-it, build time)
   -> virtual:book              (virtual module: chapters[])
   -> src/App.tsx               (prerendered by vite-react-ssg)
   -> dist/index.html           (full book in the HTML)
```

Chapters are picked up automatically. Ordering comes from the numeric part of the
filename, and each file's `# Chapter Two: A Glass of Water` heading is split into
the label (`Chapter Two`) and the title (`A Glass of Water`). Add a new
`Chapter_04_*.md` and it appears with no code change.

Markdown conventions the site understands:

| Source | Renders as |
| --- | --- |
| `# Chapter N: Title` | The chapter opener (label + title) |
| `---` | An ornamental scene break, not a rule |
| `> …` | A verse / scripture block (Devanagari font stack applied) |
| `*text*` | True italics (self-hosted italic font, not synthesised) |

The first paragraph of every chapter automatically gets a drop cap.

## Publishing

Pushing to `main` deploys the site automatically via Cloudflare Workers Builds —
no GitHub Actions, no local step:

```bash
git add Chapters/ && git commit -m "Add Chapter 4" && git push
```

**The site is built from the GitHub repo, not your working copy.** A chapter that
is only saved locally will not appear online until it is committed and pushed.

Build settings (Worker → Settings → Build):

| Setting | Value |
| --- | --- |
| Root directory | `web` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Production branch | `main` |

The Worker name in the dashboard must stay `book-web`, matching `name` in
`wrangler.jsonc`, or the build fails.

Note that the build reads `../Chapters`, i.e. *outside* the `web` root directory.
That works because Workers Builds clones the whole repository and only runs the
build command from the root directory. If `Chapters/` is ever missing, the build
fails loudly with `[book-content] Chapters directory not found` rather than
publishing an empty book.

`.node-version` pins Node 22 for the build image; Vite 7 requires Node >= 20.19.

To deploy by hand instead (bypasses git entirely): `npm run deploy`.

## Going public

Search indexing is **off**. All the SEO markup is already written and tested —
turning it on is two edits:

1. `src/config.ts` — set `INDEXABLE = true`, and set `siteUrl` to the real domain.
2. `public/robots.txt` — replace `Disallow: /` with `Allow: /`.

That switches on `index, follow`, the canonical link, `og:url`, and the JSON-LD
`Book` schema (including a `hasPart` entry per chapter). While it is `false`,
every page ships `noindex, nofollow` instead.

Also update `BOOK.title` in `src/config.ts` when the real title is chosen, and set
`titleIsPlaceholder: false` to drop the "Working title" badge from the hero.

## Notes

- Fonts (Fraunces, Newsreader, Inter) are self-hosted via Fontsource and bundled,
  so there are no external requests to a font CDN.
- Light/dark is resolved by a pre-paint inline script in `index.html`; React never
  renders the theme, so there is no flash and no hydration mismatch.
- Deploys to Cloudflare Workers static assets via `wrangler.jsonc`.
