import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { useI18n } from '../../core/i18n'
import { Page, PageTitle } from '../../shared/Page'
import { PageTab, PageTabs } from '../../shared/Page/PageTabs'
import { Route as enqueteRoute } from './moderation-url-entreprises/enquete'
import { Route as sitesNonIdentifiesRoute } from './moderation-url-entreprises/sites-internet.non-identifies'
import { WebsiteWithCompanySearch } from '../../core/client/website/Website'

export const Route = createFileRoute(
  '/_authenticated/moderation-url-entreprises',
)({
  component: ReportedWebsites,
})

function ReportedWebsites() {
  const { m } = useI18n() // Assuming this hook exists and provides translations
  const { connectedUser } = useConnectedContext() // Assuming this hook provides user state

  return (
    <Page>
      {connectedUser.isAdmin ? (
        <PageTitle>{m.reportedWebsites}</PageTitle>
      ) : (
        <PageTitle>{m.reportedUnknownWebsitesDGCCRF}</PageTitle>
      )}

      {connectedUser.isAdmin && (
        <PageTabs>
          <PageTab
            navigateOptions={{
              to: enqueteRoute.to,
              search: {} as WebsiteWithCompanySearch,
            }}
            label={m.websitesInvestigation}
          />
          <PageTab
            navigateOptions={{ to: sitesNonIdentifiesRoute.to }}
            label={m.reportedUnknownWebsites}
          />
        </PageTabs>
      )}
      <Outlet />
    </Page>
  )
}
