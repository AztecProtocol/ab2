import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { Plugin, defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import resolve from 'vite-plugin-resolve';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';

const wasmContentTypePlugin: Plugin = {
  name: 'wasm-content-type-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.endsWith('.wasm')) {
        res.setHeader('Content-Type', 'application/wasm');
      }
      next();
    });
  },
};

const aztecVersion = '0.57.0';
export default defineConfig({
  envPrefix: 'VITE_',
  plugins: [
    wasm(),
    topLevelAwait(),
    TanStackRouterVite({}),
    react(),
    wasmContentTypePlugin,
    process.env.NODE_ENV === 'production'
      ? resolve({
          '@aztec/bb.js': `export * from "https://unpkg.com/@aztec/bb.js@${aztecVersion}/dest/browser/index.js"`,
        })
      : undefined,
    nodePolyfills({
      protocolImports: true,
      globals: { Buffer: false },
    }),
    // wasm(),
    // topLevelAwait(),
  ],
  server: {
    port: 3000,
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
  },
  optimizeDeps: {
    include: ['@aztec/bb.js'],
    exclude: [
      '@noir-lang/backend_barretenberg',
      '@noir-lang/noir_js',
      '@noir-lang/noirc_abi',
    ],
    esbuildOptions: {
      target: 'esnext',
      sourcemap: true,
      minify: false,
    },
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    minify: false,
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
  publicDir: 'assets/public',
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      public: path.resolve(__dirname, './assets/public'),
      'fs/promises': 'node:fs/promises',
      fs: 'node:fs',
      path: 'node:path',
      Buffer: 'buffer',
      Buffer2: 'buffer',
    },
  },
});
