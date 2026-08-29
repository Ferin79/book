/**
 * Single source of truth for everything about the book that isn't the prose.
 * Change it here and the whole site follows.
 */

export const BOOK = {
  /** PLACEHOLDER — the real title is still TBD. Swap this when it's chosen. */
  title: 'Shambu',
  titleIsPlaceholder: true,

  eyebrow: 'A true story',
  subtitle:
    'The life of a father, the family he made, and a mirror for every household still living behind a mask like his.',
  author: 'Ferin Patel',

  /** Used for canonical URL, sitemap and Open Graph tags. */
  siteUrl: 'https://example.com',

  description:
    'A non-fiction memoir about the distance between a carefully kept public image and the private conduct behind it.',
} as const;

/**
 * Master switch for search engine visibility.
 *
 * false -> robots.txt disallows everything and every page ships
 *          <meta name="robots" content="noindex, nofollow">.
 * true  -> the site becomes publicly discoverable: sitemap, canonical,
 *          JSON-LD Book schema and social cards all go live.
 *
 * All of the SEO markup is already written. This is the only line to change.
 */
export const INDEXABLE = false;
