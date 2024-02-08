import {useParams} from 'react-router'
import {useEffect} from 'react'
import {useMutation} from '@tanstack/react-query'
import {useLogin} from '../../core/context/LoginContext'
import {useToast} from '../../core/toast'
import {CircularProgress} from '@mui/material'
import {Alert} from '../../alexlibs/mui-extension'
import {useI18n} from '../../core/i18n'

export const UpdateEmail = () => {
  const {m} = useI18n()
  const {token} = useParams<{token: string}>()
  const {apiSdk, setConnectedUser} = useLogin()
  const {toastSuccess} = useToast()

  const _updateEmail = useMutation({
    mutationFn: apiSdk.secured.user.updateEmail,
    onSuccess: user => {
      setConnectedUser(user)
      toastSuccess(m.emailAddressUpdatedToast)
    },
  })

  useEffect(() => {
    _updateEmail.mutate(token)
  }, [])

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
