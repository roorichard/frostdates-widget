import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FrostDatesWidget',
      fileName: 'frostdates-widget',
      formats: ['iife'],
    },
    outDir: 'dist',
    cssCodeSplit: false,
  },
});
