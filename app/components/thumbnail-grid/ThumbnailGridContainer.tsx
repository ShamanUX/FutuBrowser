import { useCallback, useEffect, useRef, useState } from 'react'

import { ThumbnailGridView } from './ThumbnailGridView'
import { fetchPhotosPage, type Photo, type PhotosPage } from './photosApi'

interface PrefetchedPage {
  pageNumber: number
  result: 'fulfilled' | 'rejected'
  page?: PhotosPage
}

export function ThumbnailGridContainer() {
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null)

  const activeControllersRef = useRef<Set<AbortController>>(new Set())
  const hasMoreRef = useRef(false)
  const isLoadingMoreRef = useRef(false)
  const nextPageRef = useRef(2)
  const photosLengthRef = useRef(0)
  const prefetchedPageRef = useRef<PrefetchedPage | null>(null)
  const prefetchingPageRef = useRef<number | null>(null)

  function createAbortController() {
    const controller = new AbortController()
    activeControllersRef.current.add(controller)
    return controller
  }

  function releaseAbortController(controller: AbortController) {
    activeControllersRef.current.delete(controller)
  }

  const prefetchPage = useCallback((pageNumber: number) => {
    if (prefetchingPageRef.current === pageNumber) {
      return
    }

    const prefetchedPage = prefetchedPageRef.current
    if (prefetchedPage?.pageNumber === pageNumber) {
      return
    }

    prefetchingPageRef.current = pageNumber

    const controller = createAbortController()

    fetchPhotosPage(pageNumber, controller.signal)
      .then((page) => {
        prefetchedPageRef.current = {
          page,
          pageNumber,
          result: 'fulfilled',
        }
      })
      .catch((caughtError: unknown) => {
        if (
          caughtError instanceof DOMException &&
          caughtError.name === 'AbortError'
        ) {
          return
        }

        prefetchedPageRef.current = {
          pageNumber,
          result: 'rejected',
        }
      })
      .finally(() => {
        if (prefetchingPageRef.current === pageNumber) {
          prefetchingPageRef.current = null
        }

        releaseAbortController(controller)
      })
  }, [])

  const loadFirstPage = useCallback(() => {
    activeControllersRef.current.forEach((controller) => {
      controller.abort()
    })
    activeControllersRef.current.clear()

    hasMoreRef.current = false
    isLoadingMoreRef.current = false
    nextPageRef.current = 2
    photosLengthRef.current = 0
    prefetchedPageRef.current = null
    prefetchingPageRef.current = null

    setError(null)
    setHasMore(false)
    setLoadMoreError(null)
    setIsLoading(true)
    setIsLoadingMore(false)
    setPhotos([])

    const controller = createAbortController()

    return fetchPhotosPage(1, controller.signal)
      .then((page) => {
        setPhotos(page.items)
        photosLengthRef.current = page.items.length

        const nextHasMore = page.items.length < page.totalCount
        setHasMore(nextHasMore)
        hasMoreRef.current = nextHasMore

        nextPageRef.current = 2

        if (nextHasMore) {
          prefetchPage(2)
        }
      })
      .catch((caughtError: unknown) => {
        if (
          caughtError instanceof DOMException &&
          caughtError.name === 'AbortError'
        ) {
          return
        }

        setError('Could not load thumbnails')
      })
      .finally(() => {
        setIsLoading(false)
        releaseAbortController(controller)
      })
  }, [prefetchPage])

  const loadMore = useCallback(() => {
    if (isLoadingMoreRef.current || !hasMoreRef.current) {
      return
    }

    const pageNumber = nextPageRef.current
    const prefetchedPage = prefetchedPageRef.current

    if (prefetchedPage?.pageNumber === pageNumber) {
      if (prefetchedPage.result === 'rejected') {
        prefetchedPageRef.current = null
        setLoadMoreError('Could not load more thumbnails')
        return
      }

      if (prefetchedPage.page) {
        const page = prefetchedPage.page
        const loadedCount = photosLengthRef.current + page.items.length
        const nextHasMore = loadedCount < page.totalCount

        setPhotos((currentPhotos) => [...currentPhotos, ...page.items])
        photosLengthRef.current = loadedCount

        setHasMore(nextHasMore)
        hasMoreRef.current = nextHasMore

        nextPageRef.current = pageNumber + 1
        setLoadMoreError(null)

        prefetchedPageRef.current = null

        if (nextHasMore) {
          prefetchPage(pageNumber + 1)
        }

        return
      }
    }

    isLoadingMoreRef.current = true
    setIsLoadingMore(true)
    setLoadMoreError(null)

    const controller = createAbortController()

    fetchPhotosPage(pageNumber, controller.signal)
      .then((page) => {
        const loadedCount = photosLengthRef.current + page.items.length

        setPhotos((currentPhotos) => [...currentPhotos, ...page.items])
        photosLengthRef.current = loadedCount

        const nextHasMore = loadedCount < page.totalCount
        setHasMore(nextHasMore)
        hasMoreRef.current = nextHasMore

        nextPageRef.current = pageNumber + 1

        if (nextHasMore) {
          prefetchPage(pageNumber + 1)
        }
      })
      .catch((caughtError: unknown) => {
        if (
          caughtError instanceof DOMException &&
          caughtError.name === 'AbortError'
        ) {
          return
        }

        setLoadMoreError('Could not load more thumbnails')
      })
      .finally(() => {
        isLoadingMoreRef.current = false
        setIsLoadingMore(false)
        releaseAbortController(controller)
      })
  }, [prefetchPage])

  useEffect(() => {
    loadFirstPage()
    return () => {
      activeControllersRef.current.forEach((controller) => {
        controller.abort()
      })
      activeControllersRef.current.clear()
    }
  }, [loadFirstPage])

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
