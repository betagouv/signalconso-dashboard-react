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
          <PageTab to={siteMap.logged.tools.test.value} label="Outils de tests" />
          <PageTab to={siteMap.logged.tools.admin.value} label="Outils d'administration" />
        </PageTabs>
      )}
      <Routes>
        <Route path="/*" element={<Navigate replace to={siteMap.logged.tools.test.value} />} />
        <Route path={siteMap.logged.tools.test.value} element={<TestTools />} />
        <Route path={siteMap.logged.tools.admin.value} element={<AdminTools />} />
      </Routes>
    </Page>
  )
}
