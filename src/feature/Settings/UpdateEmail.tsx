import {useParams} from 'react-router'
import {useEffect} from 'react'
import {useMutation} from '@tanstack/react-query'
import {useLogin} from '../../core/context/LoginContext'
import {useToast} from '../../core/toast'
import {CircularProgress} from '@mui/material'
import {Alert} from '../../alexlibs/mui-extension'

export const UpdateEmail = () => {
  const {token} = useParams<{token: string}>()
  const {apiSdk, setConnectedUser} = useLogin()
  const {toastSuccess} = useToast()

  const _updateEmail = useMutation({
    mutationFn: apiSdk.secured.user.updateEmail,
    onSuccess: user => {
      setConnectedUser(user)
      toastSuccess('Adresse email modifiée avec succès !')
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
      <Alert type="success">Votre adresse email a bien été changé !</Alert>
    </div>
  )
}
