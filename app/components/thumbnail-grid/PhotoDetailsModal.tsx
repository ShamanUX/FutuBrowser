import { NavArrowLeft, NavArrowRight, Xmark } from 'iconoir-react'
import { useEffect, useState } from 'react'

import type { Photo } from './photosApi'

interface PhotoDetailsModalProps {
  error: string | null
  isLoading: boolean
  onClose: () => void
  onNavigatePhoto: (photoId: number) => void
  photo: Photo | null
  selectedPhotoId: number
  totalCount: number | null
}

export function PhotoDetailsModal({
  error,
  isLoading,
  onClose,
  onNavigatePhoto,
  photo,
  selectedPhotoId,
  totalCount,
}: PhotoDetailsModalProps) {
  const [imageStatus, setImageStatus] = useState<{
    status: 'error' | 'loaded'
    url: string
  } | null>(null)

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const previousPhotoId = selectedPhotoId - 1
  const nextPhotoId = selectedPhotoId + 1
  const isPreviousDisabled =
    !photo || isLoading || selectedPhotoId <= 1 || Boolean(error)
  const isNextDisabled =
    !photo ||
    isLoading ||
    Boolean(error) ||
    (totalCount !== null && selectedPhotoId >= totalCount)
  const isImageReady =
    Boolean(photo) &&
    imageStatus?.url === photo?.url &&
    imageStatus?.status === 'loaded'
  const imageLoadFailed =
    Boolean(photo) &&
    imageStatus?.url === photo?.url &&
    imageStatus?.status === 'error'

  return (
    <div
      aria-labelledby="photo-details-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
      role="dialog"
    >
      <section className="relative max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-4 text-slate-950 shadow-2xl ring-1 ring-slate-950/10 sm:p-6 dark:bg-slate-950 dark:text-slate-50 dark:ring-white/10">
        <div className="mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Photo details
            </p>
            {photo ? (
              <h2
                className="mt-1 text-2xl font-semibold tracking-tight"
                id="photo-details-title"
              >
                {photo.title}
              </h2>
            ) : (
              <div
                aria-label="Loading photo details"
                className="mt-2 h-8 w-3/4 animate-pulse rounded-full bg-slate-200/70 backdrop-blur dark:bg-slate-800/70"
                id="photo-details-title"
                role="status"
              />
            )}
          </div>
        </div>

        {error && (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-950 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-100">
            {error}
          </p>
        )}

        {!error && (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-800">
              {photo && (
                <img
                  alt={photo.title}
                  className={`h-full w-full object-cover transition-opacity duration-200 ${
                    isImageReady ? 'opacity-100' : 'opacity-0'
                  }`}
                  key={photo.url}
                  onError={() =>
                    setImageStatus({ status: 'error', url: photo.url })
                  }
                  onLoad={() =>
                    setImageStatus({ status: 'loaded', url: photo.url })
                  }
                  src={photo.url}
                />
              )}
              {(!photo || (!isImageReady && !imageLoadFailed)) && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 animate-pulse rounded-2xl bg-slate-200/60 backdrop-blur-sm dark:bg-slate-800/60"
                  data-testid="photo-image-skeleton"
                />
              )}
              {imageLoadFailed && (
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
                  Could not load image
                </div>
              )}
            </div>

            <div>
              {photo ? (
                <dl className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 text-sm dark:divide-slate-800 dark:border-slate-800">
                  <DetailRow label="Image ID" value={String(photo.id)} />
                  <DetailRow label="Album ID" value={String(photo.albumId)} />
                  <DetailRow label="URL" value={photo.url} />
                  <DetailRow label="Thumbnail URL" value={photo.thumbnailUrl} />
                </dl>
              ) : (
                <DetailsSkeleton />
              )}
            </div>
          </div>
        )}
      </section>

      <button
        aria-label="Close photo details"
        className="fixed right-3 top-3 z-[60] inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-950 shadow-xl shadow-slate-950/20 ring-1 ring-slate-950/5 transition hover:scale-110 hover:bg-slate-100 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white sm:right-6 sm:top-6 sm:h-14 sm:w-14 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:ring-white/10 dark:hover:bg-slate-800"
        onClick={onClose}
        type="button"
      >
        <Xmark aria-hidden="true" height={30} width={30} />
      </button>

      {!error && (
        <>
          <button
            aria-label="Previous photo"
            className="fixed left-3 top-1/2 z-[60] inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-950 shadow-xl shadow-slate-950/20 ring-1 ring-slate-950/5 transition hover:-translate-x-0.5 hover:bg-slate-100 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 sm:left-6 sm:h-16 sm:w-16 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:ring-white/10 dark:hover:bg-slate-800"
            disabled={isPreviousDisabled}
            onClick={() => {
              if (!isPreviousDisabled) {
                onNavigatePhoto(previousPhotoId)
              }
            }}
            type="button"
          >
            <NavArrowLeft aria-hidden="true" height={34} width={34} />
          </button>
          <button
            aria-label="Next photo"
            className="fixed right-3 top-1/2 z-[60] inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-950 shadow-xl shadow-slate-950/20 ring-1 ring-slate-950/5 transition hover:translate-x-0.5 hover:bg-slate-100 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 sm:right-6 sm:h-16 sm:w-16 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:ring-white/10 dark:hover:bg-slate-800"
            disabled={isNextDisabled}
            onClick={() => {
              if (!isNextDisabled) {
                onNavigatePhoto(nextPhotoId)
              }
            }}
            type="button"
          >
            <NavArrowRight aria-hidden="true" height={34} width={34} />
          </button>
        </>
      )}
    </div>
  )
}

function DetailsSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white/40 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/30"
      data-testid="photo-details-skeleton"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div
          className="grid gap-2 border-b border-slate-200 p-3 last:border-b-0 sm:grid-cols-[110px_minmax(0,1fr)] dark:border-slate-800"
          key={index}
        >
          <div className="h-4 w-20 animate-pulse rounded-full bg-slate-200/60 dark:bg-slate-800/70" />
          <div className="h-4 w-full animate-pulse rounded-full bg-slate-200/60 dark:bg-slate-800/70" />
        </div>
      ))}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 p-3 sm:grid-cols-[110px_minmax(0,1fr)]">
      <dt className="font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="break-words text-slate-950 dark:text-slate-100">
        {value}
      </dd>
    </div>
  )
}
