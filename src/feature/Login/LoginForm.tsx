import {Theme} from '@material-ui/core'
import * as React from 'react'
import {useI18n} from '../../core/i18n'
import {regexp} from '../../core/helper/regexp'
import {LoginPanel} from './LoginPanel'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {makeStyles} from '@material-ui/core/styles'
import {ActionProps} from './LoginPage'
import {Fn} from '../../shared/Login/Login'
import {ScInputPassword} from '../../shared/InputPassword/InputPassword'
import {ScInput} from '../../shared/Input/ScInput'
import {useForm} from 'react-hook-form'
import {ScButton} from '../../shared/Button/Button'
import {fromNullable} from 'fp-ts/es6/Option'
import {ForgottenPasswordDialog} from './ForgottenPasswordDialog'
import {ApiError} from '../../core/api'
import {fnSwitch} from '../../core/helper/utils'
import {useToast} from '../../core/toast'

interface Props<L extends Fn, F extends Fn> {
  login: ActionProps<L>
  forgottenPassword?: ActionProps<F>
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
}


export const LoginForm = <L extends Fn, F extends Fn>({login, forgottenPassword}: Props<L, F>) => {
  const {m} = useI18n()
  const css = useStyles()
  const cssUtils = useCssUtils()
  const {toastError} = useToast()

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors, isValid},
  } = useForm<Form>({mode: 'onSubmit'})

  const onLogin = async (form: Form) => {
    login.action(form.email, form.password).catch((err: ApiError) => {
      const errorMessage = fnSwitch(err.code, {
        403: m.loginForbidden,
        423: m.loginLocked,
      }, () => m.loginFailed)
      toastError({message: errorMessage})
    })
  }

  return (
    <LoginPanel title={m.login}>
      <form className={css.body} onSubmit={handleSubmit(onLogin)} action="#">
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
          <ScButton
            loading={login.loading}
            type="submit"
            variant="contained"
            color="primary"
            className={cssUtils.marginRight}
          >
            {m.login}
          </ScButton>
          {fromNullable(forgottenPassword).map(_ => (
            <ForgottenPasswordDialog
              value={watch('email')}
              loading={_.loading}
              error={_.error}
              onSubmit={_.action}
            >
              <ScButton color="primary">{m.forgottenPassword}</ScButton>
            </ForgottenPasswordDialog>
          )).toUndefined()}
        </div>
      </form>
    </LoginPanel>
  )
}
