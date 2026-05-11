export interface Photo {
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
    items: (await response.json()) as Photo[],
    totalCount,
  }
}
