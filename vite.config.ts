import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
  plugins: [tailwindcss(), ...(mode === 'test' ? [] : [reactRouter()])],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./app/setupTests.ts'],
  },
}))
