import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://duditeria.com',
  output: 'static',
  build: {
    assets: 'assets',
  },
});
