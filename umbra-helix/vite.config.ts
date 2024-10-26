import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import resolve from 'vite-plugin-resolve'
import react from '@vitejs/plugin-react'
import basicssl from '@vitejs/plugin-basic-ssl'
const aztecVersion = '0.60.0'

const IS_HTTPS = true

const plugins = [
  /** @type {any} */ resolve({
    '@aztec/bb.js': `export * from "https://unpkg.com/@aztec/bb.js@${aztecVersion}/dest/browser/index.js"`,
  }),
  nodePolyfills(),
  react(),
]
if (IS_HTTPS) {
  plugins.push(basicssl())
}

export default defineConfig({
  plugins,
  build: {
    target: 'esnext',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
})
