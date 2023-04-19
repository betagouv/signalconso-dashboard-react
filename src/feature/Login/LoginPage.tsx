import {Icon, Tab, Tabs} from '@mui/material'
import {useEffect} from 'react'
import {useHistory} from 'react-router'
import {Link, Redirect, Route, Switch} from 'react-router-dom'
import {Page} from '../../alexlibs/mui-extension'
import {layoutConfig} from '../../core/Layout'
import {ApiError} from '../../core/client/ApiClient'
import {SignalConsoPublicSdk} from '../../core/client/SignalConsoPublicSdk'
import {useI18n} from '../../core/i18n'
import {Matomo} from '../../core/plugins/Matomo'
import {siteMap} from '../../core/siteMap'
import {CenteredContent} from '../../shared/CenteredContent/CenteredContent'
import {HelpContactInfo} from '../../shared/HelpContactInfo/HelpContactInfo'
import {ActivateAccountForm} from './ActivateAccountForm'
import {LoginForm} from './LoginForm'

export interface ActionProps<F extends (...args: any[]) => Promise<any>> {
  action: F
  loading?: boolean
  error?: ApiError
}

interface Props {
  login: ActionProps<SignalConsoPublicSdk['authenticate']['login']>
  register: ActionProps<SignalConsoPublicSdk['authenticate']['sendActivationLink']>
}

export const LoginPage = ({login, register}: Props) => {
  const {m} = useI18n()
  const history = useHistory()
  useEffect(() => history.listen(_ => Matomo.trackPage(_.pathname)), [history])

  const allTabs = [siteMap.loggedout.login, siteMap.loggedout.register]

  return (
    <CenteredContent offset={layoutConfig.headerHeight}>
      <Page sx={{maxWidth: 400}}>
        <Route
          path="/"
          render={({location}) => (
            <>
              <Tabs
                variant="fullWidth"
                sx={{
                  border: t => '1px solid ' + t.palette.divider,
                  borderRadius: t => t.shape.borderRadius + 'px',
                  mb: 3,
                }}
                value={allTabs.find(_ => _ === location.pathname) ?? allTabs[0]}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab component={Link} value={allTabs[0]} to={allTabs[0]} icon={<Icon>login</Icon>} label={m.signin} />
                <Tab component={Link} value={allTabs[1]} to={allTabs[1]} icon={<Icon>person_add</Icon>} label={m.signup} />
              </Tabs>
              <Switch>
                <Route path={allTabs[0]}>
                  <LoginForm login={login} />
                </Route>
                <Route path={allTabs[1]}>
                  <ActivateAccountForm register={register} />
                </Route>
                <Redirect from="/" to={allTabs[0]} />
              </Switch>
            </>
          )}
        />
        <HelpContactInfo />
      </Page>
    </CenteredContent>
  )
}
