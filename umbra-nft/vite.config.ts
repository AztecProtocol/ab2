import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import resolve from 'vite-plugin-resolve'
import react from '@vitejs/plugin-react'

const aztecVersion = '0.51.0'

export default defineConfig({
  plugins: [
    /** @type {any} */ resolve({
      '@aztec/bb.js': `export * from "https://unpkg.com/@aztec/bb.js@${aztecVersion}/dest/browser/index.js"`,
    }),
    nodePolyfills(),
    react(),
  ],
  build: {
    target: 'esnext',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
})
