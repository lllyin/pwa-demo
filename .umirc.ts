import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', component: 'index' },
    { path: '/docs', component: 'docs' },
  ],
  metas: [
    {
      name: 'viewport',
      content:
        'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover',
    },
    {
      name: 'mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'application-name',
      content: 'PWA DEMO',
    },
    {
      name: 'apple-mobile-web-app-title',
      content: 'PWA DEMO',
    },
    {
      name: 'msapplication-starturl',
      content: '/',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'red',
    },
  ],
  links: [
    {
      rel: 'manifest',
      href: '/mainfest.json',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '192x192',
      href: '/favicon@192.png',
    },
    {
      rel: 'apple-touch-icon',
      type: 'image/png',
      sizes: '192x192',
      href: '/favicon@192.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '512x512',
      href: '/favicon@512.png',
    },
    {
      rel: 'apple-touch-icon',
      type: 'image/png',
      sizes: '512x512',
      href: '/favicon@512.png',
    },
  ],
  npmClient: 'yarn',
});
