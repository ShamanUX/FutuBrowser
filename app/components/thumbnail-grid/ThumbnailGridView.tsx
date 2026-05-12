import InfiniteScroll from 'react-infinite-scroll-component'

import { PhotoDetailsModal } from './PhotoDetailsModal'
import { ThumbnailCard } from './ThumbnailCard'
import type { Photo } from './photosApi'

interface ThumbnailGridViewProps {
  error: string | null
  hasMore: boolean
  isLoading: boolean
  isLoadingMore: boolean
  loadMoreError: string | null
  onLoadMore: () => void
  onModalClose: () => void
  onModalNavigatePhoto: (photoId: number) => void
  onRetry: () => void
  selectedPhoto: Photo | null
  selectedPhotoError: string | null
  selectedPhotoId: number | null
  selectedPhotoIsLoading: boolean
  photos: Photo[]
  totalCount: number | null
}

export function ThumbnailGridView({
  error,
  hasMore,
  isLoading,
  isLoadingMore,
  loadMoreError,
  onLoadMore,
  onModalClose,
  onModalNavigatePhoto,
  onRetry,
  photos,
  selectedPhoto,
  selectedPhotoError,
  selectedPhotoId,
  selectedPhotoIsLoading,
  totalCount,
}: ThumbnailGridViewProps) {
  const modal = selectedPhotoId ? (
    <PhotoDetailsModal
      error={selectedPhotoError}
      isLoading={selectedPhotoIsLoading}
      onClose={onModalClose}
      onNavigatePhoto={onModalNavigatePhoto}
      photo={selectedPhoto}
      selectedPhotoId={selectedPhotoId}
      totalCount={totalCount}
    />
  ) : null

  if (isLoading) {
    return (
      <>
        <section aria-label="Thumbnail grid">
          <p className="sr-only">Loading thumbnails</p>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 md:gap-3">
            {Array.from({ length: 12 }, (_, index) => (
              <div
                aria-hidden="true"
                className="aspect-square animate-pulse rounded-2xl bg-slate-200/80 shadow-sm dark:bg-slate-800"
                key={index}
              />
            ))}
          </div>
        </section>
        {modal}
      </>
    )
  }

  if (error) {
    return (
      <>
        <section aria-label="Thumbnail grid">
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-950 shadow-sm dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-100">
            <p className="font-medium">{error}</p>
            <p className="mt-1 text-sm text-rose-800 dark:text-rose-200">
              Check your connection and try again.
            </p>
          </section>
          <button
            className="mt-4 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-100 focus:outline focus:outline-offset-2 focus:outline-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-900"
            onClick={onRetry}
            type="button"
          >
            Retry
          </button>
        </section>
        {modal}
      </>
    )
  }

  return (
    <>
      <section aria-label="Thumbnail grid">
        <InfiniteScroll
          dataLength={photos.length}
          endMessage={null}
          hasMore={hasMore}
          loader={isLoadingMore ? <BottomLoader /> : null}
          next={onLoadMore}
        >
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 md:gap-3">
            {photos.map((photo) => (
              <ThumbnailCard key={photo.id} photo={photo} />
            ))}
          </div>
        </InfiniteScroll>
        {loadMoreError && (
          <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-100">
            <p className="text-sm font-medium">{loadMoreError}</p>
            <button
              className="mt-3 rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-950 shadow-sm transition hover:bg-amber-100 focus:outline focus:outline-offset-2 focus:outline-amber-500 dark:border-amber-800 dark:bg-slate-950 dark:text-amber-100 dark:hover:bg-amber-950/50"
              onClick={onLoadMore}
              type="button"
            >
              Retry loading more
            </button>
          </section>
        )}
      </section>
      {modal}
    </>
  )
}

function BottomLoader() {
  return (
    <div className="flex justify-center py-6">
      <p className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
        Loading more thumbnails
      </p>
    </div>
  )
}
