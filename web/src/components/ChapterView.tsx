import type { Chapter } from 'virtual:book';

interface Props {
  chapter: Chapter;
  index: number;
  prev?: Chapter;
  next?: Chapter;
  onNavigate: (id: string) => void;
}

const TINTS = 5;

export function ChapterView({ chapter, index, prev, next, onNavigate }: Props) {
  const jump = (id: string) => (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate(id);
  };

  const tint = `var(--tint-${(index % TINTS) + 1})`;

  return (
    <article
      id={chapter.id}
      className="chapter"
      style={{ '--chapter-tint': tint } as React.CSSProperties}
      aria-labelledby={`${chapter.id}-title`}
    >
      <header className="chapter__plate">
        <span className="chapter__ordinal" aria-hidden="true">
          {chapter.number}
        </span>
        <div className="chapter__head">
          <p className="chapter__label">{chapter.label}</p>
          <h2 className="chapter__title" id={`${chapter.id}-title`}>
            {chapter.title}
          </h2>
          <p className="chapter__meta">
            {chapter.readingMinutes} min read · {chapter.wordCount.toLocaleString('en')} words
          </p>
        </div>
      </header>

      {/*
        Content originates from the author's own Markdown in ../Chapters and is
        rendered to HTML at build time. Nothing user-supplied reaches this.
      */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: chapter.html }} />

      {(prev || next) && (
        <nav className="chapter-nav" aria-label={`After ${chapter.title}`}>
          {prev && (
            <a className="chapter-nav__link" href={`#${prev.id}`} onClick={jump(prev.id)}>
              <span className="chapter-nav__dir">← Previous</span>
              <span className="chapter-nav__name">{prev.title}</span>
            </a>
          )}
          {next && (
            <a
              className="chapter-nav__link chapter-nav__link--next"
              href={`#${next.id}`}
              onClick={jump(next.id)}
            >
              <span className="chapter-nav__dir">Next →</span>
              <span className="chapter-nav__name">{next.title}</span>
            </a>
          )}
        </nav>
      )}
    </article>
  );
}
