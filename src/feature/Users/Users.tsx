import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom'
import {useI18n} from '../../core/i18n'
import {siteMap} from '../../core/siteMap'
import {Page, PageTitle} from '../../shared/Page'
import {PageTab, PageTabs} from '../../shared/Page/PageTabs'
import {ConsumerBlacklist} from './ConsumerBlacklist'
import {ConsumerListPending} from './ConsumerListPending'
import {AdminUsersList, DgccrfUsersList} from './UsersList'
import {UsersListPending} from './UsersListPending'

export const Users = () => {
  const {m} = useI18n()
  const {path} = useRouteMatch()

  return (
    <Page>
      <PageTitle>{m.menu_users}</PageTitle>
      <PageTabs>
        <PageTab to={siteMap.logged.users_dgccrf} label={m.dgccrfUsers} />
        <PageTab to={siteMap.logged.users_dgccrf_pending} label={m.dgccrfUsersPending} />
        <PageTab to={siteMap.logged.users_admin} label={m.adminUsers} />
        <PageTab to={siteMap.logged.users_consumer_validation} label={m.consumersPending} />
        <PageTab to={siteMap.logged.users_blacklist} label={m.blacklistedConsumers} />
      </PageTabs>
      <Switch>
        <Redirect exact from={path} to={siteMap.logged.users_dgccrf} />
        <Route path={siteMap.logged.users_dgccrf} component={DgccrfUsersList} />
        <Route path={siteMap.logged.users_dgccrf_pending} component={UsersListPending} />
        <Route path={siteMap.logged.users_admin} component={AdminUsersList} />
        <Route path={siteMap.logged.users_consumer_validation} component={ConsumerListPending} />
        <Route path={siteMap.logged.users_blacklist} component={ConsumerBlacklist} />
      </Switch>
    </Page>
  )
}
