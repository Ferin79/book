import { Head } from 'vite-react-ssg/single-page';
import type { Chapter } from 'virtual:book';
import { BOOK, INDEXABLE } from '@/config';

interface Props {
  chapters: Chapter[];
}

export function Seo({ chapters }: Props) {
  const pageTitle = `${BOOK.title} — ${BOOK.eyebrow}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: BOOK.title,
    author: { '@type': 'Person', name: BOOK.author },
    description: BOOK.description,
    genre: ['Memoir', 'Biography', 'Nonfiction'],
    inLanguage: 'en',
    url: BOOK.siteUrl,
    numberOfPages: chapters.length,
    hasPart: chapters.map((c) => ({
      '@type': 'Chapter',
      name: c.title,
      position: Number(c.number),
      url: `${BOOK.siteUrl}/#${c.id}`,
    })),
  };

  return (
    <Head>
      <html lang="en" />
      <title>{pageTitle}</title>
      <meta name="description" content={BOOK.description} />
      <meta name="author" content={BOOK.author} />
      <meta name="theme-color" content="#fbf8f3" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#171410" media="(prefers-color-scheme: dark)" />

      {INDEXABLE ? (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      ) : (
        <meta name="robots" content="noindex, nofollow" />
      )}

      {INDEXABLE && <link rel="canonical" href={BOOK.siteUrl} />}

      {/* Open Graph */}
      <meta property="og:type" content="book" />
      <meta property="og:site_name" content={BOOK.title} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={BOOK.description} />
      <meta property="og:locale" content="en" />
      {INDEXABLE && <meta property="og:url" content={BOOK.siteUrl} />}
      <meta property="book:author" content={BOOK.author} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={BOOK.description} />

      {INDEXABLE && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Head>
  );
}
