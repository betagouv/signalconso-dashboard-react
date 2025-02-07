import { Navigate, Routes } from 'react-router'
import { Route } from 'react-router'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useI18n } from '../../core/i18n'
import { relativeToParent, siteMap } from '../../core/siteMap'
import { Page, PageTitle } from '../../shared/Page'
import { PageTab, PageTabs } from '../../shared/Page/PageTabs'
import { CompaniesRegistered } from './CompaniesRegistered'
import { CompaniesToActivate } from './CompaniesToActivate'
import { CompaniesToFollowUp } from './CompaniesToFollowUp'

export const Companies = () => {
  const { m } = useI18n() // Assuming this hook exists and provides translations
  const { connectedUser } = useConnectedContext() // Assuming this hook provides user state

  return (
    <Page>
      <PageTitle>{m.menu_companies}</PageTitle>
      {connectedUser.isAdmin && (
        <PageTabs>
          <PageTab
            to={relativeToParent(siteMap.logged.companies.registered.value)}
            label={m.companiesActivated}
          />
          <PageTab
            to={relativeToParent(siteMap.logged.companies.toActivate.value)}
            label={m.companiesToActivate}
          />
          <PageTab
            to={relativeToParent(siteMap.logged.companies.toFollowUp.value)}
            label={m.companiesToFollowUp}
          />
        </PageTabs>
      )}
      <Routes>
        <Route
          path="*"
          element={
            <Navigate
              replace
              to={relativeToParent(siteMap.logged.companies.registered.value)}
            />
          }
        />
        <Route
          path={siteMap.logged.companies.registered.value}
          element={<CompaniesRegistered />}
        />
        <Route
          path={siteMap.logged.companies.toActivate.value}
          element={<CompaniesToActivate />}
        />
        <Route
          path={siteMap.logged.companies.toFollowUp.value}
          element={<CompaniesToFollowUp />}
        />
      </Routes>
    </Page>
  )
}
