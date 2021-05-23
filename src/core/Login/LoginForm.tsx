import {Btn, Page} from 'mui-extension/lib'
import {TextField, Theme} from '@material-ui/core'
import * as React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {useI18n} from '../i18n'
import {useFormInput} from '@alexandreannic/react-hooks-lib/lib'
import {RegEx} from '../utils/common'

interface Props {
  isLoading: boolean
  onLogin: (email: string, password: string) => Promise<void>
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
  },
  marginBtn: {
    marginBottom: t.spacing(2),
  },
  margin: {
    marginBottom: t.spacing(),
  },
}));

export const LoginForm = ({isLoading, onLogin}: Props) => {
  const {m} = useI18n();
  const inputEmail = useFormInput('email', {
    errorMessage: m.invalidEmail,
    pattern: RegEx.email,
    required: true
  });
  const inputPassword = useFormInput('password', {
    errorMessage: m.atLeast8Characters,
    required: true,
    // pattern: '.{8,}'
  });
  const css = useStyles();

  const login = async () => {
    onLogin(
      inputEmail.props.value!, inputPassword.props.value!);
  };

  return (
    <Page className={css.root}>
      <form className={css.body} action="#">
        <TextField
          autoFocus
          type="email"
          margin="dense"
          variant="outlined"
          label={m.email}
          {...inputEmail.props}
          className={css.margin}
        />
        <TextField
          margin="dense"
          variant="outlined"
          type="password"
          label={m.password}
          className={css.marginBtn}
          {...inputPassword.props}
        />
        <Btn loading={isLoading}
             type="submit"
             disabled={!inputPassword.isValid() || !inputEmail.isValid()}
             onClick={login}
             variant="outlined"
             color="primary">{m.login}</Btn>
      </form>
    </Page>
  );
};
