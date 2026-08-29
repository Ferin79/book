import type { Chapter } from 'virtual:book';

interface Props {
  chapters: Chapter[];
  activeId: string;
  /** Receives the chapter id; the caller decides when to scroll. */
  onSelect: (id: string) => void;
}

export function Toc({ chapters, activeId, onSelect }: Props) {
  return (
    <nav aria-label="Table of contents">
      <p className="toc__head">Contents</p>
      <ul className="toc__list">
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            {/*
              Kept as a real anchor so it is focusable, shareable and works
              without JS — but the jump itself is handled in code so it can't
              race the drawer closing.
            */}
            <a
              className="toc__link"
              href={`#${chapter.id}`}
              aria-current={activeId === chapter.id ? 'true' : undefined}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                onSelect(chapter.id);
              }}
            >
              <span className="toc__num">{chapter.number}</span>
              <span className="toc__name">{chapter.title}</span>
              <span className="toc__time">{chapter.readingMinutes} min</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
