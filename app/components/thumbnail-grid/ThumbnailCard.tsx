import { Link } from 'react-router'

import type { Photo } from './photosApi'

interface ThumbnailCardProps {
  photo: Photo
}

export function ThumbnailCard({ photo }: ThumbnailCardProps) {
  return (
    <Link
      aria-label={`View details for ${photo.title}`}
      className="block rounded-md focus:outline focus:outline-offset-2 focus:outline-slate-500 sm:rounded-lg"
      preventScrollReset
      to={`/p/${photo.id}/`}
    >
      <img
        alt={photo.title}
        className="aspect-square w-full rounded-md bg-slate-100 object-cover ring-1 ring-slate-200/70 transition duration-200 hover:brightness-105 sm:rounded-lg dark:bg-slate-800 dark:ring-slate-800"
        loading="lazy"
        src={photo.thumbnailUrl}
      />
    </Link>
  )
}
