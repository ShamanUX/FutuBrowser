import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Home from './home'

describe('Home', () => {
  it('renders the welcome message', () => {
    render(<Home />)

    expect(screen.getByText('This is Futubrowser!')).toBeInTheDocument()
  })
})
