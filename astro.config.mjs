import { defineConfig } from 'astro/config';
import { SITE_URL } from './src/data/config.ts';

export default defineConfig({
  // The custom domain serves the site from its root, so no `base` is needed,
  // whatever the repository is called.
  site: SITE_URL,
  output: 'static',
  build: { format: 'directory' },
});
