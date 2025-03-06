import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { useI18n } from '../../core/i18n'
import { Page, PageTitle } from '../../shared/Page'
import { PageTab, PageTabs } from '../../shared/Page/PageTabs'
import { Route as aActiverRoute } from './entreprises/a-activer'
import { Route as aRelancerRoute } from './entreprises/a-relancer'
import { Route as lesPlusSignaleesRoute } from './entreprises/les-plus-signalees'

export const Route = createFileRoute('/_authenticated/entreprises')({
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
            navigateOptions={{
              to: lesPlusSignaleesRoute.to,
              search: { offset: 0, limit: 25 },
            }}
            label={m.companiesActivated}
          />
          <PageTab
            navigateOptions={{ to: aActiverRoute.to }}
            label={m.companiesToActivate}
          />
          <PageTab
            navigateOptions={{ to: aRelancerRoute.to }}
            label={m.companiesToFollowUp}
          />
        </PageTabs>
      )}
      <Outlet />
    </Page>
  )
}
