import viteReact from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    viteReact(),
    svgr({
      include: '**/*.svg',
      svgrOptions: {
        dimensions: false,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.output/**',
      '**/e2e/**',
      '**/test-results/**',
      '**/tests-examples/**',
      '**/playwright-report/**',
    ],
  },
})
