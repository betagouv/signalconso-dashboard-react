import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Icon,
} from '@mui/material'
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
        <div className="flex flex-col gap-8">
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
      <RowContent {...{ company }} isTopLevel={true} />
      {secondLevel && secondLevel.length ? (
        <div className="ml-20 ">
          <Accordion
            elevation={0}
            className=" border border-solid border-scbluefrance border-t-0 !rounded-t-none"
          >
            <AccordionSummary
              expandIcon={
                <Icon className="text-scbluefrance mr-1">expand_more</Icon>
              }
              className="font-bold !text-scbluefrance !flex-row-reverse !flex-gap-20"
            >
              {secondLevel.length} établissements secondaires
            </AccordionSummary>
            <AccordionDetails>
              <div className="divide-y divide-gray-300">
                {secondLevel.map((c) => {
                  return (
                    <SecondLevelRow key={c.company.id} {...{ company: c }} />
                  )
                })}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      ) : null}
    </div>
  )
}

function SecondLevelRow({ company }: { company: CompanyWithAccessAndCounts }) {
  return <RowContent {...{ company }} isTopLevel={false} />
}

function RowContent({
  company: _company,
  isTopLevel,
}: {
  company: CompanyWithAccessAndCounts
  isTopLevel: boolean
}) {
  const { company, access, reportsCount, directAccessesCount } = _company
  const companyId = company.id
  return (
    <div
      className={`space-y-4 ${isTopLevel ? 'bg-gray-200 px-8 py-6' : 'bg-white p-2'}`}
    >
      <div className="grid grid-cols-4">
        <div>
          <p>
            <Link
              to="/entreprise/$companyId/bilan"
              params={{ companyId }}
              className="text-scbluefrance font-bold"
            >
              {company.name}
            </Link>
          </p>
          <p>{company.siret}</p>
        </div>
        <div>
          <AddressComponent address={company.address} />
        </div>
        <div className="flex flex-col items-end">
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
        <div className="flex flex-col items-end">
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
        <p className="">
          <span className="bg-blue-200 px-1 mr-1 rounded-md text-blue-800">
            <Icon fontSize="small" className="mb-[-3px] mr-1">
              business
            </Icon>
            <b className="mr-2">Siège social</b>
          </span>
          <span className="">
            Les utilisateurs de cet établissement ont accès à tous ses
            établissements secondaires
          </span>
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
