import { Navigate, Route, Routes, useParams } from 'react-router'

import { Icon } from '@mui/material'
import { Txt } from 'alexlibs/mui-extension'
import { useConnectedContext } from 'core/context/ConnectedContext'
import { siteMap } from 'core/siteMap'
import { CompanyAccesses } from 'feature/CompanyAccesses/CompanyAccesses'
import { AlbertActivityLabel } from 'shared/AlbertActivityLabel'
import { Page, PageTitle } from 'shared/Page'
import { PageTab, PageTabs } from 'shared/Page/PageTabs'
import { Alert } from '../../alexlibs/mui-extension'
import { CompanyWithReportsCount, Id } from '../../core/model'
import {
  useGetCompanyByIdQuery,
  useIsAllowedToManageCompanyAccessesQuery,
} from '../../core/queryhooks/companyQueryHooks'
import { CompanyHistory } from './CompanyHistory'
import { CompanyStats } from './CompanyStats'
import { CompanyStatsPro } from './CompanyStatsPro'

export function Company() {
  const { id } = useParams<{ id: Id }>()
  return id ? <CompanyWithId {...{ id }} /> : null
}

function CompanyWithId({ id }: { id: string }) {
  const _companyById = useGetCompanyByIdQuery(id)
  const { connectedUser } = useConnectedContext()
  const withCompanyAccessesTab =
    useIsAllowedToManageCompanyAccessesQuery(id) ?? false
  const company = _companyById.data

  return (
    <Page loading={_companyById.isLoading}>
      {company && <Title {...{ company }} />}
      <PageTabs>
        <PageTab
          to={siteMap.logged.company(id).stats.valueAbsolute}
          label={'Statistiques'}
        />
        {withCompanyAccessesTab ? (
          <PageTab
            to={siteMap.logged.company(id).accesses.valueAbsolute}
            label={'Accès utilisateurs'}
          />
        ) : (
          <></>
        )}
        {connectedUser.isNotPro ? (
          <PageTab
            to={siteMap.logged.company(id).history.valueAbsolute}
            label={`Historique de l'entreprise`}
          />
        ) : undefined}
      </PageTabs>
      <Routes>
        <Route
          path="/*"
          element={
            <Navigate
              replace
              to={siteMap.logged.company(id).stats.valueAbsolute}
            />
          }
        />
        <Route
          path={siteMap.logged.company(id).stats.value}
          element={<CompanyStatsComponent {...{ company }} />}
        />
        {withCompanyAccessesTab && (
          <Route
            path={siteMap.logged.company(id).accesses.value}
            element={<CompanyAccesses {...{ company }} />}
          />
        )}
        {connectedUser.isNotPro ? (
          <Route
            path={siteMap.logged.company(id).history.value}
            element={<CompanyHistory {...{ company }} />}
          />
        ) : undefined}
      </Routes>
    </Page>
  )
}

function Title({ company }: { company: CompanyWithReportsCount }) {
  return (
    <div className="xl:flex gap-8 items-start justify-start">
      <div className="grow">
        <PageTitle>
          <div>
            {company.name}
            {company.albertActivityLabel && (
              <AlbertActivityLabel>
                {company.albertActivityLabel}
              </AlbertActivityLabel>
            )}
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
            {company.isHeadOffice && (
              <div className="font-normal text-sm">
                <Icon fontSize="small" className="mb-[-4px]">
                  business
                </Icon>{' '}
                Siège social
              </div>
            )}
          </div>
        </PageTitle>
      </div>
      <div className="xl:max-w-lg">
        <AnnuaireDesEntreprisesBanner />
      </div>
    </div>
  )
}

const CompanyStatsComponent = ({
  company,
}: {
  company: CompanyWithReportsCount | undefined
}) => {
  const { connectedUser } = useConnectedContext()
  return (
    <>
      {company &&
        (connectedUser.isPro ? (
          <CompanyStatsPro {...{ company, connectedUser }} />
        ) : (
          <CompanyStats {...{ company, connectedUser }} />
        ))}
    </>
  )
}

function AnnuaireDesEntreprisesBanner() {
  const { connectedUser } = useConnectedContext()
  if (connectedUser.isNotPro) {
    return (
      <Alert type="info">
        Connectez-vous sur{' '}
        <a
          href={'https://annuaire-entreprises.data.gouv.fr/lp/agent-public'}
          target="_blank"
          rel="noreferrer"
        >
          l'Annuaire des Entreprises
        </a>{' '}
        pour accéder aux informations protégées des entreprises (non
        diffusibles, statuts, actes, bilans financiers).
      </Alert>
    )
  }
  return null
}
