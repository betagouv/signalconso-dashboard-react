import {Page} from 'mui-extension/lib'
import {Icon, Tab, Tabs, Theme} from '@mui/material'
import * as React from 'react'
import {useEffect} from 'react'
import makeStyles from '@mui/styles/makeStyles'
import {useI18n} from '../../core/i18n'
import {CenteredContent} from '../../shared/CenteredContent/CenteredContent'
import {headerHeight} from '../../core/Layout'
import {ActivateAccountForm} from './ActivateAccountForm'
import {LoginForm} from './LoginForm'
import {Link, Redirect, Route, Switch} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {ApiDetailedError, SignalConsoPublicSdk} from '@signal-conso/signalconso-api-sdk-js'
import {HelpContactInfo} from '../../shared/HelpContactInfo/HelpContactInfo'
import {useHistory} from 'react-router'
import {Matomo} from '../../core/plugins/Matomo'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    maxWidth: 400,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
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
  error?: ApiDetailedError
}

interface Props {
  login: ActionProps<SignalConsoPublicSdk['authenticate']['login']>
  forgottenPassword?: ActionProps<SignalConsoPublicSdk['authenticate']['forgotPassword']>
  register: ActionProps<SignalConsoPublicSdk['authenticate']['sendActivationLink']>
}

export const LoginPage = ({login, register, forgottenPassword}: Props) => {
  const {m} = useI18n()
  const css = useStyles()
  const history = useHistory()
  useEffect(() => history.listen(_ => Matomo.trackPage(_.pathname)), [history])

  const allTabs = [siteMap.loggedout.login, siteMap.loggedout.register]

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
                <Tab component={Link} value={allTabs[0]} to={allTabs[0]} icon={<Icon>login</Icon>} label={m.signin} />
                <Tab component={Link} value={allTabs[1]} to={allTabs[1]} icon={<Icon>person_add</Icon>} label={m.signup} />
              </Tabs>
              <Switch>
                <Route path={allTabs[0]}>
                  <LoginForm login={login} forgottenPassword={forgottenPassword} />
                </Route>
                <Route>
                  <ActivateAccountForm register={register} />
                </Route>
              </Switch>
            </>
          )}
        />
        <Redirect exact from="/" to={allTabs[0]} />
        <HelpContactInfo />
      </Page>
    </CenteredContent>
  )
}
