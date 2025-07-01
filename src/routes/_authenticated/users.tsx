import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { useI18n } from '../../core/i18n'
import { Page, PageTitle } from '../../shared/Page'
import { PageTab, PageTabs } from '../../shared/Page/PageTabs'
import { Route as adminRoute } from './users/admin'
import { Route as agentRoute } from './users/agent'
import { Route as authAttemptsRoute } from './users/auth-attempts'
import { Route as blacklistRoute } from './users/blacklist'
import { Route as consumersRoute } from './users/consumers'
import { Route as pendingRoute } from './users/pending'

export const Route = createFileRoute('/_authenticated/users')({
  component: Users,
})

function Users() {
  const { m } = useI18n() // Assuming this hook exists and provides translations
  const { connectedUser } = useConnectedContext() // Assuming this hook provides user state

  return (
    <Page>
      <PageTitle>{m.menu_users}</PageTitle>
      {connectedUser.isSuperAdmin ? (
        <PageTabs>
          <PageTab to={agentRoute.to} label={m.agentUsers} />
          <PageTab to={pendingRoute.to} label={m.agentUsersPending} />
          <PageTab to={adminRoute.to} label={m.adminUsers} />
          <PageTab to={consumersRoute.to} label={m.consumersPending} />
          <PageTab to={authAttemptsRoute.to} label={m.authAttempts} />
          <PageTab to={blacklistRoute.to} label={m.blacklistedConsumers} />
        </PageTabs>
      ) : (
        <PageTabs>
          <PageTab to={agentRoute.to} label={m.agentUsers} />
          <PageTab to={pendingRoute.to} label={m.agentUsersPending} />
          <PageTab to={consumersRoute.to} label={m.consumersPending} />
          <PageTab to={authAttemptsRoute.to} label={m.authAttempts} />
          <PageTab to={blacklistRoute.to} label={m.blacklistedConsumers} />
        </PageTabs>
      )}
      <Outlet />
    </Page>
  )
}
