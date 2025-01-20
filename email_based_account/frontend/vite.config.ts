import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import copy from 'rollup-plugin-copy'
import type { ViteDevServer } from 'vite'
import * as fs from 'fs'
import * as path from 'path'

// WASM content type middleware
const wasmContentTypePlugin = {
  name: 'wasm-content-type-plugin',
  configureServer(server: ViteDevServer) {
    server.middlewares.use(async (req: any, res: any, next: () => void) => {
      if (req.url?.endsWith('.wasm')) {
        res.setHeader('Content-Type', 'application/wasm')
        const newPath = req.url.replace('deps', 'dist')
        
        // Try both workspace and root node_modules
        const workspacePath = path.join(process.cwd(), newPath)
        const rootPath = path.join(process.cwd(), '..', 'node_modules', '.vite', 'dist', path.basename(req.url))
        
        let wasmContent = null
        try {
          if (fs.existsSync(workspacePath)) {
            wasmContent = fs.readFileSync(workspacePath)
          } else if (fs.existsSync(rootPath)) {
            wasmContent = fs.readFileSync(rootPath)
          }
        } catch (error) {
          console.error('Failed to read WASM file:', error)
          next()
          return
        }

        if (wasmContent) {
          return res.end(wasmContent)
        }
        next()
      } else {
        next()
      }
    })
  },
}

// https://vitejs.dev/config/
export default defineConfig(({ command }: { command: string }) => {
  const baseConfig = {
    plugins: [
      react(),
      nodePolyfills({
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
        protocolImports: true,
      }),
    ],
  }

  if (command === 'serve') {
    // Ensure the dist directory exists
    const distDir = path.join(process.cwd(), 'node_modules', '.vite', 'dist')
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true })
    }

    return {
      ...baseConfig,
      build: {
        target: 'esnext',
        rollupOptions: {
          external: ['@aztec/bb.js']
        }
      },
      optimizeDeps: {
        esbuildOptions: {
          target: 'esnext'
        },
        include: ['@noir-lang/backend_barretenberg']
      },
      resolve: {
        alias: {
          'fs/promises': 'node:fs/promises',
        },
      },
      plugins: [
        ...baseConfig.plugins,
        copy({
          targets: [
            { 
              src: ['node_modules/**/*.wasm', '../node_modules/**/*.wasm'],
              dest: 'node_modules/.vite/dist',
              flatten: true
            }
          ],
          copySync: true,
          hook: 'buildStart',
        }),
        wasmContentTypePlugin,
      ],
    }
  }

  return baseConfig
})