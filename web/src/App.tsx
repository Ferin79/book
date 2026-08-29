import { useCallback, useMemo, useState } from 'react';
import { chapters } from 'virtual:book';
import { BOOK } from '@/config';
import { useReadingState } from '@/hooks/useReadingState';
import { scrollToChapter, scrollToChapterAfterPaint } from '@/lib/scrollToChapter';
import { ChapterView } from './components/ChapterView';
import { Drawer } from './components/Drawer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { IconArrowUp, IconList } from './components/Icons';
import { Seo } from './components/Seo';
import { Toc } from './components/Toc';
import './index.css';

export function App() {
  const ids = useMemo(() => chapters.map((c) => c.id), []);
  const { activeId, progress, pastHero } = useReadingState(ids);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const totalMinutes = useMemo(
    () => chapters.reduce((sum, c) => sum + c.readingMinutes, 0),
    [],
  );

  const activeTitle = chapters.find((c) => c.id === activeId)?.title;

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  /**
   * Single entry point for every chapter jump. When the drawer is open it is
   * dismissed first and the scroll waits for the lock to lift, so the jump
   * lands identically whether it came from the rail or the mobile drawer.
   */
  const goToChapter = useCallback(
    (id: string) => {
      if (drawerOpen) {
        setDrawerOpen(false);
        scrollToChapterAfterPaint(id);
      } else {
        scrollToChapter(id);
      }
    },
    [drawerOpen],
  );

  const toTop = useCallback(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', window.location.pathname);
  }, []);

  return (
    <>
      <Seo chapters={chapters} />

      <div className="grain" aria-hidden="true" />

      <a className="skip-link" href={`#${ids[0]}`}>
        Skip to the first chapter
      </a>

      <div className="progress" aria-hidden="true">
        <div className="progress__bar" style={{ scale: `${progress} 1` }} />
      </div>

      <Header visible={pastHero} activeTitle={activeTitle} onHome={toTop} />

      <span id="top" />

      <Hero
        chapterCount={chapters.length}
        totalMinutes={totalMinutes}
        firstChapterId={ids[0]}
        onBegin={goToChapter}
      />

      <div className="book">
        <aside className="rail">
          <Toc chapters={chapters} activeId={activeId} onSelect={goToChapter} />
        </aside>

        <main className="reader" id="reader">
          {chapters.map((chapter, i) => (
            <ChapterView
              key={chapter.id}
              chapter={chapter}
              index={i}
              prev={chapters[i - 1]}
              next={chapters[i + 1]}
              onNavigate={goToChapter}
            />
          ))}
        </main>
      </div>

      <footer className="footer">
        <p className="footer__mark" aria-hidden="true">
          ❧
        </p>
        <p>
          {BOOK.title} · {BOOK.author}
        </p>
        <p className="footer__note">
          A work in progress. {chapters.length} of the chapters are drafted so far.
        </p>
      </footer>

      {/*
        Below the rail breakpoint this is the only route into the table of
        contents, so it is always present — never gated behind scroll position.
      */}
      <button
        type="button"
        className="fab fab--contents"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open table of contents"
        aria-expanded={drawerOpen}
      >
        <IconList />
        <span>Contents</span>
      </button>

      <button
        type="button"
        className="fab fab--top"
        data-visible={pastHero ? 'true' : 'false'}
        onClick={toTop}
        aria-label="Back to top"
        tabIndex={pastHero ? 0 : -1}
      >
        <IconArrowUp />
      </button>

      {drawerOpen && (
        <Drawer
          chapters={chapters}
          activeId={activeId}
          onClose={closeDrawer}
          onSelect={goToChapter}
        />
      )}
    </>
  );
}
