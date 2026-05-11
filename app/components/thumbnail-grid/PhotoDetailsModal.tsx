import { NavArrowLeft, NavArrowRight, Xmark } from 'iconoir-react'
import { useEffect } from 'react'

import type { Photo } from './photosApi'

interface PhotoDetailsModalProps {
  error: string | null
  isLoading: boolean
  onClose: () => void
  onNavigatePhoto: (photoId: number) => void
  photo: Photo | null
  totalCount: number | null
}

export function PhotoDetailsModal({
  error,
  isLoading,
  onClose,
  onNavigatePhoto,
  photo,
  totalCount,
}: PhotoDetailsModalProps) {
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const previousPhotoId = photo ? photo.id - 1 : null
  const nextPhotoId = photo ? photo.id + 1 : null
  const isPreviousDisabled = !photo || photo.id <= 1
  const isNextDisabled =
    !photo || (totalCount !== null && photo.id >= totalCount)

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
            <h2
              className="mt-1 text-2xl font-semibold tracking-tight"
              id="photo-details-title"
            >
              {photo?.title ?? 'Loading photo'}
            </h2>
          </div>
        </div>

        {isLoading && (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            Loading photo details
          </p>
        )}

        {error && (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-950 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-100">
            {error}
          </p>
        )}

        {photo && !error && (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
            <img
              alt={photo.title}
              className="aspect-square w-full rounded-2xl bg-slate-100 object-cover ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-800"
              src={photo.url}
            />

            <div>
              <dl className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 text-sm dark:divide-slate-800 dark:border-slate-800">
                <DetailRow label="Image ID" value={String(photo.id)} />
                <DetailRow label="Album ID" value={String(photo.albumId)} />
                <DetailRow label="URL" value={photo.url} />
                <DetailRow label="Thumbnail URL" value={photo.thumbnailUrl} />
              </dl>
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

      {photo && !error && (
        <>
          <button
            aria-label="Previous photo"
            className="fixed left-3 top-1/2 z-[60] inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-950 shadow-xl shadow-slate-950/20 ring-1 ring-slate-950/5 transition hover:-translate-x-0.5 hover:bg-slate-100 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 sm:left-6 sm:h-16 sm:w-16 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:ring-white/10 dark:hover:bg-slate-800"
            disabled={isPreviousDisabled}
            onClick={() => {
              if (previousPhotoId !== null) {
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
              if (nextPhotoId !== null) {
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
