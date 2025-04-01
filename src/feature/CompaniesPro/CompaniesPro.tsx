import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Icon,
  styled,
  Switch,
} from '@mui/material'
import { Link } from '@tanstack/react-router'
import { colorBlueFrance } from 'alexlibs/mui-extension/color'
import { CompanyWithAccessAndCounts } from 'core/client/company/Company'
import { useGetAccessibleByProExtendedQuery } from 'core/queryhooks/companyQueryHooks'
import { ReportSearchLink } from 'feature/Report/quickSmallLinks'
import { useState } from 'react'
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
      {secondLevel ? (
        <div className="ml-10">
          <Accordion
            elevation={0}
            disabled={secondLevel.length === 0}
            className="border border-solid border-gray-400 border-t-0 !rounded-t-none"
          >
            <AccordionSummary
              expandIcon={<Icon className=" mr-1">expand_more</Icon>}
              className="!bg-gray-200 font-bold  !flex-row-reverse !flex-gap-20   "
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
  const [checked, setChecked] = useState(false)
  return (
    <div
      className={`space-y-1 ${isTopLevel ? 'bg-white border-gray-400 border px-8 py-6' : 'bg-white p-2'}`}
    >
      <div className="flex gap-4">
        <div className="flex flex-col items-start justify-start">
          <p>
            <Link
              to="/entreprise/$companyId/bilan"
              params={{ companyId }}
              className={`text-scbluefrance ${isTopLevel ? 'font-bold' : ''}`}
            >
              {company.name}
            </Link>
          </p>
          <p>{company.siret}</p>
        </div>
        <div>
          <AddressComponent address={company.address} />
        </div>
        <div className="flex flex-col items-end grow ">
          <ReportSearchLink
            reportSearch={{
              companyIds: [company.id],
            }}
            label={`${reportsCount} signalements`}
          />
          <FormControlLabel
            control={
              <MySwitch
                disabled={false}
                checked={checked}
                onChange={(e) => {
                  setChecked(!checked)
                }}
              />
            }
            labelPlacement="start"
            label={<span className="mr-1">Notifications par email</span>}
          />
          {/* <FormControlLabel
            control={
              <MySwitch disabled={false} checked={false} onChange={(e) => {}} />
            }
            labelPlacement="start"
            label={<span className="">Notifications par email</span>}
          />
          <FormControlLabel
            control={
              <MySwitch disabled={true} checked={true} onChange={(e) => {}} />
            }
            labelPlacement="start"
            label={<span className="">Notifications par email</span>}
          />
          <FormControlLabel
            control={
              <MySwitch disabled={true} checked={false} onChange={(e) => {}} />
            }
            labelPlacement="start"
            label={<span className="">Notifications par email</span>}
          /> */}
        </div>
      </div>
      {directAccessesCount !== undefined && (
        <>
          <div className="flex flex-col items-start justify-start">
            <span>
              <Icon fontSize="medium" className="text-black -mb-1.5 mr-1">
                people
              </Icon>
              <Link
                className={`text-scbluefrance`}
                to="/entreprise/$companyId/accesses"
                params={{ companyId }}
              >
                {directAccessesCount} utilisateurs
              </Link>
            </span>
          </div>
        </>
      )}
      {company.isHeadOffice && (
        <p className="">
          <span className="rounded-md mr-1  text-green-800">
            <Icon fontSize="small" className="mb-[-3px] mr-1">
              business
            </Icon>
            <b className="">Siège social</b>
            <span className="">
              {' '}
              : Les utilisateurs de cet établissement ont accès à tous ses
              établissements secondaires
            </span>
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

const MySwitch = styled(Switch)(({ theme }) => {
  const height = 22
  const width = 38
  // note : the colors are kinda wrong for the disabled state
  // if we need to use it someday we can improve it
  return {
    width,
    height,
    padding: 0,
    display: 'flex',
    '& .MuiSwitch-switchBase': {
      padding: 0,
      '&.Mui-checked': {
        transform: `translateX(${width - height}px)`,
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: colorBlueFrance,
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
      width: height,
      height: height,
      borderRadius: height / 2,
      backgroundColor: 'white',
      border: `1px solid ${colorBlueFrance}`,
    },
    '& .MuiSwitch-track': {
      borderRadius: height / 2,
      border: `1px solid ${colorBlueFrance}`,
      opacity: 1,
      backgroundColor: 'white',
    },
  }
})
