import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { Page, PageTitle } from '../../shared/Page'
import { PageTab, PageTabs } from '../../shared/Page/PageTabs'
import { Route as testRoute } from './tools/test'
import { Route as adminRoute } from './tools/admin'

export const Route = createFileRoute('/_authenticated/tools')({
  component: Tools,
})

function Tools() {
  const { connectedUser } = useConnectedContext()

  return (
    <Page>
      <PageTitle>Outils techniques</PageTitle>
      {connectedUser.isAdmin && (
        <PageTabs>
          <PageTab to={testRoute.to} label="Outils de tests" />
          <PageTab to={adminRoute.to} label="Outils d'administration" />
        </PageTabs>
      )}
      <Outlet />
    </Page>
  )
}
