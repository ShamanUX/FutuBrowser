import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ThumbnailGridContainer } from './ThumbnailGridContainer'
import { fetchPhoto, fetchPhotosPage } from './photosApi'

vi.mock('./photosApi', () => ({
  fetchPhoto: vi.fn(),
  fetchPhotosPage: vi.fn(),
}))

vi.mock('react-infinite-scroll-component', async () => {
  const React = await import('react')

  return {
    default: ({
      children,
      hasMore,
      next,
    }: {
      children: React.ReactNode
      hasMore: boolean
      next: () => void
    }) =>
      React.createElement(
        'div',
        null,
        children,
        hasMore &&
          React.createElement(
            'button',
            { onClick: next, type: 'button' },
            'Load more thumbnails'
          )
      ),
  }
})

const fetchPhotosPageMock = vi.mocked(fetchPhotosPage)
const fetchPhotoMock = vi.mocked(fetchPhoto)

const firstPhoto = {
  albumId: 1,
  id: 1,
  title: 'accusamus beatae ad facilis cum similique qui sunt',
  url: 'https://picsum.photos/id/1/900/900',
  thumbnailUrl: 'https://picsum.photos/id/1/300/300',
}

const secondPhoto = {
  albumId: 1,
  id: 2,
  title: 'reprehenderit est deserunt velit ipsam',
  url: 'https://picsum.photos/id/2/900/900',
  thumbnailUrl: 'https://picsum.photos/id/2/300/300',
}

function renderThumbnailGrid(initialEntry = '/') {
  const router = createMemoryRouter(
    [
      { path: '/', element: <ThumbnailGridContainer /> },
      { path: '/p/:photoId/', element: <ThumbnailGridContainer /> },
    ],
    { initialEntries: [initialEntry] }
  )

  render(<RouterProvider router={router} />)

  return router
}

describe('ThumbnailGridContainer', () => {
  beforeEach(() => {
    fetchPhotosPageMock.mockReset()
    fetchPhotoMock.mockReset()
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('shows thumbnails are loading while the first page loads', () => {
    fetchPhotosPageMock.mockReturnValue(new Promise(() => {}))

    renderThumbnailGrid()

    expect(screen.getByText('Loading thumbnails')).toBeInTheDocument()
  })

  it('renders thumbnails returned from the first page', async () => {
    fetchPhotosPageMock.mockResolvedValue({
      items: [firstPhoto],
      totalCount: 1,
    })

    renderThumbnailGrid()

    expect(
      await screen.findByRole('img', { name: firstPhoto.title })
    ).toHaveAttribute('src', firstPhoto.thumbnailUrl)
    expect(
      screen.getByRole('link', { name: `View details for ${firstPhoto.title}` })
    ).toHaveAttribute('href', '/p/1/')
  })

  it('lets the user retry when the first page fails', async () => {
    fetchPhotosPageMock
      .mockRejectedValueOnce(new Error('Network unavailable'))
      .mockResolvedValueOnce({ items: [firstPhoto], totalCount: 1 })

    renderThumbnailGrid()

    expect(
      await screen.findByText('Could not load thumbnails')
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))

    expect(
      await screen.findByRole('img', { name: firstPhoto.title })
    ).toBeInTheDocument()
  })

  it('keeps existing thumbnails when the user loads more', async () => {
    fetchPhotosPageMock
      .mockResolvedValueOnce({ items: [firstPhoto], totalCount: 2 })
      .mockResolvedValueOnce({ items: [secondPhoto], totalCount: 2 })

    renderThumbnailGrid()

    expect(
      await screen.findByRole('img', { name: firstPhoto.title })
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Load more thumbnails' })
    )

    expect(
      await screen.findByRole('img', { name: secondPhoto.title })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: firstPhoto.title })
    ).toBeInTheDocument()
  })

  it('keeps existing thumbnails when loading more fails and lets the user retry', async () => {
    fetchPhotosPageMock
      .mockResolvedValueOnce({ items: [firstPhoto], totalCount: 2 })
      .mockRejectedValueOnce(new Error('Next page unavailable'))
      .mockResolvedValueOnce({ items: [secondPhoto], totalCount: 2 })

    renderThumbnailGrid()

    expect(
      await screen.findByRole('img', { name: firstPhoto.title })
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Load more thumbnails' })
    )

    expect(
      await screen.findByText('Could not load more thumbnails')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: firstPhoto.title })
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Retry loading more' }))

    expect(
      await screen.findByRole('img', { name: secondPhoto.title })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: firstPhoto.title })
    ).toBeInTheDocument()
  })

  it('opens photo details when the user clicks a thumbnail', async () => {
    fetchPhotosPageMock.mockResolvedValue({
      items: [firstPhoto],
      totalCount: 2,
    })

    const router = renderThumbnailGrid()

    fireEvent.click(
      await screen.findByRole('link', {
        name: `View details for ${firstPhoto.title}`,
      })
    )

    const dialog = await screen.findByRole('dialog', { name: firstPhoto.title })

    expect(router.state.location.pathname).toBe('/p/1/')
    expect(within(dialog).getByText('Image ID')).toBeInTheDocument()
    expect(within(dialog).getAllByText('1')).toHaveLength(2)
    expect(within(dialog).getByText('Album ID')).toBeInTheDocument()
    expect(within(dialog).getByText(firstPhoto.url)).toBeInTheDocument()
  })

  it('opens photo details from a direct photo URL', async () => {
    fetchPhotosPageMock.mockResolvedValue({ items: [], totalCount: 2 })
    fetchPhotoMock.mockResolvedValue(firstPhoto)

    renderThumbnailGrid('/p/1/')

    const dialog = await screen.findByRole('dialog', { name: firstPhoto.title })

    expect(within(dialog).getByText('Image ID')).toBeInTheDocument()
    expect(within(dialog).getAllByText('1')).toHaveLength(2)
    expect(within(dialog).getByText('Album ID')).toBeInTheDocument()
    expect(within(dialog).getByText(firstPhoto.url)).toBeInTheDocument()
    expect(
      within(dialog).getByText(firstPhoto.thumbnailUrl)
    ).toBeInTheDocument()
  })

  it('shows modal skeletons and disabled arrows while photo details are loading', async () => {
    fetchPhotosPageMock.mockResolvedValue({ items: [], totalCount: 3 })
    fetchPhotoMock.mockReturnValue(new Promise(() => {}))

    renderThumbnailGrid('/p/2/')

    const dialog = await screen.findByRole('dialog', {
      name: 'Loading photo details',
    })

    expect(screen.getByTestId('photo-image-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('photo-details-skeleton')).toBeInTheDocument()
    expect(
      within(dialog).getByRole('button', { name: 'Previous photo' })
    ).toBeDisabled()
    expect(
      within(dialog).getByRole('button', { name: 'Next photo' })
    ).toBeDisabled()
  })

  it('keeps the image skeleton until the modal image is ready', async () => {
    fetchPhotosPageMock.mockResolvedValue({
      items: [firstPhoto],
      totalCount: 2,
    })
    fetchPhotoMock.mockResolvedValue(firstPhoto)

    renderThumbnailGrid('/p/1/')

    const dialog = await screen.findByRole('dialog', { name: firstPhoto.title })
    const image = within(dialog).getByRole('img', { name: firstPhoto.title })

    expect(screen.getByTestId('photo-image-skeleton')).toBeInTheDocument()

    fireEvent.load(image)

    expect(screen.queryByTestId('photo-image-skeleton')).not.toBeInTheDocument()
  })

  it('shows an image error instead of keeping the image skeleton forever', async () => {
    fetchPhotosPageMock.mockResolvedValue({
      items: [firstPhoto],
      totalCount: 2,
    })
    fetchPhotoMock.mockResolvedValue(firstPhoto)

    renderThumbnailGrid('/p/1/')

    const dialog = await screen.findByRole('dialog', { name: firstPhoto.title })
    const image = within(dialog).getByRole('img', { name: firstPhoto.title })

    fireEvent.error(image)

    expect(screen.queryByTestId('photo-image-skeleton')).not.toBeInTheDocument()
    expect(within(dialog).getByText('Could not load image')).toBeInTheDocument()
  })

  it('closes photo details and returns to the grid URL', async () => {
    fetchPhotosPageMock.mockResolvedValue({
      items: [firstPhoto],
      totalCount: 2,
    })
    fetchPhotoMock.mockResolvedValue(firstPhoto)

    const router = renderThumbnailGrid('/p/1/')

    const closeButton = await screen.findByRole('button', {
      name: 'Close photo details',
    })
    fireEvent.click(closeButton)

    expect(router.state.location.pathname).toBe('/')
  })

  it('disables previous navigation on the first photo', async () => {
    fetchPhotosPageMock.mockResolvedValue({
      items: [firstPhoto],
      totalCount: 2,
    })
    fetchPhotoMock.mockResolvedValue(firstPhoto)

    renderThumbnailGrid('/p/1/')

    const dialog = await screen.findByRole('dialog', { name: firstPhoto.title })

    expect(
      within(dialog).getByRole('button', { name: 'Previous photo' })
    ).toBeDisabled()
  })

  it('navigates to the next photo from the details modal', async () => {
    fetchPhotosPageMock.mockResolvedValue({
      items: [firstPhoto],
      totalCount: 2,
    })
    fetchPhotoMock.mockImplementation(async (photoId) =>
      photoId === firstPhoto.id ? firstPhoto : secondPhoto
    )

    const router = renderThumbnailGrid('/p/1/')

    const dialog = await screen.findByRole('dialog', { name: firstPhoto.title })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Next photo' }))

    expect(router.state.location.pathname).toBe('/p/2/')
    expect(
      await screen.findByRole('dialog', { name: secondPhoto.title })
    ).toBeInTheDocument()
  })

  it('disables next navigation on the last photo', async () => {
    fetchPhotosPageMock.mockResolvedValue({
      items: [firstPhoto],
      totalCount: 1,
    })
    fetchPhotoMock.mockResolvedValue(firstPhoto)

    renderThumbnailGrid('/p/1/')

    const dialog = await screen.findByRole('dialog', { name: firstPhoto.title })

    expect(
      within(dialog).getByRole('button', { name: 'Next photo' })
    ).toBeDisabled()
  })
})
