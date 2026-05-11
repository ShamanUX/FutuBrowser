import { useEffect, useState } from 'react'

import { ThumbnailGridView } from './ThumbnailGridView'
import { fetchPhotosPage, type Photo } from './photosApi'

export function ThumbnailGridContainer() {
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null)
  const [nextPage, setNextPage] = useState(2)

  function loadFirstPage() {
    setError(null)
    setLoadMoreError(null)
    setIsLoading(true)

    return fetchPhotosPage()
      .then((page) => {
        setPhotos(page.items)
        setHasMore(page.items.length < page.totalCount)
        setNextPage(2)
      })
      .catch(() => {
        setError('Could not load thumbnails')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function loadMore() {
    if (isLoadingMore || !hasMore) {
      return
    }

    setIsLoadingMore(true)
    setLoadMoreError(null)

    fetchPhotosPage(nextPage)
      .then((page) => {
        setPhotos((currentPhotos) => [...currentPhotos, ...page.items])
        setHasMore(photos.length + page.items.length < page.totalCount)
        setNextPage((pageNumber) => pageNumber + 1)
      })
      .catch(() => {
        setLoadMoreError('Could not load more thumbnails')
      })
      .finally(() => {
        setIsLoadingMore(false)
      })
  }

  useEffect(() => {
    loadFirstPage()
  }, [])

  return (
    <ThumbnailGridView
      error={error}
      hasMore={hasMore}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      loadMoreError={loadMoreError}
      onLoadMore={loadMore}
      onRetry={loadFirstPage}
      photos={photos}
    />
  )
}
