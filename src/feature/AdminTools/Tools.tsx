import {Page, PageTitle} from '../../shared/Page'
import {PageTab, PageTabs} from '../../shared/Page/PageTabs'
import {siteMap} from '../../core/siteMap'
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom'
import React from 'react'
import {useLogin} from '../../core/context/LoginContext'
import {TestTools} from './TestTools'
import {AdminTools} from './AdminTools'

export const Tools = () => {
  const {connectedUser} = useLogin()
  const {path} = useRouteMatch()

  return (
    <Page>
      <PageTitle>Outils techniques</PageTitle>
      {connectedUser.isAdmin && (
        <PageTabs>
          <PageTab to={siteMap.logged.testTools} label="Outils de tests" />
          <PageTab to={siteMap.logged.adminTools} label="Outils d'administration" />
        </PageTabs>
      )}
      <Switch>
        <Redirect exact from={path} to={siteMap.logged.testTools} />
        <Route path={siteMap.logged.testTools} component={TestTools} />
        <Route path={siteMap.logged.adminTools} component={AdminTools} />
      </Switch>
    </Page>
  )
}
