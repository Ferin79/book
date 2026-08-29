import { useEffect, useRef } from 'react';
import type { Chapter } from 'virtual:book';
import { IconClose } from './Icons';
import { Toc } from './Toc';

interface Props {
  chapters: Chapter[];
  activeId: string;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export function Drawer({ chapters, activeId, onClose, onSelect }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // Lock the root, not body — body-level overflow lets iOS drift and loses
    // the reading position when the drawer closes.
    const root = document.documentElement;
    root.dataset.locked = 'true';
    document.addEventListener('keydown', onKey);
    panelRef.current?.focus();

    return () => {
      delete root.dataset.locked;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label="Table of contents">
      <div className="drawer__scrim" onClick={onClose} aria-hidden="true" />

      <div className="drawer__panel" ref={panelRef} tabIndex={-1}>
        <div className="drawer__grip" aria-hidden="true" />
        <div className="drawer__bar">
          <p className="drawer__title">Contents</p>
          <button type="button" className="btn btn--icon" onClick={onClose} aria-label="Close contents">
            <IconClose />
          </button>
        </div>
        <Toc chapters={chapters} activeId={activeId} onSelect={onSelect} />
      </div>
    </div>
  );
}
