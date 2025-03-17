import { defineConfig } from 'vite';

export default defineConfig({
  root: 'docs',

  build: {
    lib: {
      entry: '../src/pristine.js',
      name: 'pristine',
      fileName: 'pristine',
    },
    sourcemap: true,
    emptyOutDir: true,
    outDir: '../dist',
  },
});
