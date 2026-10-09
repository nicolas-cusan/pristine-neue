import { defineConfig } from 'vite';

export default defineConfig({
  root: 'docs',
  // Relative asset URLs, so the page also works under the GitHub Pages project path
  base: './',

  build: {
    emptyOutDir: true,
    outDir: '../dist-docs',
  },
});
