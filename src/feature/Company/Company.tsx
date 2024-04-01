import {Navigate, Route, Routes, useParams} from 'react-router'

import {useLogin} from 'core/context/LoginContext'
import {siteMap} from 'core/siteMap'
import {CompanyAccesses} from 'feature/CompanyAccesses/CompanyAccesses'
import {Page, PageTitle} from 'shared/Page'
import {PageTab, PageTabs} from 'shared/Page/PageTabs'
import {Id} from '../../core/model'
import {useGetCompanyByIdQuery} from '../../core/queryhooks/companyQueryHooks'
import {CompanyStats} from './CompanyStats'
import {CompanyStatsPro} from './CompanyStatsPro'

export function Company() {
  const {id} = useParams<{id: Id}>()

  return (
    <Page>
      {id && (
        <>
          <PageTitle>Entreprise</PageTitle>

          <PageTabs>
            <PageTab to={siteMap.logged.company(id).stats.value} label={'Statistiques'} />
            <PageTab to={siteMap.logged.company(id).accesses.value} label={'Accès utilisateurs'} />
          </PageTabs>

          <Routes>
            <Route path="/*" element={<Navigate replace to={siteMap.logged.company(id).stats.value} />} />
            <Route path={siteMap.logged.company(id).stats.value} element={<CompanyStatsComponent />} />
            <Route path={siteMap.logged.company(id).stats.value} element={<CompanyAccesses />} />
          </Routes>
        </>
      )}
    </Page>
  )
}

const CompanyStatsComponent = () => {
  const {id} = useParams<{id: Id}>()

  const {connectedUser} = useLogin()
  const _companyById = useGetCompanyByIdQuery(id)

  const company = _companyById.data

  return (
    <>
      {id &&
        company &&
        (connectedUser.isPro ? (
          <CompanyStatsPro id={id} connectedUser={connectedUser} company={company} />
        ) : (
          <CompanyStats id={id} connectedUser={connectedUser} company={company} />
        ))}
    </>
  )
}
