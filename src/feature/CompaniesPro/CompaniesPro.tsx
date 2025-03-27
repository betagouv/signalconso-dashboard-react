import { Link } from '@tanstack/react-router'
import { CompanyWithAccessAndCounts } from 'core/client/company/Company'
import { useGetAccessibleByProExtendedQuery } from 'core/queryhooks/companyQueryHooks'
import { QuickSmallReportSearchLink } from 'feature/Report/quickSmallLinks'
import { AddressComponent } from 'shared/Address'
import { Page } from 'shared/Page'
import { PageTitle } from 'shared/Page/PageTitle'

export function CompaniesPro() {
  const _companiesAccessibleByPro = useGetAccessibleByProExtendedQuery()

  const data = _companiesAccessibleByPro.data
  return (
    <Page>
      <PageTitle>Mes entreprises</PageTitle>

      {data && (
        <div className="flex flex-col gap-4">
          {data.headOfficesAndSubsidiaries.map(
            ({ headOffice, subsidiaries }) => {
              return (
                <TopLevelRow
                  key={headOffice.company.id}
                  company={headOffice}
                  secondLevel={subsidiaries}
                />
              )
            },
          )}
          {data.loneSubsidiaries.map((company) => {
            return <TopLevelRow key={company.company.id} {...{ company }} />
          })}
        </div>
      )}
    </Page>
  )
}

function TopLevelRow({
  company,
  secondLevel,
}: {
  company: CompanyWithAccessAndCounts
  secondLevel?: CompanyWithAccessAndCounts[]
}) {
  return (
    <div className="">
      <RowContent {...{ company }} />
      {secondLevel && secondLevel.length ? (
        <div className="mt-4 ml-20 flex flex-col gap-4">
          {secondLevel.map((c) => {
            return <SecondLevelRow key={c.company.id} {...{ company: c }} />
          })}
        </div>
      ) : null}
    </div>
  )
}

function SecondLevelRow({ company }: { company: CompanyWithAccessAndCounts }) {
  return <RowContent {...{ company }} />
}

function RowContent({
  company: _company,
}: {
  company: CompanyWithAccessAndCounts
}) {
  const { company, access, reportsCount, directAccessesCount } = _company
  const companyId = company.id
  return (
    <div className="bg-gray-200 p-2 space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <p>
            <Link
              to="/entreprise/$companyId/bilan"
              params={{ companyId }}
              className="text-scbluefrance"
            >
              {company.name}
            </Link>
          </p>
          <p>{company.siret}</p>
        </div>
        <div>
          <AddressComponent address={company.address} />
        </div>
        <div>
          {directAccessesCount === undefined ? (
            '-'
          ) : (
            <Link
              className={`text-scbluefrance`}
              to="/entreprise/$companyId/accesses"
              params={{ companyId }}
            >
              {directAccessesCount} utilisateurs
            </Link>
          )}
        </div>
        <div>
          <QuickSmallReportSearchLink
            reportSearch={{
              companyIds: [company.id],
            }}
            icon={false}
            label={`${reportsCount} signalements`}
          />
        </div>
      </div>
      {company.isHeadOffice && (
        <p className="text-scpurplepop font-bold">
          Siège social. Les utilisateurs de cet établissement ont accès à tous
          ses établissements secondaires
        </p>
      )}
    </div>
  )
}

// function prepareData(data: ProCompaniesExtended) {
//   const { headOfficesAndSubsidiaries, loneSubsidiaries } = data
//   const rows = [
//     ...headOfficesAndSubsidiaries.map(({ headOffice, subsidiaries }) => ({
//       headOffice,
//       subsidiaries,
//     })),
//     ...loneSubsidiaries.map((company) => ({
//       company,
//     })),
//   ]
// }
