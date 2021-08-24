import {TextField, Theme} from '@material-ui/core'
import {Alert, Btn} from 'mui-extension'
import {ScDialog} from '../../shared/Confirm/ScDialog'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import * as React from 'react'
import {useEffect} from 'react'
import {useI18n} from '../../core/i18n'
import {useFormInput} from '@alexandreannic/react-hooks-lib'
import {regexpPattern} from '../../core/helper/regexp'
import {LoginPanel} from './LoginPanel'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {useToast} from '../../core/toast'
import {makeStyles} from '@material-ui/core/styles'
import {ActionProps} from './LoginPage'
import {Fn} from '../../shared/Login/Login'

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

export const LoginForm = <L extends Fn, F extends Fn>({login, forgottenPassword}: Props<L, F>) => {
  const {m} = useI18n()
  const css = useStyles()
  const cssUtils = useCssUtils()
  const {toastSuccess} = useToast()

  const inputEmail = useFormInput('email', {
    errorMessage: m.invalidEmail,
    pattern: regexpPattern.email,
    required: true,
  })
  const inputEmailForgotten = useFormInput('emailForgotten', {
    errorMessage: m.invalidEmail,
    pattern: regexpPattern.email,
    required: true,
  })
  const inputPassword = useFormInput('password', {
    errorMessage: m.atLeast8Characters,
    required: true,
    // pattern: '.{8,}'
  })

  const onLogin = async () => {
    login.action(inputEmail.props.value!, inputPassword.props.value!)
  }

  useEffect(() => {
    inputEmailForgotten.setValue(inputEmail.props.value)
  }, [inputEmail.props.value])

  return (
    <LoginPanel title={m.login}>
      <form className={css.body} action="#">
        <TextField
          autoFocus
          type="email"
          margin="dense"
          variant="outlined"
          label={m.email}
          {...inputEmail.props}
          className={cssUtils.marginBottom}
        />
        <TextField
          margin="dense"
          variant="outlined"
          type="password"
          label={m.password}
          className={cssUtils.marginBottom}
          {...inputPassword.props}
        />
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Btn
            loading={login.loading}
            type="submit"
            disabled={!inputPassword.isValid() || !inputEmail.isValid()}
            onClick={onLogin}
            variant="contained"
            color="primary"
            className={cssUtils.marginRight}
          >
            {m.login}
          </Btn>
          {forgottenPassword && (
            <ScDialog
              confirmDisabled={forgottenPassword.loading}
              loading={forgottenPassword.loading}
              title={m.forgottenPassword}
              content={
                <>
                  {forgottenPassword.errorMsg !== undefined && (
                    <Alert type="error" gutterBottom deletable>
                      {m.anErrorOccurred}
                    </Alert>
                  )}
                  <Txt color="hint" block gutterBottom>
                    {m.forgottenPasswordDesc} {inputEmailForgotten.props.value}
                  </Txt>
                  <TextField
                    fullWidth
                    autoFocus
                    type="email"
                    margin="dense"
                    variant="outlined"
                    label={m.email}
                    {...inputEmailForgotten.props}
                  />
                </>
              }
              onConfirm={(event, close) => {
                forgottenPassword
                  ?.action(inputEmailForgotten.props.value)
                  .then(close)
                  .then(() => toastSuccess(m.emailSentToYou))
              }}
              confirmLabel={m.createNewPassword}
              maxWidth="xs"
            >
              <Btn color="primary">{m.forgottenPassword}</Btn>
            </ScDialog>
          )}
        </div>
      </form>
    </LoginPanel>
  )
}
