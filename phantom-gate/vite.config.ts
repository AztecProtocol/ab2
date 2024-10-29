import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import resolve from 'vite-plugin-resolve'
import react from '@vitejs/plugin-react'

const aztecVersion = '0.60.0'

export default defineConfig({
  plugins: [
    process.env.NODE_ENV === 'production'
      ? /** @type {any} */ resolve({
          '@aztec/bb.js': `export * from "https://unpkg.com/@aztec/bb.js@${aztecVersion}/dest/browser/index.js"`,
        })
      : undefined,
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
