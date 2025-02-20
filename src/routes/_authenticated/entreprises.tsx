import {createFileRoute, Outlet} from '@tanstack/react-router'
import {useI18n} from "../../core/i18n";
import {useConnectedContext} from "../../core/context/ConnectedContext";
import { Page, PageTitle } from '../../shared/Page'
import { PageTab, PageTabs } from '../../shared/Page/PageTabs'
import { Route as aActiverRoute } from './entreprises/a-activer'
import { Route as aRelancerRoute } from './entreprises/a-relancer'
import { Route as lesPlusSignaleesRoute } from './entreprises/les-plus-signalees'

export const Route = createFileRoute(
  '/_authenticated/entreprises',
)({
  component: Companies,
})

function Companies() {
  const { m } = useI18n() // Assuming this hook exists and provides translations
  const { connectedUser } = useConnectedContext() // Assuming this hook provides user state

  return (
    <Page>
      <PageTitle>{m.menu_companies}</PageTitle>
      {connectedUser.isAdmin && (
        <PageTabs>
          <PageTab
            to={lesPlusSignaleesRoute.to}
            label={m.companiesActivated}
          />
          <PageTab
            to={aActiverRoute.to}
            label={m.companiesToActivate}
          />
          <PageTab
            to={aRelancerRoute.to}
            label={m.companiesToFollowUp}
          />
        </PageTabs>
      )}
      <Outlet />
    </Page>
  )
}
