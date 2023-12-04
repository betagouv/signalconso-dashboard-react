import React from 'react'
import {Page, PageTitle} from '../../shared/Page'
import {useI18n} from '../../core/i18n'
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {PageTab, PageTabs} from '../../shared/Page/PageTabs'
import {ReportedUnknownWebsites} from './ReportedUnknownWebsites'
import {useLogin} from '../../core/context/LoginContext'
import {WebsitesInvestigation} from './WebsitesInvestigation'

export const ReportedWebsites = () => {
  const {m} = useI18n()
  const {path} = useRouteMatch()
  const {connectedUser} = useLogin()

  return (
    <Page size="xl">
      {connectedUser.isAdmin ? (
        <PageTitle>{m.reportedWebsites}</PageTitle>
      ) : (
        <PageTitle>{m.reportedUnknownWebsitesDGCCRF}</PageTitle>
      )}

      {connectedUser.isAdmin ? (
        <PageTabs>
          <PageTab to={siteMap.logged.websitesInvestigation} label={m.websitesInvestigation} />
          <PageTab to={siteMap.logged.reportedWebsites_unknown} label={m.reportedUnknownWebsites} />
        </PageTabs>
      ) : (
        <></>
      )}

      <Switch>
        {connectedUser.isAdmin ? (
          <Redirect exact from={path} to={siteMap.logged.websitesInvestigation} />
        ) : (
          <Redirect exact from={path} to={siteMap.logged.reportedWebsites_unknown} />
        )}
        <Route path={siteMap.logged.websitesInvestigation} component={WebsitesInvestigation} />
        <Route path={siteMap.logged.reportedWebsites_unknown} component={ReportedUnknownWebsites} />
      </Switch>
    </Page>
  )
}
