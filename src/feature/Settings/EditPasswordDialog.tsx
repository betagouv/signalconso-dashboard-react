import { useMutation } from '@tanstack/react-query'
import { useConnectedContext } from 'core/context/connected/connectedContext'
import { ScOption } from 'core/helper/ScOption'
import { validatePasswordComplexity } from 'core/helper/passwordComplexity'
import { ReactElement } from 'react'
import { useForm } from 'react-hook-form'
import { PasswordRequirementsDesc } from 'shared/PasswordRequirementsDesc'
import { Alert } from '../../alexlibs/mui-extension'
import { ApiError } from '../../core/client/ApiClient'
import { useApiContext } from '../../core/context/ApiContext'
import { useToast } from '../../core/context/toast/toastContext'
import { useI18n } from '../../core/i18n'
import {
  AccountEventActions,
  EventCategories,
  trackEvent,
} from '../../core/plugins/Matomo'
import { ScDialog } from '../../shared/ScDialog'
import { ScInputPassword } from '../../shared/ScInputPassword'

interface Form {
  oldPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

interface Props {
  children: ReactElement<any>
}

export const EditPasswordDialog = ({ children }: Props) => {
  const { m } = useI18n()
  const { api } = useApiContext()
  const { connectedUser } = useConnectedContext()
  const _changePassword = useMutation({
    mutationFn: (params: { oldPassword: string; newPassword: string }) =>
      api.secured.user.changePassword(params.oldPassword, params.newPassword),
    onSuccess: () => {
      toastSuccess(m.passwordEdited)
      trackEvent(
        connectedUser,
        EventCategories.CompteUtilisateur,
        AccountEventActions.changePasswordSuccess,
      )
    },
    onError: (error: ApiError) => {
      trackEvent(
        connectedUser,
        EventCategories.CompteUtilisateur,
        AccountEventActions.changePasswordFail,
      )
    },
  })
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<Form>({ mode: 'onChange' })
  const { toastSuccess } = useToast()

  return (
    <ScDialog
      title={m.editPassword}
      maxWidth="md"
      confirmLabel={m.edit}
      confirmDisabled={!isValid}
      loading={_changePassword.isPending}
      onConfirm={(event, close) => {
        handleSubmit((form: Form) => {
          _changePassword
            .mutateAsync({
              oldPassword: form.oldPassword,
              newPassword: form.newPassword,
            })
            .then(close)
        })()
      }}
      content={
        <>
          {ScOption.from(_changePassword.error)
            .map((error) => (
              <Alert dense type="error" deletable gutterBottom>
                {error.details?.code === 401
                  ? m.invalidPassword
                  : m.failedToChangePassword}
              </Alert>
            ))
            .toUndefined()}

          <ScInputPassword
            inputProps={{
              autocomplete: 'false',
            }}
            autoComplete="false"
            error={!!errors.oldPassword}
            helperText={errors.oldPassword?.message ?? ' '}
            fullWidth
            label={m.oldPassword}
            {...register('oldPassword', {
              required: { value: true, message: m.required },
            })}
          />
          <PasswordRequirementsDesc />
          <ScInputPassword
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message ?? ' '}
            fullWidth
            label={m.newPassword}
            {...register('newPassword', {
              required: { value: true, message: m.required },
              validate: (value: string) => {
                if (value === getValues().oldPassword) {
                  return m.passwordAreIdentical
                }
                const complexityMessage = validatePasswordComplexity(value)
                if (complexityMessage) {
                  return m[complexityMessage]
                }
              },
            })}
          />
          <ScInputPassword
            error={!!errors.newPasswordConfirmation}
            helperText={errors.newPasswordConfirmation?.message ?? ' '}
            fullWidth
            label={m.newPasswordConfirmation}
            {...register('newPasswordConfirmation', {
              required: { value: true, message: m.required },
              validate: (value) =>
                value === getValues().newPassword || m.passwordDoesntMatch,
            })}
          />
        </>
      }
    >
      {children}
    </ScDialog>
  )
}
