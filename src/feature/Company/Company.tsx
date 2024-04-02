import {Navigate, Route, Routes, useParams} from 'react-router'

import {useLogin} from 'core/context/LoginContext'
import {siteMap} from 'core/siteMap'
import {CompanyAccesses} from 'feature/CompanyAccesses/CompanyAccesses'
import {Page, PageTitle} from 'shared/Page'
import {PageTab, PageTabs} from 'shared/Page/PageTabs'
import {CompanyWithReportsCount, Id} from '../../core/model'
import {useGetCompanyByIdQuery} from '../../core/queryhooks/companyQueryHooks'
import {CompanyStats} from './CompanyStats'
import {CompanyStatsPro} from './CompanyStatsPro'
import {Txt} from 'alexlibs/mui-extension'

export function Company() {
  const {id} = useParams<{id: Id}>()
  return id ? <CompanyWithId {...{id}} /> : null
}

function CompanyWithId({id}: {id: string}) {
  const _companyById = useGetCompanyByIdQuery(id)
  const company = _companyById.data
  return (
    <Page loading={_companyById.isLoading}>
      {company && <Title {...{company}} />}
      <PageTabs>
        <PageTab to={siteMap.logged.company(id).stats.valueAbsolute} label={'Statistiques'} />
        <PageTab to={siteMap.logged.company(id).accesses.valueAbsolute} label={'Accès utilisateurs'} />
      </PageTabs>
      <Routes>
        <Route path="/*" element={<Navigate replace to={siteMap.logged.company(id).stats.valueAbsolute} />} />
        <Route path={siteMap.logged.company(id).stats.value} element={<CompanyStatsComponent {...{company}} />} />
        <Route path={siteMap.logged.company(id).accesses.value} element={<CompanyAccesses {...{company}} />} />
      </Routes>
    </Page>
  )
}

function Title({company}: {company: CompanyWithReportsCount}) {
  return (
    <PageTitle>
      <div>
        {company.name}
        {company.brand && (
          <Txt block size="small" fontStyle="italic">
            {company.brand}
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
  const {connectedUser} = useLogin()
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
