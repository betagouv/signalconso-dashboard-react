import { validatePasswordComplexity } from 'core/helper/passwordComplexity'
import { AlertContactSupport } from 'feature/Login/loggedOutComponents'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { PasswordRequirementsDesc } from 'shared/PasswordRequirementsDesc'
import { useAsync } from '../../alexlibs/react-hooks-lib'
import { fnSwitch } from '../../alexlibs/ts-utils'
import { useI18n } from '../../core/i18n'
import { Id } from '../../core/model'
import {
  AuthenticationEventActions,
  EventCategories,
  Matomo,
} from '../../core/plugins/Matomo'
import { siteMap } from '../../core/siteMap'
import { useToast } from '../../core/toast'
import { ScButton } from '../../shared/Button'
import { CenteredContent } from '../../shared/CenteredContent'
import { ScInputPassword } from '../../shared/ScInputPassword'

interface Form {
  newPassword: string
  newPasswordConfirmation: string
}

interface Props {
  onResetPassword: (password: string, token: Id) => Promise<any>
}

export const ResetPassword = ({ onResetPassword }: Props) => {
  const { m } = useI18n()
  const { token } = useParams<{ token: Id }>()
  const _resetPassword = useAsync(onResetPassword)
  const history = useNavigate()
  const { toastError, toastSuccess } = useToast()
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm<Form>()

  const resetPassword = (form: Form) => {
    if (typeof token === 'undefined') {
      toastError({ message: 'Token invalide' })
      return
    }

    _resetPassword
      .call(form.newPassword, token)
      .then(() => {
        toastSuccess(m.resetPasswordSuccess)
        setTimeout(() => history(siteMap.loggedout.login), 400)
        Matomo.trackEvent(
          EventCategories.account,
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
        Matomo.trackEvent(
          EventCategories.account,
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
