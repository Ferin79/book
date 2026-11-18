/**
 * Everything about the printed book that is not the chapter prose.
 * Change it here and the next `npm run build` follows.
 */
export default {
  /** A5 trim, no bleed. Covers are full-page images scaled to fill the trim. */
  page: { width: '148mm', height: '210mm' },

  title: {
    en: 'Treat Your Father as a God',
    gu: 'પિતૃદેવો ભવ', // matches the Gujarati cover in book.pen
  },
  author: { en: 'Ferin Patel', gu: 'ફેરિન પટેલ' },
  tagline: { en: 'A true story', gu: 'એક સત્ય કથા' },

  /** Printed on the copyright/imprint page so every copy says which draft it is. */
  draftNotice: {
    en: 'Private reading copy. Draft, not for distribution.',
    gu: 'ખાનગી વાચન પ્રત. કાચો મુસદ્દો, વિતરણ માટે નહીં.',
  },

  /**
   * Book order: Gujarati first, English second.
   * Chapter files are paired by filename, sorted by name.
   */
  languages: [
    { code: 'gu', dir: '../Chapters/fable-gu', partName: 'ગુજરાતી', contentsTitle: 'અનુક્રમણિકા' },
    { code: 'en', dir: '../Chapters/fable', partName: 'English', contentsTitle: 'Contents' },
  ],

  /**
   * Exported from book.pen with the Pencil MCP (see .claude/skills/print-book/SKILL.md).
   * Frames "Front Cover — Gujarati" (vlKYs) and "Back Cover — Gujarati" (H6FGwB),
   * 600x900 (2:3) exported at 3x. On A5 they are centre-cropped: about 6mm of
   * background comes off the top and bottom, and no artwork sits that close to an edge.
   */
  covers: { front: 'assets/cover-front.png', back: 'assets/cover-back.png' },

  output: 'output/Treat_Your_Father_as_a_God_print.pdf',

  /**
   * Pothi.com upload files (A5 softcover). Numbers from
   * https://pothi.com/print-book-cover-specification and
   * https://pothi.com/print-book-interior-specification (checked 2026-11-17).
   */
  pothi: {
    interior: 'output/pothi/Treat_Your_Father_as_a_God_pothi_interior.pdf',
    cover: 'output/pothi/Treat_Your_Father_as_a_God_pothi_cover.pdf', // upload form accepts PDF only
    coverPreview: 'output/pothi/cover_preview_with_guides.png',
    dpi: 300,
    trimIn: { w: 5.83, h: 8.27 },
    bleedIn: 0.2,
    spinePerPageIn: 0.001968, // softcover
    cmykProfile: 'C:/Windows/System32/spool/drivers/color/RSWOP.icm', // ships with Windows
    // Warm rich-black underlay (percent ink) for the dark cover background; see pothi.mjs.
    richBlack: { c: 40, m: 50, y: 50, fromK: 80 },
    maxInkPct: 300, // total area coverage limit; the build warns above it
    spine: { title: 'પિતૃદેવો ભવ', author: 'ફેરિન પટેલ', ink: '#EDE5D8', accent: '#D9412F' },
  },
};
