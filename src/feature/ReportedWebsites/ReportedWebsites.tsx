import { Navigate, Routes } from 'react-router'
import { Route } from 'react-router-dom'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useI18n } from '../../core/i18n'
import { relativeToParent, siteMap } from '../../core/siteMap'
import { Page, PageTitle } from '../../shared/Page'
import { PageTab, PageTabs } from '../../shared/Page/PageTabs'
import { ReportedUnknownWebsites } from './ReportedUnknownWebsites'
import { WebsitesInvestigation } from './WebsitesInvestigation'

export const ReportedWebsites = () => {
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
            to={relativeToParent(
              siteMap.logged.reportedWebsites.investigation.value,
            )}
            label={m.websitesInvestigation}
          />
          <PageTab
            to={relativeToParent(siteMap.logged.reportedWebsites.unknown.value)}
            label={m.reportedUnknownWebsites}
          />
        </PageTabs>
      )}

      <Routes>
        {connectedUser.isAdmin ? (
          <Route
            path="*"
            element={
              <Navigate
                replace
                to={relativeToParent(
                  siteMap.logged.reportedWebsites.investigation.value,
                )}
              />
            }
          />
        ) : (
          <Route
            path="*"
            element={
              <Navigate
                replace
                to={relativeToParent(
                  siteMap.logged.reportedWebsites.unknown.value,
                )}
              />
            }
          />
        )}
        <Route
          path={siteMap.logged.reportedWebsites.investigation.value}
          element={<WebsitesInvestigation />}
        />
        <Route
          path={siteMap.logged.reportedWebsites.unknown.value}
          element={<ReportedUnknownWebsites />}
        />
      </Routes>
    </Page>
  )
}
