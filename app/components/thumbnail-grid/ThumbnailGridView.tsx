import InfiniteScroll from 'react-infinite-scroll-component'

import { ThumbnailCard } from './ThumbnailCard'
import type { Photo } from './photosApi'

interface ThumbnailGridViewProps {
  error: string | null
  hasMore: boolean
  isLoading: boolean
  isLoadingMore: boolean
  loadMoreError: string | null
  onLoadMore: () => void
  onRetry: () => void
  photos: Photo[]
}

export function ThumbnailGridView({
  error,
  hasMore,
  isLoading,
  isLoadingMore,
  loadMoreError,
  onLoadMore,
  onRetry,
  photos,
}: ThumbnailGridViewProps) {
  if (isLoading) {
    return <p>Loading thumbnails</p>
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-5xl p-4">
        <p>{error}</p>
        <button
          className="mt-3 rounded border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-slate-500 dark:border-slate-700 dark:hover:bg-slate-900"
          onClick={onRetry}
          type="button"
        >
          Retry
        </button>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-5xl p-4">
      <InfiniteScroll
        dataLength={photos.length}
        endMessage={null}
        hasMore={hasMore}
        loader={isLoadingMore ? <p>Loading more thumbnails</p> : null}
        next={onLoadMore}
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-4">
          {photos.map((photo) => (
            <ThumbnailCard key={photo.id} photo={photo} />
          ))}
        </div>
      </InfiniteScroll>
      {loadMoreError && (
        <div className="mt-4">
          <p>{loadMoreError}</p>
          <button
            className="mt-3 rounded border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-slate-500 dark:border-slate-700 dark:hover:bg-slate-900"
            onClick={onLoadMore}
            type="button"
          >
            Retry loading more
          </button>
        </div>
      )}
    </main>
  )
}
