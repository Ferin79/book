// Pothi.com upload files, derived from the full book build.
//
// Interior (https://pothi.com/print-book-interior-specification):
//   one PDF page per book page, trim size, no bleed, no crop marks, no covers,
//   >= 0.6in margin around all content, Grayscale or CMYK colour.
// Cover (https://pothi.com/print-book-cover-specification):
//   one file: back + spine + front, 0.2in bleed on every side,
//   spine = 0.001968in x interior page count, >= 300 DPI, Grayscale or CMYK.
//   (The spec page also lists jpg/tiff, but the upload form accepts only PDF.)

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import sharp from 'sharp';
import {
  PDFDocument, PDFName, PDFRawStream, PDFDict, decodePDFRawStream,
  pushGraphicsState, popGraphicsState, concatTransformationMatrix, drawObject,
} from 'pdf-lib';

// ---------- Interior ---------------------------------------------------------

const NUM = String.raw`(-?\d*\.?\d+)`;
const RGB_OP = new RegExp(String.raw`(^|\s)${NUM}\s+${NUM}\s+${NUM}\s+(rg|RG)(?=\s|$)`, 'g');
const OTHER_COLOUR_OP = /(^|\s)(sc|SC|scn|SCN|cs|CS|k|K|rg|RG)(?=\s|$)/;

/** Rewrite DeviceRGB colour operators in a content stream to DeviceGray. */
function toGray(text, issues) {
  return text.replace(RGB_OP, (_, pre, r, g, b, op) => {
    const [R, G, B] = [r, g, b].map(Number);
    if (Math.abs(R - G) > 0.004 || Math.abs(G - B) > 0.004) issues.add(`non-neutral colour ${r} ${g} ${b}`);
    const y = Math.round((0.299 * R + 0.587 * G + 0.114 * B) * 10000) / 10000;
    return `${pre}${y} ${op === 'rg' ? 'g' : 'G'}`;
  });
}

function rewriteStream(ctx, ref, issues) {
  const obj = ctx.lookup(ref);
  if (!(obj instanceof PDFRawStream)) return;
  const text = Buffer.from(decodePDFRawStream(obj).decode()).toString('latin1');
  const gray = toGray(text, issues);
  if (OTHER_COLOUR_OP.test(gray)) issues.add('a content stream still has a non-gray colour operator');
  const dict = obj.dict.clone(ctx);
  dict.delete(PDFName.of('DecodeParms'));
  dict.set(PDFName.of('Filter'), PDFName.of('FlateDecode'));
  ctx.assign(ref, PDFRawStream.of(dict, zlib.deflateSync(Buffer.from(gray, 'latin1'))));
}

/**
 * Cut the interior out of the full book (drop covers and the blanks that only
 * exist to back them), pad to an even page count, and convert to grayscale.
 * @returns {{ pages: number, issues: string[] }}
 */
export async function makeInterior({ fullPdf, stats, out, title, author }) {
  const src = await PDFDocument.load(fs.readFileSync(fullPdf));
  const blank = new Set(stats.blankPages);
  const [front, back] = [Math.min(...stats.coverPages), Math.max(...stats.coverPages)];

  let first = front + 1;
  while (blank.has(first)) first++;
  let last = back - 1;
  while (blank.has(last)) last--;

  const doc = await PDFDocument.create();
  const idx = Array.from({ length: last - first + 1 }, (_, i) => first - 1 + i);
  for (const p of await doc.copyPages(src, idx)) doc.addPage(p);
  if (doc.getPageCount() % 2) {
    const { width, height } = doc.getPage(0).getSize();
    doc.addPage([width, height]); // book ends on a left-hand page
  }

  const ctx = doc.context;
  const issues = new Set();
  for (const page of doc.getPages()) {
    page.node.delete(PDFName.of('Group')); // Chromium tags pages with an RGB transparency group
    const contents = page.node.get(PDFName.of('Contents'));
    const refs = contents ? (contents.asArray ? contents.asArray() : [contents]) : [];
    for (const ref of refs) rewriteStream(ctx, ref, issues);
  }
  for (const [ref, obj] of ctx.enumerateIndirectObjects()) {
    if (!(obj instanceof PDFRawStream)) continue;
    const subtype = obj.dict.get(PDFName.of('Subtype'));
    if (subtype === PDFName.of('Image')) issues.add('interior contains an image (check that it is grayscale)');
    if (subtype !== PDFName.of('Form')) continue;
    const group = obj.dict.get(PDFName.of('Group'));
    if (group instanceof PDFDict) group.set(PDFName.of('CS'), PDFName.of('DeviceGray'));
    rewriteStream(ctx, ref, issues);
  }

  doc.setTitle(`${title} (interior)`);
  doc.setAuthor(author);
  doc.setProducer('book-print');
  fs.writeFileSync(out, await doc.save({ useObjectStreams: false })); // plain dicts, so the colour-space check below can read them

  const bytes = fs.readFileSync(out).toString('latin1');
  if (/DeviceRGB|DeviceCMYK|ICCBased/.test(bytes.replace(/stream[\s\S]*?endstream/g, ''))) {
    issues.add('an RGB/ICC colour space name is still present');
  }
  return { pages: doc.getPageCount(), issues: [...issues] };
}

// ---------- Cover ------------------------------------------------------------

/**
 * Build the wraparound cover: [bleed][back][spine][front][bleed], bleed on top and bottom too.
 * The front and back art (2:3) is scaled to the trim width; the extra height
 * above and below the trim becomes real top/bottom bleed, and the outer side
 * bleeds repeat the edge column (plain background / horizontal stripes).
 */
export async function makeCover({ frontPng, backPng, interiorPages, spec, renderSpine, outPdf, outPreview, title, author }) {
  const { dpi, bleedIn, spinePerPageIn, trimIn, cmykProfile } = spec;
  const px = (inches) => Math.round(inches * dpi);
  const W = px(trimIn.w);
  const H = px(trimIn.h);
  const B = px(bleedIn);
  const spineIn = spinePerPageIn * interiorPages;
  const S = px(spineIn);
  const fullH = H + 2 * B;

  async function panel(file, side) {
    const resized = await sharp(file).resize({ width: W }).png().toBuffer();
    const { height } = await sharp(resized).metadata();
    if (height < fullH) throw new Error(`${path.basename(file)}: art too short for top/bottom bleed`);
    const cropped = await sharp(resized)
      .extract({ left: 0, top: Math.floor((height - fullH) / 2), width: W, height: fullH })
      .png()
      .toBuffer();
    return sharp(cropped)
      .extend({ [side]: B, extendWith: 'copy' })
      .png()
      .toBuffer();
  }

  const backPanel = await panel(backPng, 'left'); // outer edge of the back is its left side
  const frontPanel = await panel(frontPng, 'right'); // outer edge of the front is its right side

  // Spine background: the back cover's fold-side column, stretched across.
  const spineBg = await sharp(backPanel)
    .extract({ left: W + B - 1, top: 0, width: 1, height: fullH })
    .resize({ width: S, height: fullH, fit: 'fill', kernel: 'nearest' })
    .png()
    .toBuffer();
  const layers = [
    { input: backPanel, left: 0, top: 0 },
    { input: spineBg, left: W + B, top: 0 },
    { input: frontPanel, left: W + B + S, top: 0 },
  ];
  const spineTextIn = 0.25;
  if (spineIn >= spineTextIn) {
    // Rendered across the trim height, then turned to read top-to-bottom.
    const strip = await renderSpine({ width: H, height: S });
    layers.push({ input: await sharp(strip).rotate(90).png().toBuffer(), left: W + B, top: B });
  }

  const totalW = 2 * W + S + 2 * B;
  const rgb = await sharp({ create: { width: totalW, height: fullH, channels: 3, background: '#14100D' } })
    .composite(layers)
    .png()
    .toBuffer();

  // RGB -> CMYK through the ICC profile (done via an in-memory TIFF so the
  // transform is applied), then read back as raw CMYK: pipelineColourspace
  // stops sharp from converting it back to sRGB on read. 255 = full ink.
  const cmykTiff = await sharp(rgb).removeAlpha().withIccProfile(cmykProfile).tiff({ compression: 'lzw' }).toBuffer();
  const { data, info } = await sharp(cmykTiff)
    .pipelineColourspace('cmyk')
    .toColourspace('cmyk')
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (info.channels !== 4) throw new Error(`cover: expected 4 CMYK channels, got ${info.channels}`);

  // Rich black. The SWOP profile renders the near-black background as almost
  // pure K (about C7 M9 Y6 K98), which prints flat and charcoal grey. Under the
  // darkest pixels, add a warm CMY underlay that fades in from K = fromK to
  // K = 100%. Light colours (cream text, stripes, red dot) have low K and stay
  // untouched.
  const rb = spec.richBlack;
  if (rb) {
    const lo = (rb.fromK / 100) * 255;
    const [uc, um, uy] = [rb.c, rb.m, rb.y].map((v) => (v / 100) * 255);
    for (let i = 0; i < data.length; i += 4) {
      const k = data[i + 3];
      if (k <= lo) continue;
      const w = Math.min(1, (k - lo) / (255 - lo));
      data[i] = Math.max(data[i], Math.round(uc * w));
      data[i + 1] = Math.max(data[i + 1], Math.round(um * w));
      data[i + 2] = Math.max(data[i + 2], Math.round(uy * w));
    }
  }
  let maxInk = 0;
  for (let i = 0; i < data.length; i += 4) maxInk = Math.max(maxInk, data[i] + data[i + 1] + data[i + 2] + data[i + 3]);

  // One-page PDF at the exact wrap size, holding the CMYK image as a
  // lossless DeviceCMYK image (no JPEG, so no CMYK-JPEG inversion ambiguity).
  const doc = await PDFDocument.create();
  const pt = (pxs) => (pxs / dpi) * 72;
  const [wPt, hPt] = [pt(totalW), pt(fullH)];
  const page = doc.addPage([wPt, hPt]);
  const image = PDFRawStream.of(
    doc.context.obj({
      Type: 'XObject', Subtype: 'Image', Width: info.width, Height: info.height,
      ColorSpace: 'DeviceCMYK', BitsPerComponent: 8, Filter: 'FlateDecode',
    }),
    zlib.deflateSync(data, { level: 9 }),
  );
  const name = page.node.newXObject('Im', doc.context.register(image));
  page.pushOperators(pushGraphicsState(), concatTransformationMatrix(wPt, 0, 0, hPt, 0, 0), drawObject(name), popGraphicsState());
  page.setBleedBox(0, 0, wPt, hPt);
  page.setTrimBox(pt(B), pt(B), wPt - 2 * pt(B), hPt - 2 * pt(B));
  doc.setTitle(`${title} (cover)`);
  doc.setAuthor(author);
  doc.setProducer('book-print');
  fs.writeFileSync(outPdf, await doc.save({ useObjectStreams: false }));

  // Preview with trim (cyan) and fold (magenta) guides, for eyeballing only.
  const guide = (x, y, w, h, c) => ({
    input: { create: { width: w, height: h, channels: 4, background: c } }, left: x, top: y,
  });
  const cyan = '#00c8ffff';
  const mag = '#ff00c8ff';
  await sharp(rgb)
    .composite([
      guide(B, 0, 2, fullH, cyan), guide(totalW - B - 2, 0, 2, fullH, cyan),
      guide(0, B, totalW, 2, cyan), guide(0, fullH - B - 2, totalW, 2, cyan),
      guide(W + B, 0, 2, fullH, mag), guide(W + B + S - 2, 0, 2, fullH, mag),
    ])
    .png()
    .toBuffer()
    .then((buf) => sharp(buf).resize({ width: 1800 }).png().toFile(outPreview)); // sharp resizes before compositing, so two steps

  return {
    widthIn: totalW / dpi,
    heightIn: fullH / dpi,
    expectedWidthIn: 2 * trimIn.w + spineIn + 2 * bleedIn,
    spineIn,
    spineMm: spineIn * 25.4,
    space: 'cmyk',
    density: dpi,
    pixels: `${info.width}x${info.height}`,
    spineText: spineIn >= spineTextIn,
    maxInkPct: Math.round((maxInk / 255) * 100),
  };
}
