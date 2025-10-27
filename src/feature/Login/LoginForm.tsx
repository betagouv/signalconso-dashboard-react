import { TextField } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { AlertContactSupport } from 'feature/Login/loggedOutComponents'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { DsfrAlert } from 'shared/DsfrAlert'
import { config } from '../../conf/config'
import { ApiError } from '../../core/client/ApiClient'
import { PublicApiSdk } from '../../core/client/PublicApiSdk'
import { regexp } from '../../core/helper/regexp'
import { useI18n } from '../../core/i18n'
import {
  AuthenticationEventActions,
  EventCategories,
  trackEventUnconnected,
} from '../../core/plugins/Matomo'
import { ScButton } from '../../shared/Button'
import { ScInputPassword } from '../../shared/ScInputPassword'
import { ForgottenPasswordDialog } from './ForgottenPasswordDialog'
import PredefinedUsersPanel from './PredefinedUsersPanel'

interface ActionProps<F extends (...args: any[]) => Promise<any>> {
  action: F
  loading?: boolean
  error?: ApiError
}

interface Props {
  login: ActionProps<PublicApiSdk['authenticate']['login']>
  redirect?: string
}

export interface Form {
  email: string
  password: string
  apiError: string
}

export const LoginForm = ({ login, redirect }: Props) => {
  const { m } = useI18n()

  const history = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<Form>({ mode: 'onSubmit' })
  const [apiError, setApiError] = useState<ApiError | undefined>()
  const needEmailRevalidationApiError = apiError?.details.id === 'SC-0013'

  const onLogin: (form: Form) => Promise<void> = async (form: Form) => {
    login
      .action(form.email, form.password)
      .then(async (user) => {
        trackEventUnconnected(
          EventCategories.Authentification,
          AuthenticationEventActions.success,
        )
        trackEventUnconnected(
          EventCategories.Authentification,
          AuthenticationEventActions.role,
          user.role,
        )

        if (redirect) {
          return history({ to: redirect })
        } else {
          return history({ to: '/suivi-des-signalements' })
        }
      })
      .catch((err: ApiError) => {
        setApiError(err)
        trackEventUnconnected(
          EventCategories.Authentification,
          AuthenticationEventActions.fail,
        )
      })
  }

  return (
    <div className="w-full max-w-xl">
      {needEmailRevalidationApiError ? (
        <div className="mt-4 mb-14 max-w-lg mx-auto">
          <p className="mb-2">
            Votre adresse email <strong>{watch('email')}</strong> a besoin
            d'être revalidée.
          </p>
          <p>
            Nous vous avons envoyé un email, cliquez sur le lien qu'il contient
            pour revalider votre adresse et vous connecter à SignalConso.
          </p>
        </div>
      ) : (
        <form
          className="flex flex-col mb-8"
          onSubmit={handleSubmit(onLogin)}
          action="#"
        >
          {apiError && (
            <div className="mb-6">
              <DsfrAlert
                type="error"
                title={
                  apiError.isFailedLoginError()
                    ? 'Email ou mot de passe incorrect'
                    : m.somethingWentWrong
                }
              >
                {apiError.isFailedLoginError()
                  ? `Si vous avez oublié votre mot de passe, cliquez sur 'mot de passe oublié' pour le récupérer.`
                  : apiError.message}
              </DsfrAlert>
            </div>
          )}
          <TextField
            autoComplete="username"
            type="email"
            variant="filled"
            error={!!errors.email}
            helperText={errors.email?.message ?? ' '}
            label={m.yourEmail}
            {...register('email', {
              required: { value: true, message: m.required },
              pattern: { value: regexp.email, message: m.invalidEmail },
            })}
          />
          <ScInputPassword
            autoComplete="current-password"
            label={m.password}
            error={!!errors.password}
            helperText={errors.password?.message ?? ' '}
            {...register('password', {
              required: { value: true, message: m.required },
            })}
          />
          <div className="flex gap-4 items-center justify-center">
            <ForgottenPasswordDialog value={watch('email')}>
              <ScButton color="primary" size="large" variant="text">
                {m.forgottenPassword}
              </ScButton>
            </ForgottenPasswordDialog>
            <ScButton
              loading={login.loading}
              type="submit"
              onClick={(_) => clearErrors('apiError')}
              variant="contained"
              color="primary"
              size="large"
            >
              {m.imLoggingIn}
            </ScButton>
          </div>
        </form>
      )}
      <AlertContactSupport />
      <br />
      {config.showPredefinedUsers && <PredefinedUsersPanel onLogin={onLogin} />}
    </div>
  )
}
