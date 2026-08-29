import { BOOK } from '@/config';
import { useThemeToggle } from '@/hooks/useTheme';
import { IconTheme } from './Icons';

interface Props {
  visible: boolean;
  activeTitle?: string;
  onHome: () => void;
}

export function Header({ visible, activeTitle, onHome }: Props) {
  const toggleTheme = useThemeToggle();

  return (
    <div className="header" data-visible={visible ? 'true' : 'false'}>
      <button type="button" className="header__brand" onClick={onHome} tabIndex={visible ? 0 : -1}>
        {BOOK.title}
      </button>

      {activeTitle && <span className="header__now">{activeTitle}</span>}

      <div className="header__actions">
        <button
          type="button"
          className="btn btn--icon"
          onClick={toggleTheme}
          tabIndex={visible ? 0 : -1}
          aria-label="Toggle light and dark reading mode"
        >
          <IconTheme />
        </button>
      </div>
    </div>
  );
}
