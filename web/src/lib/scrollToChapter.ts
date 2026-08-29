/**
 * Jumps to a chapter under our own control rather than leaving it to the
 * browser's default `#hash` behaviour.
 *
 * Relying on the default meant the drawer's scroll lock could still be in
 * place when the browser performed the jump, which dropped the scroll or
 * landed it at the wrong offset. Doing it explicitly — after the lock is
 * released — makes the result the same on every device.
 *
 * The header offset comes from `scroll-margin-top` on `.chapter`, which
 * `scrollIntoView` honours.
 */
export function scrollToChapter(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  el.scrollIntoView({
    behavior: reduceMotion ? 'auto' : 'smooth',
    block: 'start',
  });

  // Keep the URL shareable without triggering a second, competing jump.
  history.replaceState(null, '', `#${id}`);
}

/** Waits for the DOM to settle (drawer unmount, scroll unlock) before jumping. */
export function scrollToChapterAfterPaint(id: string): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => scrollToChapter(id));
  });
}
