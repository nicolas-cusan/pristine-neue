import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitepress';

const { version } = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf-8')
);

export default defineConfig({
  lang: 'en-US',
  title: 'Pristine Neue',
  description: 'A tiny vanilla JavaScript form validation library',
  // GitHub Pages serves the site at https://nicolas-cusan.github.io/pristine-neue/
  base: '/pristine-neue/',
  outDir: '../dist-docs',
  // Design specs and plans live in docs/superpowers/, they aren't pages
  srcExclude: ['superpowers/**'],
  cleanUrls: true,
  // head links don't get the base prefix automatically
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/pristine-neue/logo.svg' }],
  ],

  vite: {
    resolve: {
      alias: {
        // Examples import 'pristine-neue' like real code, but run the local source
        'pristine-neue': fileURLToPath(
          new URL('../../src/pristine.js', import.meta.url)
        ),
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/guide/getting-started', activeMatch: '/guide/' },
      { text: 'API', link: '/api' },
      {
        text: `v${version}`,
        link: 'https://github.com/nicolas-cusan/pristine-neue/releases',
      },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Built-in validators', link: '/guide/built-in-validators' },
          { text: 'Custom validators', link: '/guide/custom-validators' },
          { text: 'Error messages & languages', link: '/guide/messages' },
          { text: 'Styling', link: '/guide/styling' },
        ],
      },
      {
        text: 'Reference',
        items: [{ text: 'API', link: '/api' }],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/nicolas-cusan/pristine-neue' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/pristine-neue' },
    ],

    search: { provider: 'local' },

    editLink: {
      pattern:
        'https://github.com/nicolas-cusan/pristine-neue/edit/master/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright:
        'A fork of <a href="https://github.com/sha256/Pristine">PristineJS</a> by sha256.',
    },
  },
});
