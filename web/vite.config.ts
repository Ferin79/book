import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { bookContent } from './plugins/book-content';

const chaptersDir = fileURLToPath(new URL('../Chapters', import.meta.url));

export default defineConfig({
  plugins: [react(), bookContent(chaptersDir)],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // The book lives outside web/, so Vite needs permission to watch it.
    fs: { allow: ['..'] },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: 2048,
  },
  ssr: {
    noExternal: ['@fontsource-variable/fraunces', '@fontsource-variable/newsreader', '@fontsource-variable/inter'],
  },
});
