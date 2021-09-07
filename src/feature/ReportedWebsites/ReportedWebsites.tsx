import React from 'react'
import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {PageTab, PageTabs} from '../../shared/Layout/Page/PageTabs'
import {ReportedUnknownWebsites} from './ReportedUnknownWebsites'
import {ReportedCompaniesWebsites} from './ReportedCompaniesWebsites'
import {useLogin} from '../../core/context/LoginContext'

export const ReportedWebsites = () => {
  const {m} = useI18n()
  const {path} = useRouteMatch()
  const {connectedUser} = useLogin()

  return (
    <Page>
      <PageTitle>{m.reportedWebsites}</PageTitle>

      {connectedUser.isAdmin && (
        <PageTabs>
          <PageTab to={siteMap.reportedCompanyWebsites} label={m.reportedCompaniesWebsites} />
          <PageTab to={siteMap.reportedWebsites_unknown} label={m.reportedUnknownWebsites} />
        </PageTabs>
      )}
      <Switch>
        {connectedUser.isAdmin ? (
          <Redirect exact from={path} to={siteMap.reportedCompanyWebsites} />
        ) : (
          <Redirect exact from={path} to={siteMap.reportedWebsites_unknown} />
        )}
        <Route path={siteMap.reportedCompanyWebsites} component={ReportedCompaniesWebsites} />
        <Route path={siteMap.reportedWebsites_unknown} component={ReportedUnknownWebsites} />
      </Switch>
    </Page>
  )
}
