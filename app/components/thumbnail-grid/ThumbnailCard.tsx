import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import type { Photo } from './photosApi'

interface ThumbnailCardProps {
  photo: Photo
}

export function ThumbnailCard({ photo }: ThumbnailCardProps) {
  return (
    <Zoom
      a11yNameButtonUnzoom={`Close ${photo.title}`}
      a11yNameButtonZoom={`Zoom ${photo.title}`}
      zoomImg={{ alt: photo.title, src: photo.url }}
      zoomMargin={24}
    >
      <img
        alt={photo.title}
        className="aspect-square w-full rounded-md bg-slate-100 object-cover ring-1 ring-slate-200/70 transition duration-200 hover:brightness-105 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-slate-500 sm:rounded-lg dark:bg-slate-800 dark:ring-slate-800"
        loading="lazy"
        src={photo.thumbnailUrl}
      />
    </Zoom>
  )
}
