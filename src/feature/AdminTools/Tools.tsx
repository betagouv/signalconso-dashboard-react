import {Page, PageTitle} from '../../shared/Page'
import {PageTab, PageTabs} from '../../shared/Page/PageTabs'
import {siteMap} from '../../core/siteMap'
import {Route} from 'react-router-dom'
import React from 'react'
import {useLogin} from '../../core/context/LoginContext'
import {TestTools} from './TestTools'
import {AdminTools} from './AdminTools'
import {Navigate, Routes} from 'react-router'

export const Tools = () => {
  const {connectedUser} = useLogin()

  return (
    <Page>
      <PageTitle>Outils techniques</PageTitle>
      {connectedUser.isAdmin && (
        <PageTabs>
          <PageTab to={siteMap.logged.testTools} label="Outils de tests" />
          <PageTab to={siteMap.logged.adminTools} label="Outils d'administration" />
        </PageTabs>
      )}
      <Routes>
        {/*<Redirect exact from={match.path} to={siteMap.logged.testTools} />*/}
        <Navigate to={siteMap.logged.testTools} replace />
        <Route path={siteMap.logged.testTools}>
          <TestTools />
        </Route>
        <Route path={siteMap.logged.adminTools}>
          <AdminTools />
        </Route>
      </Routes>
    </Page>
  )
}
