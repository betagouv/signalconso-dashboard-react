import { TextField } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { publicApiSdk } from 'core/apiSdkInstances'
import { ReactElement, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, Txt } from '../../alexlibs/mui-extension'
import { useToast } from '../../core/context/toastContext'
import { regexp } from '../../core/helper/regexp'
import { useI18n } from '../../core/i18n'
import {
  AuthenticationEventActions,
  EventCategories,
  Matomo,
} from '../../core/plugins/Matomo'
import { ScDialog } from '../../shared/ScDialog'

interface Props {
  children: ReactElement<any>
  value?: string
}

interface Form {
  emailForgotten: string
}

export const ForgottenPasswordDialog = ({ value, children }: Props) => {
  const { m } = useI18n()
  const { toastSuccess } = useToast()
  const _forgotPassword = useMutation({
    mutationFn: publicApiSdk.authenticate.forgotPassword,
    onSuccess: () => toastSuccess(m.emailSentToYou),
  })
  const {
    register,
    getValues,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Form>()

  useEffect(() => {
    setValue('emailForgotten', value ?? '')
  }, [value])

  const submit = (form: Form, close: () => void) => {
    _forgotPassword
      .mutateAsync(form.emailForgotten)
      .then(() => {
        close()
        Matomo.trackEvent(
          EventCategories.Authentification,
          AuthenticationEventActions.forgotPasswordSuccess,
        )
      })
      .catch(() => {
        Matomo.trackEvent(
          EventCategories.Authentification,
          AuthenticationEventActions.forgotPasswordFail,
        )
      })
  }

  return (
    <ScDialog
      loading={_forgotPassword.isPending}
      title={m.forgottenPassword}
      confirmLabel={m.createNewPassword}
      maxWidth="xs"
      onConfirm={(e, close) => handleSubmit(() => submit(getValues(), close))()}
      content={
        <>
          {_forgotPassword.isError && (
            <Alert type="error" gutterBottom deletable>
              {m.anErrorOccurred}
            </Alert>
          )}
          <Txt color="hint" block gutterBottom>
            {m.forgottenPasswordDesc}
          </Txt>
          {watch('emailForgotten')
            ?.toLocaleLowerCase()
            .endsWith('.gouv.fr') && (
            <Alert type="warning" gutterBottom>
              Réservé aux utilisateurs qui n'utilisent pas ProConnect pour se
              connecter à SignalConso.
            </Alert>
          )}
          <TextField
            fullWidth
            autoFocus
            variant="filled"
            type="email"
            label={m.yourEmail}
            size="small"
            error={!!errors.emailForgotten}
            helperText={errors.emailForgotten?.message}
            {...register('emailForgotten', {
              required: { value: true, message: m.required },
              pattern: { value: regexp.email, message: m.invalidEmail },
            })}
          />
        </>
      }
    >
      {children}
    </ScDialog>
  )
}
