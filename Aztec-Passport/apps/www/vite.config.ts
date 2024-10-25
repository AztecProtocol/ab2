import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import resolve from 'vite-plugin-resolve';

const aztecVersion = '0.57.0';
export default defineConfig({
  envPrefix: 'VITE_',
  plugins: [
    TanStackRouterVite({}),
    react(),
    process.env.NODE_ENV === 'production'
      ? resolve({
          '@aztec/bb.js': `export * from "https://unpkg.com/@aztec/bb.js@${aztecVersion}/dest/browser/index.js"`,
        })
      : undefined,
  ],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: ['@aztec/bb.js'],
    esbuildOptions: {
      target: 'esnext',
      sourcemap: true,
      minify: false,
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      public: path.resolve(__dirname, './assets/public'),
      'fs/promises': 'node:fs/promises',
      fs: 'node:fs',
      path: 'node:path',
      Buffer: 'buffer',
    },
  },
});
