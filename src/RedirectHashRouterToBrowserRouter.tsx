import {useEffect} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'

export const RedirectHashRouterToBrowserRouter = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.hash.startsWith('#/')) {
      // Navigate to the new path without the hash.
      navigate(location.hash.replace('#', ''))
    }
  }, [location, navigate])

  return <></>
}
