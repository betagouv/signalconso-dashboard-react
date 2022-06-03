import React from 'react'
import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {PageTab, PageTabs} from '../../shared/Layout/Page/PageTabs'
import {ReportedUnknownWebsites} from './ReportedUnknownWebsites'
import {ReportedCompaniesWebsites} from './ReportedCompaniesWebsites'
import {useLogin} from '../../core/context/LoginContext'
import {WebsitesInvestigation} from './WebsitesInvestigation'

export const ReportedWebsites = () => {
  const {m} = useI18n()
  const {path} = useRouteMatch()
  const {connectedUser} = useLogin()

  return (
    <Page>
      <PageTitle>{m.reportedWebsites}</PageTitle>

      {connectedUser.isAdmin && (
        <PageTabs>
          <PageTab to={siteMap.logged.reportedWebsites_association} label={m.reportedCompaniesWebsites} />
          <PageTab to={siteMap.logged.reportedWebsites_unknown} label={m.reportedUnknownWebsites} />
        </PageTabs>
      )}

      {connectedUser.isDGCCRF && (
        <PageTabs>
          <PageTab to={siteMap.logged.websitesInvestigation} label={m.websitesInvestigation} />
          <PageTab to={siteMap.logged.reportedWebsites_unknown} label={m.reportedUnknownWebsites} />
        </PageTabs>
      )}

      <Switch>
        {connectedUser.isAdmin ? (
          <Redirect exact from={path} to={siteMap.logged.reportedWebsites_association} />
        ) : (
          <Redirect exact from={path} to={siteMap.logged.websitesInvestigation} />
        )}
        <Route path={siteMap.logged.reportedWebsites_association} component={ReportedCompaniesWebsites} />
        <Route path={siteMap.logged.reportedWebsites_unknown} component={ReportedUnknownWebsites} />
        <Route path={siteMap.logged.websitesInvestigation} component={WebsitesInvestigation} />
      </Switch>
    </Page>
  )
}
