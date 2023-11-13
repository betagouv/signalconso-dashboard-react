import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom'
import {useI18n} from '../../core/i18n'
import {siteMap} from '../../core/siteMap'
import {Page, PageTitle} from '../../shared/Page'
import {PageTab, PageTabs} from '../../shared/Page/PageTabs'
import {ConsumerBlacklist} from './ConsumerBlacklist'
import {ConsumerListPending} from './ConsumerListPending'
import {AdminUsersList, AgentUsersList} from './UsersList'
import {UsersListPending} from './UsersListPending'
import {UserAuthAttempts} from './UserAuthAttempts'

export const Users = () => {
  const {m} = useI18n()
  const {path} = useRouteMatch()

  return (
    <Page size="l">
      <PageTitle>{m.menu_users}</PageTitle>
      <PageTabs>
        <PageTab to={siteMap.logged.users_agent} label={m.agentUsers} />
        <PageTab to={siteMap.logged.users_agent_pending} label={m.agentUsersPending} />
        <PageTab to={siteMap.logged.users_admin} label={m.adminUsers} />
        <PageTab to={siteMap.logged.users_consumer_validation} label={m.consumersPending} />
        <PageTab to={siteMap.logged.users_auth_attempts()} label={m.authAttempts} />
        <PageTab to={siteMap.logged.users_blacklist} label={m.blacklistedConsumers} />
      </PageTabs>
      <Switch>
        <Redirect exact from={path} to={siteMap.logged.users_agent} />
        <Route path={siteMap.logged.users_agent} component={AgentUsersList} />
        <Route path={siteMap.logged.users_auth_attempts()} component={UserAuthAttempts} />
        <Route path={siteMap.logged.users_agent_pending} component={UsersListPending} />
        <Route path={siteMap.logged.users_admin} component={AdminUsersList} />
        <Route path={siteMap.logged.users_consumer_validation} component={ConsumerListPending} />
        <Route path={siteMap.logged.users_blacklist} component={ConsumerBlacklist} />
      </Switch>
    </Page>
  )
}
