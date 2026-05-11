import type { Photo } from './photosApi'

interface ThumbnailCardProps {
  photo: Photo
}

export function ThumbnailCard({ photo }: ThumbnailCardProps) {
  return (
    <img
      alt={photo.title}
      className="aspect-square w-full rounded bg-slate-100 object-cover dark:bg-slate-800"
      loading="lazy"
      src={photo.thumbnailUrl}
    />
  )
}
