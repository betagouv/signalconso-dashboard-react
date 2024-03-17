import {Page, PageTitle} from '../../shared/Page'
import {useI18n} from '../../core/i18n'
import React from 'react'
import {Route} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {PageTab, PageTabs} from '../../shared/Page/PageTabs'
import {CompaniesToActivate} from './CompaniesToActivate'
import {CompaniesRegistered} from './CompaniesRegistered'
import {useLogin} from '../../core/context/LoginContext'
import {CompaniesToFollowUp} from './CompaniesToFollowUp'
import {Navigate, Routes} from 'react-router'

export const Companies = () => {
  const {m} = useI18n() // Assuming this hook exists and provides translations
  const {connectedUser} = useLogin() // Assuming this hook provides user state

  return (
    <Page>
      <PageTitle>{m.menu_companies}</PageTitle>
      {connectedUser.isAdmin && (
        <PageTabs>
          <PageTab to={siteMap.logged.companies.registered.value} label={m.companiesActivated} />
          <PageTab to={siteMap.logged.companies.toActivate.value} label={m.companiesToActivate} />
          <PageTab to={siteMap.logged.companies.toFollowUp.value} label={m.companiesToFollowUp} />
        </PageTabs>
      )}
      <Routes>
        <Route path="/*" element={<Navigate replace to={siteMap.logged.companies.registered.value} />} />
        <Route path={siteMap.logged.companies.registered.value} element={<CompaniesRegistered />} />
        <Route path={siteMap.logged.companies.toActivate.value} element={<CompaniesToActivate />} />
        <Route path={siteMap.logged.companies.toFollowUp.value} element={<CompaniesToFollowUp />} />
      </Routes>
    </Page>
  )
}
