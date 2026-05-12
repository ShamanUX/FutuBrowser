import type { Config } from '@react-router/dev/config'

export default {
  basename: process.env.GITHUB_PAGES === 'true' ? '/FutuBrowser' : '/',
  ssr: false,
} satisfies Config
