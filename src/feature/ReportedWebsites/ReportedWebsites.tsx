import {Navigate, Routes} from 'react-router'
import {Route} from 'react-router-dom'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {siteMap} from '../../core/siteMap'
import {Page, PageTitle} from '../../shared/Page'
import {PageTab, PageTabs} from '../../shared/Page/PageTabs'
import {ReportedUnknownWebsites} from './ReportedUnknownWebsites'
import {WebsitesInvestigation} from './WebsitesInvestigation'

export const ReportedWebsites = () => {
  const {m} = useI18n() // Assuming this hook exists and provides translations
  const {connectedUser} = useLogin() // Assuming this hook provides user state

  return (
    <Page>
      {connectedUser.isAdmin ? (
        <PageTitle>{m.reportedWebsites}</PageTitle>
      ) : (
        <PageTitle>{m.reportedUnknownWebsitesDGCCRF}</PageTitle>
      )}

      {connectedUser.isAdmin && (
        <PageTabs>
          <PageTab to={siteMap.logged.reportedWebsites.investigation.value} label={m.websitesInvestigation} />
          <PageTab to={siteMap.logged.reportedWebsites.unknown.value} label={m.reportedUnknownWebsites} />
        </PageTabs>
      )}

      <Routes>
        {connectedUser.isAdmin ? (
          <Route path="/*" element={<Navigate replace to={siteMap.logged.reportedWebsites.investigation.value} />} />
        ) : (
          <Route path="/*" element={<Navigate replace to={siteMap.logged.reportedWebsites.unknown.value} />} />
        )}
        <Route path={siteMap.logged.reportedWebsites.investigation.value} element={<WebsitesInvestigation />} />
        <Route path={siteMap.logged.reportedWebsites.unknown.value} element={<ReportedUnknownWebsites />} />
      </Routes>
    </Page>
  )
}
