import React, { useEffect } from 'react'
import { siteMap } from '../../core/siteMap'
import {useNavigate} from "@tanstack/react-router";

export const ProConnectLogoutCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    sessionStorage.removeItem('oauth2_state')
    navigate({to: siteMap.loggedout.loginAgent})
  }, [navigate])

  return <div>Loading...</div>
}

export default ProConnectLogoutCallback
