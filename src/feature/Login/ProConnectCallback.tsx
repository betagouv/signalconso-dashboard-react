import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ProConnectCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const authorizationCode = urlParams.get('code')
    const state = urlParams.get('state')

    if (authorizationCode) {
      // Send the code and state to the backend for token exchange
      fetch(
        `http://localhost:9009/api/authenticate/proconnect?code=${authorizationCode}&state=${state}`,
        {
          method: 'GET',
        },
      )
        // .then((response) => response.json())
        .then((data) => {
          // Handle successful token exchange (e.g., store tokens, redirect)
          navigate('/') // Redirect to a logged-in page
        })
        .catch((err) => {
          console.error('Error exchanging code:', err)
        })
    }
  }, [navigate])

  return <div>Loading...</div>
}

export default ProConnectCallback
