import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../../core/client/ApiClient'
import { useToast } from '../../core/context/toastContext'

interface ActionProps<F extends (...args: any[]) => Promise<any>> {
  action: F
  loading?: boolean
  error?: ApiError
}

interface Props {
  loginProConnect: ActionProps<
    (authorizationCode: string, state: string) => Promise<any>
  >
}

export const ProConnectCallback = ({
  loginProConnect: loginProConnect,
}: Props) => {
  const navigate = useNavigate()
  const { toastError } = useToast()
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const authorizationCode = urlParams.get('code')
    const state = urlParams.get('state')

    if (authorizationCode && state) {
      loginProConnect
        .action(authorizationCode, state)
        .then((_) => navigate('/suivi-des-signalements?offset=0&limit=25'))
        .catch((e) => {
          toastError(e)
          navigate('/')
        })
    }
  }, [navigate])

  return <div>Loading...</div>
}

export default ProConnectCallback
