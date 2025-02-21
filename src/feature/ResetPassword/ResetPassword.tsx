import { useMutation } from '@tanstack/react-query'
import { publicApiSdk } from 'core/apiSdkInstances'
import { validatePasswordComplexity } from 'core/helper/passwordComplexity'
import { AlertContactSupport } from 'feature/Login/loggedOutComponents'
import { useForm } from 'react-hook-form'
import { PasswordRequirementsDesc } from 'shared/PasswordRequirementsDesc'
import { fnSwitch } from '../../alexlibs/ts-utils'
import { useToast } from '../../core/context/toastContext'
import { useI18n } from '../../core/i18n'
import {
  AuthenticationEventActions,
  EventCategories,
  trackEventUnconnected,
} from '../../core/plugins/Matomo'
import { ScButton } from '../../shared/Button'
import { CenteredContent } from '../../shared/CenteredContent'
import { ScInputPassword } from '../../shared/ScInputPassword'
import { useNavigate } from '@tanstack/react-router'

interface Form {
  newPassword: string
  newPasswordConfirmation: string
}

export const ResetPassword = ({ token }: { token: string }) => {
  const { m } = useI18n()
  const _resetPassword = useMutation({
    mutationFn: (params: { password: string; token: string }) =>
      publicApiSdk.authenticate.resetPassword(params.password, params.token),
  })
  const history = useNavigate()
  const { toastError, toastSuccess } = useToast()
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<Form>()

  const resetPassword = (form: Form) => {
    if (typeof token === 'undefined') {
      toastError({ message: 'Token invalide' })
      return
    }

    _resetPassword
      .mutateAsync({ password: form.newPassword, token })
      .then(() => {
        toastSuccess(m.resetPasswordSuccess)
        setTimeout(() => history({ to: '/connexion' }), 400) // TODO Pourquoi ce setTimeout ?
        trackEventUnconnected(
          EventCategories.CompteUtilisateur,
          AuthenticationEventActions.resetPasswordSuccess,
        )
      })
      .catch((err) => {
        const errorMessage = fnSwitch(
          err.code,
          {
            404: m.resetPasswordNotFound,
          },
          () => undefined,
        )
        toastError({ message: errorMessage })
        reset()
        trackEventUnconnected(
          EventCategories.CompteUtilisateur,
          AuthenticationEventActions.resetPasswordFail,
        )
      })
  }

  return (
    <CenteredContent>
      <div className="w-full max-w-xl">
        <form onSubmit={handleSubmit(resetPassword)}>
          <h1 className="text-2xl mb-6">{m.passwordChange}</h1>
          <PasswordRequirementsDesc />
          <ScInputPassword
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message ?? ' '}
            fullWidth
            label={m.newPassword}
            {...register('newPassword', {
              required: { value: true, message: m.required },
              validate: (value: string) => {
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
          <div className="flex justify-center mb-4">
            <ScButton
              variant="contained"
              color="primary"
              type="submit"
              size="large"
            >
              {m.validate}
            </ScButton>
          </div>
          <AlertContactSupport />{' '}
        </form>
      </div>
    </CenteredContent>
  )
}
