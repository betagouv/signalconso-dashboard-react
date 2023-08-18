import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import {App} from './App'

test('renders app', async () => {
  render(<App />)
  await waitFor(() => {
    const loginLink = screen.getByText(/Je me connecte/i)
    expect(loginLink).toBeInTheDocument()
  })
})
