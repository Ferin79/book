import { rm } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';

/**
 * vite-react-ssg needs Vite's manifests during the prerender step, but they are
 * internal build metadata — they map every source module to its output chunk.
 * Nothing at runtime reads them, so keep them out of the deployed bundle.
 */
const viteMeta = fileURLToPath(new URL('../dist/.vite', import.meta.url));

await rm(viteMeta, { recursive: true, force: true });

console.log('[postbuild] removed dist/.vite build metadata');
