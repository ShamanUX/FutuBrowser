import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchPhoto, fetchPhotosPage } from './photosApi'

const jsonPlaceholderPhoto = {
  albumId: 1,
  id: 7,
  title: 'photo title',
  url: 'https://via.placeholder.com/600/92c952',
  thumbnailUrl: 'https://via.placeholder.com/150/92c952',
}

describe('photosApi', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses Picsum thumbnail and full image URLs for photo pages', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([jsonPlaceholderPhoto]), {
        headers: { 'x-total-count': '10' },
        status: 200,
      })
    )

    const page = await fetchPhotosPage()

    expect(page).toEqual({
      items: [
        {
          ...jsonPlaceholderPhoto,
          thumbnailUrl: 'https://picsum.photos/id/7/300/300',
          url: 'https://picsum.photos/id/7/900/900',
        },
      ],
      totalCount: 10,
    })
  })

  it('uses Picsum thumbnail and full image URLs for a single photo', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(jsonPlaceholderPhoto), { status: 200 })
    )

    const photo = await fetchPhoto(jsonPlaceholderPhoto.id)

    expect(photo).toEqual({
      ...jsonPlaceholderPhoto,
      thumbnailUrl: 'https://picsum.photos/id/7/300/300',
      url: 'https://picsum.photos/id/7/900/900',
    })
  })

  it('uses the requested photo id for single photo image URLs', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(jsonPlaceholderPhoto), { status: 200 })
    )

    const photo = await fetchPhoto(42)

    expect(photo).toEqual({
      ...jsonPlaceholderPhoto,
      thumbnailUrl: 'https://picsum.photos/id/42/300/300',
      url: 'https://picsum.photos/id/42/900/900',
    })
  })
})
