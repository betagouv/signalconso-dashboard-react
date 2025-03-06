import { CircularProgress } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Alert } from '../../alexlibs/mui-extension'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { useToast } from '../../core/context/toast/toastContext'
import { useI18n } from '../../core/i18n'

export const UpdateEmail = ({ token }: { token: string }) => {
  const { m } = useI18n()

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
    if (token) {
      _updateEmail.mutate(token)
    }
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
