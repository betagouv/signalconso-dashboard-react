import React from 'react'
import {render, screen} from '@testing-library/react'
import {App} from './App'

test('renders app', () => {
  render(<App />)
  const loginLink = screen.getByText(/Je me connecte/i)
  expect(loginLink).toBeInTheDocument()
})
