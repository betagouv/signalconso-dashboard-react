import {
  AccessLevel,
  CompanyWithAccessAndCounts,
} from 'core/client/company/Company'
import { useGetAccessibleByProExtendedQuery } from 'core/queryhooks/companyQueryHooks'
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
                  companyWithAccess={headOffice}
                  secondLevel={subsidiaries}
                />
              )
            },
          )}
          {data.loneSubsidiaries.map((companyWithAccess) => {
            return (
              <TopLevelRow
                key={companyWithAccess.company.id}
                {...{ companyWithAccess }}
              />
            )
          })}
        </div>
      )}
    </Page>
  )
}

function TopLevelRow({
  companyWithAccess,
  secondLevel,
}: {
  companyWithAccess: CompanyWithAccessAndCounts
  secondLevel?: CompanyWithAccessAndCounts[]
}) {
  return (
    <div className="">
      <RowContent {...{ companyWithAccess }} />
      {secondLevel && secondLevel.length ? (
        <div className="mt-4 ml-20 flex flex-col gap-4">
          {secondLevel.map((c) => {
            return (
              <SecondLevelRow
                key={c.company.id}
                {...{ companyWithAccess: c }}
              />
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

function SecondLevelRow({
  companyWithAccess,
}: {
  companyWithAccess: CompanyWithAccessAndCounts
}) {
  return <RowContent {...{ companyWithAccess }} />
}

function RowContent({
  companyWithAccess,
}: {
  companyWithAccess: CompanyWithAccessAndCounts
}) {
  return (
    <div className="bg-gray-200 p-2 flex justify-between">
      <div>
        <p>{companyWithAccess.company.name}</p>
        <p>{companyWithAccess.company.siret}</p>
      </div>
      {companyWithAccess.access.level === AccessLevel.ADMIN && <div>Admin</div>}
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
