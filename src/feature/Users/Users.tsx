import { Route } from 'react-router'
import { useI18n } from '../../core/i18n'
import { relativeToParent, siteMap } from '../../core/siteMap'
import { Page, PageTitle } from '../../shared/Page'
import { PageTab, PageTabs } from '../../shared/Page/PageTabs'
import { ConsumerBlacklist } from './ConsumerBlacklist'
import { ConsumerListPending } from './ConsumerListPending'
import { AdminUsersList, AgentUsersList } from './UsersList'
import { UsersAgentListPending } from './UsersAgentListPending'
import { UserAuthAttempts } from './UserAuthAttempts'
import { Navigate, Routes } from 'react-router'
import { useConnectedContext } from '../../core/context/ConnectedContext'

export const Users = () => {
  const { m } = useI18n() // Assuming this hook exists and provides translations
  const { connectedUser } = useConnectedContext() // Assuming this hook provides user state

  return (
    <Page>
      <PageTitle>{m.menu_users}</PageTitle>
      {connectedUser.isSuperAdmin ? (
        <PageTabs>
          <PageTab
            to={relativeToParent(siteMap.logged.users.agent.value)}
            label={m.agentUsers}
          />
          <PageTab
            to={relativeToParent(siteMap.logged.users.agent_pending.value)}
            label={m.agentUsersPending}
          />
          <PageTab
            to={relativeToParent(siteMap.logged.users.admin.value)}
            label={m.adminUsers}
          />
          <PageTab
            to={relativeToParent(
              siteMap.logged.users.consumer_validation.value,
            )}
            label={m.consumersPending}
          />
          <PageTab
            to={relativeToParent(siteMap.logged.users.auth_attempts.value())}
            label={m.authAttempts}
          />
          <PageTab
            to={relativeToParent(siteMap.logged.users.blacklist.value)}
            label={m.blacklistedConsumers}
          />
        </PageTabs>
      ) : (
        <PageTabs>
          <PageTab
            to={relativeToParent(siteMap.logged.users.agent.value)}
            label={m.agentUsers}
          />
          <PageTab
            to={relativeToParent(siteMap.logged.users.agent_pending.value)}
            label={m.agentUsersPending}
          />
          <PageTab
            to={relativeToParent(
              siteMap.logged.users.consumer_validation.value,
            )}
            label={m.consumersPending}
          />
          <PageTab
            to={relativeToParent(siteMap.logged.users.auth_attempts.value())}
            label={m.authAttempts}
          />
          <PageTab
            to={relativeToParent(siteMap.logged.users.blacklist.value)}
            label={m.blacklistedConsumers}
          />
        </PageTabs>
      )}
      <Routes>
        <Route
          path="*"
          element={
            <Navigate
              replace
              to={relativeToParent(siteMap.logged.users.agent.value)}
            />
          }
        />
        <Route
          path={siteMap.logged.users.agent.value}
          element={<AgentUsersList />}
        />
        <Route
          path={siteMap.logged.users.auth_attempts.value()}
          element={<UserAuthAttempts />}
        />
        <Route
          path={siteMap.logged.users.agent_pending.value}
          element={<UsersAgentListPending />}
        />
        <Route
          path={siteMap.logged.users.admin.value}
          element={<AdminUsersList />}
        />
        <Route
          path={siteMap.logged.users.consumer_validation.value}
          element={<ConsumerListPending />}
        />
        <Route
          path={siteMap.logged.users.blacklist.value}
          element={<ConsumerBlacklist />}
        />
      </Routes>
    </Page>
  )
}
