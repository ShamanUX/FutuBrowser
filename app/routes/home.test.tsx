import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import Home from './home'
import { fetchPhotosPage } from '../components/thumbnail-grid/photosApi'

vi.mock('../components/thumbnail-grid/photosApi', () => ({
  fetchPhotosPage: vi.fn(),
}))

vi.mock('react-medium-image-zoom', async () => {
  const React = await import('react')

  return {
    default: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  }
})

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

const firstPhoto = {
  id: 1,
  title: 'accusamus beatae ad facilis cum similique qui sunt',
  url: 'https://via.placeholder.com/600/92c952',
  thumbnailUrl: 'https://via.placeholder.com/150/92c952',
}

const secondPhoto = {
  id: 2,
  title: 'reprehenderit est deserunt velit ipsam',
  url: 'https://via.placeholder.com/600/771796',
  thumbnailUrl: 'https://via.placeholder.com/150/771796',
}

describe('Home', () => {
  beforeEach(() => {
    fetchPhotosPageMock.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  it('shows thumbnails are loading while the first page loads', () => {
    fetchPhotosPageMock.mockReturnValue(new Promise(() => {}))

    render(<Home />)

    expect(screen.getByText('Loading thumbnails')).toBeInTheDocument()
  })

  it('renders thumbnails returned from the first page', async () => {
    fetchPhotosPageMock.mockResolvedValue({
      items: [firstPhoto],
      totalCount: 1,
    })

    render(<Home />)

    expect(
      await screen.findByRole('img', { name: firstPhoto.title })
    ).toHaveAttribute('src', firstPhoto.thumbnailUrl)
  })

  it('lets the user retry when the first page fails', async () => {
    fetchPhotosPageMock
      .mockRejectedValueOnce(new Error('Network unavailable'))
      .mockResolvedValueOnce({ items: [firstPhoto], totalCount: 1 })

    render(<Home />)

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

    render(<Home />)

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

    render(<Home />)

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
})
