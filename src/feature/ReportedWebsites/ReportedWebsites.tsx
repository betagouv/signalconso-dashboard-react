import React from 'react'
import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {PageTab, PageTabs} from '../../shared/Layout/Page/PageTabs'
import {ReportedUnknownWebsites} from './ReportedUnknownWebsites'
import {useLogin} from '../../core/context/LoginContext'
import {WebsitesInvestigation} from './WebsitesInvestigation'
import {config} from '../../conf/config'

export const ReportedWebsites = () => {
  const {m} = useI18n()
  const {path} = useRouteMatch()
  const {connectedUser} = useLogin()

  const displayDropShipping: boolean = config.enable_feature_dropshipping || connectedUser.isAdmin

  console.log('////')
  console.log(config.enable_feature_dropshipping)
  console.log('////')

  return (
    <Page size="xl">
      <PageTitle>{m.reportedWebsites}</PageTitle>

      {displayDropShipping ? (
        <PageTabs>
          <PageTab to={siteMap.logged.websitesInvestigation} label={m.websitesInvestigation} />
          <PageTab to={siteMap.logged.reportedWebsites_unknown} label={m.reportedUnknownWebsites} />
        </PageTabs>
      ) : (
        <></>
      )}

      <Switch>
        <Redirect exact from={path} to={siteMap.logged.websitesInvestigation} />
        <Route path={siteMap.logged.websitesInvestigation} component={WebsitesInvestigation} />
        <Route path={siteMap.logged.reportedWebsites_unknown} component={ReportedUnknownWebsites} />
      </Switch>
    </Page>
  )
}
