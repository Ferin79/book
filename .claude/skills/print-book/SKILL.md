---
name: print-book
description: Build the print-ready bilingual book (Gujarati first, then English, one A5 volume with the covers from book.pen) plus the two Pothi.com upload files (interior PDF and wraparound cover). Use whenever the author asks for a new/fresh/updated print-ready PDF, a physical-copy PDF, Pothi files, or "print the book", typically after chapter markdown changes.
---

# Print the book

One build makes three files. Run every step, in order, every time.

| File | For |
|---|---|
| `print/output/Treat_Your_Father_as_a_God_print.pdf` | Personal copy / local print shop. A5 with front and back covers as pages, bookmarks |
| `print/output/pothi/Treat_Your_Father_as_a_God_pothi_interior.pdf` | Pothi.com **interior** upload |
| `print/output/pothi/Treat_Your_Father_as_a_God_pothi_cover.pdf` | Pothi.com **cover** upload (back + spine + front, CMYK; the upload form accepts PDF only) |

Book order (full PDF):
front cover → (blank) → title page → imprint → contents (Gujarati + English on one page)
→ ગુજરાતી part opener → Gujarati chapters → English part opener → English chapters → back cover.
The Pothi interior is the same file without the covers and their backing blanks. Its page 1 is
the title page, and it is padded to an even page count.

## 1. Check the chapters

- Chapters come from `Chapters/fable-gu/*.md` (Gujarati) and `Chapters/fable/*.md` (English),
  paired by filename and sorted by name. A new chapter needs no config change.
- If one language has a chapter the other lacks, the build still runs and lists it under
  **Warnings**. Tell the author.

## 2. Export the Gujarati covers from book.pen (Pencil MCP)

The cover design is final. **Never edit book.pen.** Only export from it.

1. `mcp__pencil__get_app_state`. The active editor **must** be `/D:/Ferin/Code/book/book.pen`.
   The `filePath` argument is ignored: `execute` always acts on whichever file is active.
   If another file is active (for example a wedding-card file), stop and ask the author to
   open `book.pen` in Pencil. Never run `execute` against another file.
2. Confirm that the frames still exist: "Front Cover — Gujarati" (`vlKYs`) and
   "Back Cover — Gujarati" (`H6FGwB`), 600×900. If the ids changed, find them by name.
3. Export at 3× (1800×2700, about 300 dpi on A5):
   ```js
   Export(["vlKYs","H6FGwB"], "png", "D:/Ferin/Code/book/print/assets/pencil-export", { scale: 3 });
   ```
4. Move the files into place and remove the temp folder:
   ```bash
   cd print/assets && mv pencil-export/vlKYs.png cover-front.png && mv pencil-export/H6FGwB.png cover-back.png && rmdir pencil-export
   ```

If Pencil can't be reached, the existing `print/assets/cover-*.png` are reused. Say so in the report.

## 3. Build

```bash
cd print && npm install   # first time only
cd print && npm run build -- --preview 1,3,5,9,last
```

About 20 seconds. Paged.js lays the book out in the Playwright Chromium already on this machine
(it falls back to installed Chrome, then Edge). `src/pothi.mjs` then derives the two Pothi files.
`--preview` saves those full-PDF pages as PNGs in `print/output/preview/`. `last` and `last-1`
are allowed.

## 4. Verify before reporting

- Output ends with **no Warnings**. The build itself checks for:
  - an unpaired chapter, a missing cover, or an odd page count;
  - any text closer than 15.24mm (0.6in, Pothi's minimum) to a trim edge, measured on every page;
  - leftover RGB in the interior;
  - a cover width that doesn't match Pothi's formula, a cover that isn't CMYK, or cover ink above 300%.
- Look at the preview PNGs: front cover (1), title (3), contents (5) with real page numbers
  and no `?`, a chapter opener, and the back cover (last).
- Look at `print/output/pothi/cover_preview_with_guides.png` (cyan = trim, magenta = spine folds).
  The spine text must sit between the magenta lines, and no cover text may cross a cyan line.
- If the chapters changed a lot, also preview a page near a new scripture blockquote.
- Optional font check (every font must be `/Type0`, never Type 3, and never Times New Roman):
  ```bash
  PYTHONIOENCODING=utf-8 /c/Users/Ferin/AppData/Local/Python/bin/python.exe -c "from pypdf import PdfReader; r=PdfReader('print/output/pothi/Treat_Your_Father_as_a_God_pothi_interior.pdf'); print(len(r.pages), sorted({str(v.get_object()['/BaseFont']).split('+')[-1]+' '+str(v.get_object()['/Subtype']) for p in r.pages for v in ((p.get('/Resources') or {}).get('/Font') or {}).values()}))"
  ```

## 5. Report to the author

Give the three file paths (the cover is a PDF), the page counts (full and interior), the chapter → page table, the
cover size and spine width the build prints, the text revision printed on the imprint page
(it notes uncommitted changes), and any warnings. Remind the author that on Pothi's submission
form the page count must equal the interior's page count, because the spine width is computed
from it.

## Pothi specs used (A5 softcover; re-check if Pothi changes them)

Sources: https://pothi.com/print-book-interior-specification and
https://pothi.com/print-book-cover-specification (read 2026-11-17).

- Interior: page size = trim (A5), one PDF page per book page, no bleed, no crop marks, no
  covers. At least 0.6in margin around all content (heads and folios included). Grayscale or CMYK.
  Pothi adds nothing, so blank pages must be in the file.
- Cover: a single file laid out back + spine + front. The spec page lists pdf/jpg/tiff, but the upload form accepts **PDF only**. 0.2in bleed on every side.
  Spine = 0.001968in × interior pages. At least 300 DPI. Grayscale or CMYK. No crop marks. Bleed is
  background only. Pothi adds no barcode: the ISBN barcode must be in the art itself (the back
  cover has a placeholder box for it).
- All numbers live in `config.pothi` in `print/book.config.mjs`.

## Where things live

| What | File |
|---|---|
| Title, author, draft notice, chapter dirs, output names, Pothi numbers, spine text | `print/book.config.mjs` |
| Markdown → HTML (headings, `---` scene breaks, scripture blockquotes) | `print/src/markdown.mjs` |
| All typography and page geometry | `print/src/book.css` |
| Folios, running heads, contents page numbers, safe-zone measurement (runs after layout) | `print/src/postprocess.js` |
| Pothi interior (cut + grayscale) and cover (wrap + spine + CMYK) | `print/src/pothi.mjs` |
| Build orchestration | `print/src/build.mjs` |

Design decisions (keep them unless the author asks otherwise):
- Fonts: Noto Serif Gujarati (Gujarati), EB Garamond (English), Tiro Devanagari Sanskrit (shlokas).
  Use **static** @fontsource packages, not `@fontsource-variable`: Chromium embeds variable fonts
  as Type 3, which print shops reject.
- Margins: 25mm top and bottom, 21mm inner, 17mm outer. Running heads and folios sit inside
  Paged.js `@page` margin rules (`vertical-align` and padding there; CSS on its margin-box divs
  is ignored). They clear the 15.24mm safe zone by about 0.5mm, so don't push them outward.
- Interior colours are neutral greys only (R=G=B), so the grayscale rewrite is exact.
  The build warns on any non-neutral colour.
- Page numbering: folio 1 = title page. Gujarati digits in the Gujarati half and Western digits
  in the English half. Numbering is continuous so the shared contents page stays unambiguous.
- Each chapter opens on a right-hand page.
- Covers are 2:3 and the page is A5. The art is scaled to the trim width, so its extra height
  becomes real top/bottom bleed, and the outer side bleeds repeat the edge column.
  The spine has no design in book.pen. It is built from the back cover's fold-side
  background, the title in Rasa 500 and the author in Hind Vadodara 600 (the cover's own fonts),
  with the cover's red dot between them. CMYK conversion uses Windows' `RSWOP.icm` profile.
- The cover PDF holds one lossless DeviceCMYK image (no JPEG, so there's no CMYK-JPEG inversion risk),
  with TrimBox set 0.2in inside the MediaBox.
- Rich black: the SWOP profile turns the dark background into almost pure K, which prints
  charcoal grey. `config.pothi.richBlack` adds a warm C40 M50 Y50 underlay that fades in from
  K 80% to K 100% (max ink about 265%). To check what it looks like on paper, render the PDF with
  pdf.js. Don't judge from the RGB preview.
