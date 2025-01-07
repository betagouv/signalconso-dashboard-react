import { TextField } from '@mui/material'
import { AlertContactSupport } from 'feature/Login/loggedOutComponents'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { Alert, Txt } from '../../alexlibs/mui-extension'
import { config } from '../../conf/config'
import { ApiError } from '../../core/client/ApiClient'
import { PublicApiSdk } from '../../core/client/PublicApiSdk'
import { regexp } from '../../core/helper/regexp'
import {
  mapArrayFromQuerystring,
  useQueryString,
} from '../../core/helper/useQueryString'
import { useI18n } from '../../core/i18n'
import {
  AuthenticationEventActions,
  EventCategories,
  trackEventUnconnected,
} from '../../core/plugins/Matomo'
import { siteMap } from '../../core/siteMap'
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
}

export interface Form {
  email: string
  password: string
  apiError: string
}

interface RedirectProps {
  redirecturl?: string
}

export const LoginForm = ({ login }: Props) => {
  const { m } = useI18n()

  const history = useNavigate()

  const queryString = useQueryString<
    Partial<RedirectProps>,
    Partial<RedirectProps>
  >({
    toQueryString: (_) => _,
    fromQueryString: mapArrayFromQuerystring(['redirecturl']),
  })
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
      .then((user) => {
        trackEventUnconnected(
          EventCategories.Authentification,
          AuthenticationEventActions.success,
        )
        trackEventUnconnected(
          EventCategories.Authentification,
          AuthenticationEventActions.role,
          user.role,
        )

        const redirectUrl = queryString.get().redirecturl?.[0]
        if (redirectUrl) {
          history(redirectUrl, { replace: true })
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
            <Alert type="error" sx={{ mb: 2 }}>
              <Txt size="big" block bold>
                {m.somethingWentWrong}
              </Txt>
              <Txt>{apiError.message}</Txt>
              {watch('email').toLocaleLowerCase().endsWith('.gouv.fr') &&
                config.enableProConnect && (
                  <p className={'mt-2 font-bold'}>
                    Essayez de vous connecter via le bouton{' '}
                    <a
                      href={siteMap.loggedout.loginAgent}
                      className="underline"
                    >
                      Pro Connect
                    </a>{' '}
                    si vous avez reçu un e-mail d’invitation mentionnant
                    ProConnect, ou si vous utilisez Pro Connect pour vous
                    connecter à Signal Conso.
                  </p>
                )}
            </Alert>
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
