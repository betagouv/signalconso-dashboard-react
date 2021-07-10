import {Alert, Btn, Confirm, Page} from 'mui-extension/lib'
import {TextField, Theme} from '@material-ui/core'
import * as React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {useI18n} from '../i18n'
import {useFormInput} from '@alexandreannic/react-hooks-lib/lib'
import {regexpPattern} from '../helper/regexp'
import {Panel, PanelBody} from '../../shared/Panel'
import {utilsStyles} from '../theme'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {useCssUtils} from '../helper/useCssUtils'
import {useEffect} from 'react'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: 'column',
    maxWidth: 366,
  },
  title: {
    marginTop: 0,
    marginBottom: t.spacing(3),
    textAlign: 'center',
    fontSize: utilsStyles(t).fontSize.bigTitle,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
  },
  panelBody: {
    padding: t.spacing(4),
  },
  hint: {
    '& a': {
      color: t.palette.primary.main,
      fontWeight: t.typography.fontWeightBold,
    }
  }
}));

interface Props {
  isLogging: boolean
  onLogin: (...args: any[]) => Promise<any>
  forgottenPassword?: {
    action: (...args: any[]) => Promise<any>,
    loading: boolean
    errorMsg?: string
  }
}

export const LoginPage = ({isLogging, onLogin, forgottenPassword}: Props) => {
  const {m} = useI18n()
  const cssUtils = useCssUtils()
  const inputEmail = useFormInput('email', {
    errorMessage: m.invalidEmail,
    pattern: regexpPattern.email,
    required: true
  })
  const inputEmailForgotten = useFormInput('emailForgotten', {
    errorMessage: m.invalidEmail,
    pattern: regexpPattern.email,
    required: true
  })
  const inputPassword = useFormInput('password', {
    errorMessage: m.atLeast8Characters,
    required: true,
    // pattern: '.{8,}'
  })
  const css = useStyles()

  const login = async () => {
    onLogin(inputEmail.props.value!, inputPassword.props.value!)
  }

  useEffect(() => {
    inputEmailForgotten.setValue(inputEmail.props.value)
  }, [inputEmail.props.value])

  return (
    <Page className={css.root}>
      <Panel>
        <PanelBody className={css.panelBody}>
          <form className={css.body} action="#">
            <h1 className={css.title}>{m.login}</h1>
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
                loading={isLogging}
                type="submit"
                disabled={!inputPassword.isValid() || !inputEmail.isValid()}
                onClick={login}
                variant="contained"
                color="primary"
                className={cssUtils.marginRight}
              >
                {m.login}
              </Btn>
              {forgottenPassword && (
                <Confirm
                  confirmDisabled={forgottenPassword.loading}
                  loading={forgottenPassword.loading}
                  title={m.forgottenPassword}
                  content={
                    <>
                      {forgottenPassword.errorMsg && (
                        <Alert type="error">{forgottenPassword.errorMsg}</Alert>
                      )}
                      <Txt color="hint" block gutterBottom>{m.forgottenPasswordDesc}</Txt>
                      <TextField
                        fullWidth
                        autoFocus
                        type="email"
                        margin="dense"
                        variant="outlined"
                        label={m.email}
                        {...inputEmailForgotten.props}/>

                    </>
                  }
                  onConfirm={(close) => {
                    forgottenPassword?.action(inputEmailForgotten.props.value).then(close)
                  }}
                  confirmLabel={m.createNewPassword}
                  cancelLabel={m.close}
                  maxWidth="xs"
                >
                  <Btn color="primary">
                    {m.forgottenPassword}
                  </Btn>
                </Confirm>
              )}
            </div>
          </form>
        </PanelBody>
      </Panel>
      <Txt color="hint" className={css.hint}>
        <div dangerouslySetInnerHTML={{__html: m.loginIssueTip}}/>
      </Txt>
    </Page>
  );
};
