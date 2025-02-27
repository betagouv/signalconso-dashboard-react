import { useEffect } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'

export const RedirectHashRouterToBrowserRouter = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.href.startsWith('/#/')) {
      // Navigate to the new path without the hash.
      navigate({ to: location.href.replace('/#', '') })
    }
  }, [location, navigate])

  return <></>
}
