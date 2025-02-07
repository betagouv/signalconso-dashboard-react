import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { siteMap } from '../../core/siteMap'

export const ProConnectLogoutCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    sessionStorage.removeItem('oauth2_state')
    navigate(siteMap.loggedout.loginAgent)
  }, [navigate])

  return <div>Loading...</div>
}

export default ProConnectLogoutCallback
