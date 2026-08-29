import { useCallback } from 'react';

export const THEME_KEY = 'book-theme';

/**
 * Toggles the `data-theme` attribute set pre-paint by the inline script in
 * index.html. Nothing is rendered from state, so there is no hydration
 * mismatch — which icon shows is decided in CSS.
 */
export function useThemeToggle() {
  return useCallback(() => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private browsing or blocked storage — the toggle still works for this visit.
    }
  }, []);
}
