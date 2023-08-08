import {TextField} from '@mui/material'
import {AlertContactSupport, EspaceProTitle} from 'feature/Login/loggedOutComponents'
import {useForm} from 'react-hook-form'
import {CenteredContent} from 'shared/CenteredContent/CenteredContent'
import {Alert, Txt} from '../../alexlibs/mui-extension'
import {ApiError} from '../../core/client/ApiClient'
import {SignalConsoPublicSdk} from '../../core/client/SignalConsoPublicSdk'
import {regexp} from '../../core/helper/regexp'
import {useI18n} from '../../core/i18n'
import {AuthenticationEventActions, EventCategories, Matomo} from '../../core/plugins/Matomo'
import {ScButton} from '../../shared/Button/Button'
import {ScInputPassword} from '../../shared/InputPassword/InputPassword'
import {ForgottenPasswordDialog} from './ForgottenPasswordDialog'

interface ActionProps<F extends (...args: any[]) => Promise<any>> {
  action: F
  loading?: boolean
  error?: ApiError
}

interface Props {
  login: ActionProps<SignalConsoPublicSdk['authenticate']['login']>
}

interface Form {
  email: string
  password: string
  apiError: string
}

export const LoginForm = ({login}: Props) => {
  const {m} = useI18n()
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: {errors},
  } = useForm<Form>({mode: 'onSubmit'})

  const onLogin = async (form: Form) => {
    login
      .action(form.email, form.password)
      .then(auth => {
        Matomo.trackEvent(EventCategories.auth, AuthenticationEventActions.success, auth.user.id)
        Matomo.trackEvent(EventCategories.auth, AuthenticationEventActions.role, auth.user.role)
      })
      .catch((err: ApiError) => {
        setError('apiError', {
          type: err.details.id,
          message: err.message,
        })
        Matomo.trackEvent(EventCategories.auth, AuthenticationEventActions.fail)
      })
  }

  return (
    <CenteredContent>
      <EspaceProTitle subPageTitle={m.login} />
      <div className="w-full max-w-xl">
        <form className="flex flex-col mb-8" onSubmit={handleSubmit(onLogin)} action="#">
          {errors.apiError && (
            <Alert type="error" sx={{mb: 2}}>
              <Txt size="big" block bold>
                {m.somethingWentWrong}
              </Txt>
              <Txt>{errors.apiError.message}</Txt>
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
              required: {value: true, message: m.required},
              pattern: {value: regexp.email, message: m.invalidEmail},
            })}
          />
          <ScInputPassword
            autoComplete="current-password"
            label={m.password}
            error={!!errors.password}
            helperText={errors.password?.message ?? ' '}
            {...register('password', {
              required: {value: true, message: m.atLeast8Characters},
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
              onClick={_ => clearErrors('apiError')}
              variant="contained"
              color="primary"
              size="large"
            >
              {m.imLoggingIn}
            </ScButton>
          </div>
        </form>
        <AlertContactSupport />
      </div>
    </CenteredContent>
  )
}
