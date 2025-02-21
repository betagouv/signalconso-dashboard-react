import React, { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'

export const ProConnectLogoutCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    sessionStorage.removeItem('oauth2_state')
    navigate({ to: '/connexion/agents' })
  }, [navigate])

  return <div>Loading...</div>
}

export default ProConnectLogoutCallback
