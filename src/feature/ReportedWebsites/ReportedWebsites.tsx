import React from 'react'
import {Page, PageTitle} from '../../shared/Page'
import {useI18n} from '../../core/i18n'
import {Route} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {PageTab, PageTabs} from '../../shared/Page/PageTabs'
import {ReportedUnknownWebsites} from './ReportedUnknownWebsites'
import {useLogin} from '../../core/context/LoginContext'
import {WebsitesInvestigation} from './WebsitesInvestigation'
import {Navigate, Routes} from 'react-router'

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
          <PageTab to={siteMap.logged.websitesInvestigation} label={m.websitesInvestigation} />
          <PageTab to={siteMap.logged.reportedWebsites_unknown} label={m.reportedUnknownWebsites} />
        </PageTabs>
      )}

      <Routes>
        {connectedUser.isAdmin ? (
          <Route path="/" element={<Navigate replace to={siteMap.logged.websitesInvestigation} />} />
        ) : (
          <Route path="/" element={<Navigate replace to={siteMap.logged.reportedWebsites_unknown} />} />
        )}
        <Route path={siteMap.logged.websitesInvestigation} element={<WebsitesInvestigation />} />
        <Route path={siteMap.logged.reportedWebsites_unknown} element={<ReportedUnknownWebsites />} />
      </Routes>
    </Page>
  )
}
