import { ThumbnailGridContainer } from '../components/thumbnail-grid/ThumbnailGridContainer'

export function meta() {
  return [
    { title: 'FutuBrowser' },
    { name: 'description', content: 'Welcome to FutuBrowser!' },
  ]
}

export default function Home() {
  return <ThumbnailGridContainer />
}
