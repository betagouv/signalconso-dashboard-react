import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { ApiError } from '../../core/client/ApiClient'
import { useToast } from '../../core/context/toast/toastContext'

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
        .then((_) => navigate({ to: '/suivi-des-signalements' }))
        .catch((e) => {
          toastError(e)
          navigate({ to: '/' })
        })
    }
  }, [navigate])

  return <div>Loading...</div>
}

export default ProConnectCallback
