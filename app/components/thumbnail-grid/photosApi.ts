export interface Photo {
  albumId: number
  id: number
  title: string
  url: string
  thumbnailUrl: string
}

export interface PhotosPage {
  items: Photo[]
  totalCount: number
}

const PAGE_SIZE = 12
const FULL_IMAGE_SIZE = 900
const THUMBNAIL_IMAGE_SIZE = 300

function getPicsumUrl(photoId: number, size: number) {
  return `https://picsum.photos/id/${photoId}/${size}/${size}`
}

export function getPhotoImageUrl(photoId: number) {
  return getPicsumUrl(photoId, FULL_IMAGE_SIZE)
}

export function getPhotoThumbnailUrl(photoId: number) {
  return getPicsumUrl(photoId, THUMBNAIL_IMAGE_SIZE)
}

function withPicsumUrls(photo: Photo, imageId = photo.id): Photo {
  return {
    ...photo,
    thumbnailUrl: getPhotoThumbnailUrl(imageId),
    url: getPhotoImageUrl(imageId),
  }
}

export async function fetchPhotosPage(
  page = 1,
  signal?: AbortSignal
): Promise<PhotosPage> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/albums/1/photos?_page=${page}&_limit=${PAGE_SIZE}`,
    { signal }
  )

  if (!response.ok) {
    throw new Error('Could not load photos')
  }

  const totalCount = Number(response.headers.get('x-total-count'))

  if (!Number.isFinite(totalCount)) {
    throw new Error('Photo response was missing total count')
  }

  return {
    items: ((await response.json()) as Photo[]).map((photo) =>
      withPicsumUrls(photo)
    ),
    totalCount,
  }
}

export async function fetchPhoto(
  photoId: number,
  signal?: AbortSignal
): Promise<Photo> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/photos/${photoId}`,
    { signal }
  )

  if (!response.ok) {
    throw new Error('Could not load photo')
  }

  return withPicsumUrls((await response.json()) as Photo, photoId)
}
