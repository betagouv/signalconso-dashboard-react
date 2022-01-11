import {Theme} from '@mui/material'
import * as React from 'react'
import {useI18n} from '../../core/i18n'
import {regexp} from '../../core/helper/regexp'
import {LoginPanel} from './LoginPanel'
import {useCssUtils} from '../../core/helper/useCssUtils'
import makeStyles from '@mui/styles/makeStyles'
import {ActionProps} from './LoginPage'
import {ScInputPassword} from '../../shared/InputPassword/InputPassword'
import {ScInput} from '../../shared/Input/ScInput'
import {useForm} from 'react-hook-form'
import {ScButton} from '../../shared/Button/Button'
import {fromNullable} from 'fp-ts/es6/Option'
import {ForgottenPasswordDialog} from './ForgottenPasswordDialog'
import {ApiDetailedError, ApiError, SignalConsoPublicSdk} from '@signal-conso/signalconso-api-sdk-js'
import {fnSwitch} from '../../core/helper/utils'
import {useToast} from '../../core/toast'
import {AuthenticationEventActions, EventCategories, Matomo} from '../../core/plugins/Matomo'
import {Alert} from "mui-extension";
import {Txt} from "mui-extension/lib/Txt/Txt";

interface Props {
  login: ActionProps<SignalConsoPublicSdk['authenticate']['login']>
  forgottenPassword?: ActionProps<SignalConsoPublicSdk['authenticate']['forgotPassword']>
}

const useStyles = makeStyles((t: Theme) => ({
  body: {
    display: 'flex',
    flexDirection: 'column',
  },
}))

interface Form {
  email: string
  password: string
  apiError: string
}

export const LoginForm = ({login, forgottenPassword}: Props) => {
  const {m} = useI18n()
  const css = useStyles()
  const cssUtils = useCssUtils()

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
      .catch((err: ApiDetailedError) => {
        setError('apiError', {
          type: err.message.type,
          message: err.message.details
        });
        Matomo.trackEvent(EventCategories.auth, AuthenticationEventActions.fail)
      })
  }

  return (
    <LoginPanel title={m.login}>
      <form className={css.body} onSubmit={handleSubmit(onLogin)} action="#">
        {errors.apiError && (
            <Alert type="error" className={cssUtils.marginBottom2}>
              <Txt size="big" block bold>
                {m.somethingWentWrong}
              </Txt>
              <Txt>{errors.apiError.message}</Txt>
            </Alert>
        )}
        <ScInput
          autoFocus
          type="email"
          error={!!errors.email}
          helperText={errors.email?.message ?? ' '}
          label={m.email}
          className={cssUtils.marginBottom}
          {...register('email', {
            required: {value: true, message: m.required},
            pattern: {value: regexp.email, message: m.invalidEmail},
          })}
        />
        <ScInputPassword
          label={m.password}
          error={!!errors.password}
          helperText={errors.password?.message ?? ' '}
          className={cssUtils.marginBottom}
          {...register('password', {
            required: {value: true, message: m.atLeast8Characters},
          })}
        />
        <div style={{display: 'flex', alignItems: 'center'}}>
          <ScButton loading={login.loading} type="submit" onClick={_ => clearErrors('apiError')} variant="contained" color="primary" className={cssUtils.marginRight}>
            {m.login}
          </ScButton>
          {fromNullable(forgottenPassword)
            .map(_ => (
              <ForgottenPasswordDialog value={watch('email')} loading={_.loading}  error={_.error} onSubmit={_.action}>
                <ScButton color="primary">{m.forgottenPassword}</ScButton>
              </ForgottenPasswordDialog>
            ))
            .toUndefined()}
        </div>
      </form>
    </LoginPanel>
  )
}
