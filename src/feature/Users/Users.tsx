import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom'
import {useI18n} from '../../core/i18n'
import {siteMap} from '../../core/siteMap'
import {Page, PageTitle} from '../../shared/Layout'
import {PageTab, PageTabs} from '../../shared/Layout/Page/PageTabs'
import {AdminUsersList, DgccrfUsersList} from './UsersList'
import {UsersListPending} from './UsersListPending'
import {Box} from '@mui/material'
import {ConsumerListPending} from './ConsumerListPending'
import {UserInvitationDialog} from './UserInvitationDialog'

export const Users = () => {
  const {m} = useI18n()
  const {path} = useRouteMatch()

  return (
    <Page>
      <PageTitle
        action={
          <>
            <Box>
              <UserInvitationDialog kind="dgccrf" />
              <UserInvitationDialog kind="admin" />
            </Box>
          </>
        }
      >
        {m.menu_users}
      </PageTitle>
      <PageTabs>
        <PageTab to={siteMap.logged.users_dgccrf} label={m.dgccrfUsers} />
        <PageTab to={siteMap.logged.users_dgccrf_pending} label={m.dgccrfUsersPending} />
        <PageTab to={siteMap.logged.users_admin} label={m.adminUsers} />
        <PageTab to={siteMap.logged.users_consumer_validation} label={m.consumersPending} />
      </PageTabs>
      <Switch>
        <Redirect exact from={path} to={siteMap.logged.users_dgccrf} />
        <Route path={siteMap.logged.users_dgccrf} component={DgccrfUsersList} />
        <Route path={siteMap.logged.users_dgccrf_pending} component={UsersListPending} />
        <Route path={siteMap.logged.users_admin} component={AdminUsersList} />
        <Route path={siteMap.logged.users_consumer_validation} component={ConsumerListPending} />
      </Switch>
    </Page>
  )
}
