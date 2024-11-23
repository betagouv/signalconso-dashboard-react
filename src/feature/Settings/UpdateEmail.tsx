import { CircularProgress } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { Alert } from '../../alexlibs/mui-extension'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useToast } from '../../core/context/toastContext'
import { useI18n } from '../../core/i18n'

export const UpdateEmail = () => {
  const { m } = useI18n()
  const { token } = useParams<{ token: string }>()
  const { api: apiSdk, setConnectedUser } = useConnectedContext()
  const { toastSuccess } = useToast()

  const _updateEmail = useMutation({
    mutationFn: apiSdk.secured.user.updateEmail,
    onSuccess: (user) => {
      setConnectedUser(user)
      toastSuccess(m.emailAddressUpdatedToast)
    },
  })

  useEffect(() => {
    token && _updateEmail.mutate(token)
  }, [token])

  return _updateEmail.isPending ? (
    <div className="h-screen flex items-center justify-center">
      <CircularProgress />
    </div>
  ) : _updateEmail.error ? (
    <div className="mx-4 mt-10">
      <Alert type="error">{_updateEmail.error.message}</Alert>
    </div>
  ) : (
    <div className="mx-4 mt-10">
      <Alert type="success">{m.emailAddressUpdated}</Alert>
    </div>
  )
}
