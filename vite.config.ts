import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

const githubPagesBase =
  process.env.GITHUB_PAGES === 'true' ? '/FutuBrowser/' : '/'

export default defineConfig(({ mode }) => ({
  base: githubPagesBase,
  plugins: [tailwindcss(), ...(mode === 'test' ? [] : [reactRouter()])],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./app/setupTests.ts'],
  },
}))
