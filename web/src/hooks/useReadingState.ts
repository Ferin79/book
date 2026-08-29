import { useEffect, useState } from 'react';

export interface ReadingState {
  /** Chapter id currently under the reading line. */
  activeId: string;
  /** 0–1 progress through the document. */
  progress: number;
  /** True once the hero has scrolled away. */
  pastHero: boolean;
}

const INITIAL: ReadingState = { activeId: '', progress: 0, pastHero: false };

/**
 * One scroll listener drives the progress bar, the sticky header and the
 * table-of-contents highlight. rAF-throttled so it stays cheap on long pages.
 */
export function useReadingState(ids: string[]): ReadingState {
  const [state, setState] = useState<ReadingState>(INITIAL);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;

      const scrollY = window.scrollY;
      const viewport = window.innerHeight;
      const scrollable = document.documentElement.scrollHeight - viewport;

      const headerH = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
      );
      // --header-h is in rem; fall back to a sane pixel value if it can't be read.
      const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const line = (Number.isFinite(headerH) ? headerH * rootSize : 60) + 32;

      // The active chapter is the last one whose top has passed the reading line.
      let activeId = ids[0] ?? '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - line <= 0) activeId = id;
      }

      setState({
        activeId,
        progress: scrollable > 0 ? Math.min(1, Math.max(0, scrollY / scrollable)) : 0,
        pastHero: scrollY > viewport * 0.72,
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids]);

  return state;
}
