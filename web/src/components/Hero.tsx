import { BOOK } from '@/config';
import { IconArrowDown } from './Icons';

interface Props {
  chapterCount: number;
  totalMinutes: number;
  firstChapterId: string;
  onBegin: (id: string) => void;
}

export function Hero({ chapterCount, totalMinutes, firstChapterId, onBegin }: Props) {
  return (
    <header className="hero">
      <div className="hero__wash" aria-hidden="true" />

      <div className="hero__inner">
        <p className="hero__eyebrow">{BOOK.eyebrow}</p>

        <h1 className="hero__title">
          {BOOK.title}
          {BOOK.titleIsPlaceholder && (
            <>
              <br />
              <span className="hero__flag">Working title</span>
            </>
          )}
        </h1>

        <div className="hero__rule" aria-hidden="true" />

        <p className="hero__sub">{BOOK.subtitle}</p>
        <p className="hero__author">{BOOK.author}</p>

        <div className="hero__cta">
          <a
            className="hero__begin"
            href={`#${firstChapterId}`}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
              e.preventDefault();
              onBegin(firstChapterId);
            }}
          >
            Begin reading
          </a>
          <p className="hero__stats">
            {chapterCount} {chapterCount === 1 ? 'chapter' : 'chapters'} · about {totalMinutes} minutes
          </p>
        </div>
      </div>

      <div className="hero__cue" aria-hidden="true">
        <IconArrowDown />
      </div>
    </header>
  );
}
