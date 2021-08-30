import {Page} from 'mui-extension/lib'
import {Icon, Tab, Tabs, Theme} from '@material-ui/core'
import * as React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {useI18n} from '../../core/i18n'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {CenteredContent} from '../../shared/CenteredContent/CenteredContent'
import {headerHeight} from '../../core/Layout'
import {ActivateAccountForm} from './ActivateAccountForm'
import {LoginForm} from './LoginForm'
import {Link, Redirect, Route, Switch} from 'react-router-dom'
import {Fn} from '../../shared/Login/Login'
import {siteMap} from '../../core/siteMap'
import {ApiError, SignalConsoPublicSdk} from '../../core/api'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    maxWidth: 400,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
  },
  hint: {
    marginBottom: t.spacing(1),
    '& a': {
      color: t.palette.primary.main,
      fontWeight: t.typography.fontWeightBold,
    },
  },
  tabs: {
    border: '1px solid ' + t.palette.divider,
    borderRadius: t.shape.borderRadius,
    marginBottom: t.spacing(3),
  },
}))

export interface ActionProps<F extends (...args: any[]) => Promise<any>> {
  action: F
  loading?: boolean
  error?: ApiError
}

interface Props {
  login: ActionProps<SignalConsoPublicSdk['authenticate']['login']>
  forgottenPassword?: ActionProps<SignalConsoPublicSdk['authenticate']['forgotPassword']>
  register: ActionProps<SignalConsoPublicSdk['authenticate']['sendActivationLink']>
}

export const LoginPage = ({login, register, forgottenPassword}: Props) => {
  const {m} = useI18n()
  const css = useStyles()

  const allTabs = [siteMap.login, siteMap.register]

  return (
    <CenteredContent offset={headerHeight}>
      <Page className={css.root}>
        <Route
          path="/"
          render={({location}) => (
            <>
              <Tabs
                variant="fullWidth"
                className={css.tabs}
                value={allTabs.find(_ => _ === location.pathname) ?? allTabs[0]}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab component={Link} value={allTabs[0]} to={allTabs[0]} icon={<Icon>login</Icon>} label={m.signin}/>
                <Tab component={Link} value={allTabs[1]} to={allTabs[1]} icon={<Icon>person_add</Icon>} label={m.signup}/>
              </Tabs>
              <Switch>
                <Route path={allTabs[0]}>
                  <LoginForm login={login} forgottenPassword={forgottenPassword}/>
                </Route>
                <Route>
                  <ActivateAccountForm register={register}/>
                </Route>
              </Switch>
            </>
          )}
        />
        <Redirect exact from="/" to={allTabs[0]}/>
        <Txt color="hint" className={css.hint}>
          <div dangerouslySetInnerHTML={{__html: m.loginIssueTip}}/>
        </Txt>
      </Page>
    </CenteredContent>
  )
}
