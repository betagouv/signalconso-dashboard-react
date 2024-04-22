import {Navigate, Route, Routes, useParams} from 'react-router'

import {Txt} from 'alexlibs/mui-extension'
import {useConnectedContext} from 'core/context/ConnectedContext'
import {siteMap} from 'core/siteMap'
import {CompanyAccesses} from 'feature/CompanyAccesses/CompanyAccesses'
import {Page, PageTitle} from 'shared/Page'
import {PageTab, PageTabs} from 'shared/Page/PageTabs'
import {CompanyWithReportsCount, Id} from '../../core/model'
import {useGetCompanyByIdQuery} from '../../core/queryhooks/companyQueryHooks'
import {CompanyHistory} from './CompanyHistory'
import {CompanyStats} from './CompanyStats'
import {CompanyStatsPro} from './CompanyStatsPro'

export function Company() {
  const {id} = useParams<{id: Id}>()
  return id ? <CompanyWithId {...{id}} /> : null
}

function CompanyWithId({id}: {id: string}) {
  const _companyById = useGetCompanyByIdQuery(id)
  const {connectedUser} = useConnectedContext()
  const company = _companyById.data

  return (
    <Page loading={_companyById.isLoading}>
      {company && <Title {...{company}} />}
      <PageTabs>
        <PageTab to={siteMap.logged.company(id).stats.valueAbsolute} label={'Statistiques'} />
        <PageTab to={siteMap.logged.company(id).accesses.valueAbsolute} label={'Accès utilisateurs'} />
        {connectedUser.isNotPro ? (
          <PageTab to={siteMap.logged.company(id).history.valueAbsolute} label={`Historique de l'entreprise`} />
        ) : undefined}
      </PageTabs>
      <Routes>
        <Route path="/*" element={<Navigate replace to={siteMap.logged.company(id).stats.valueAbsolute} />} />
        <Route path={siteMap.logged.company(id).stats.value} element={<CompanyStatsComponent {...{company}} />} />
        <Route path={siteMap.logged.company(id).accesses.value} element={<CompanyAccesses {...{company}} />} />
        {connectedUser.isNotPro ? (
          <Route path={siteMap.logged.company(id).history.value} element={<CompanyHistory {...{company}} />} />
        ) : undefined}
      </Routes>
    </Page>
  )
}

function Title({company}: {company: CompanyWithReportsCount}) {
  return (
    <PageTitle>
      <div>
        {company.name}
        {company.commercialName && (
          <Txt block size="small">
            {company.commercialName}
          </Txt>
        )}
        {company.brand && (
          <Txt block size="small" fontStyle="italic">
            {company.brand}
          </Txt>
        )}
        {company.establishmentCommercialName && (
          <Txt block size="small" fontStyle="italic">
            {company.establishmentCommercialName}
          </Txt>
        )}
        <Txt block size="big" color="hint">
          {company?.siret}
        </Txt>
      </div>
    </PageTitle>
  )
}

const CompanyStatsComponent = ({company}: {company: CompanyWithReportsCount | undefined}) => {
  const {connectedUser} = useConnectedContext()
  return (
    <>
      {company &&
        (connectedUser.isPro ? (
          <CompanyStatsPro {...{company, connectedUser}} />
        ) : (
          <CompanyStats {...{company, connectedUser}} />
        ))}
    </>
  )
}
