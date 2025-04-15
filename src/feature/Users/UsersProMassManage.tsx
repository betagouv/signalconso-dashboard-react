import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import { Button, Checkbox, CircularProgress } from '@mui/material'
import { Link } from '@tanstack/react-router'
import {
  CompanyWithAccessAndCounts,
  flattenProCompaniesExtended,
} from 'core/model'
import { useGetAccessibleByProExtendedQuery } from 'core/queryhooks/companyQueryHooks'
import { Page, PageTitle } from 'shared/Page'
import { CleanDiscreetPanel } from 'shared/Panel/simplePanels'

export function AccessesManagementPro() {
  const _companiesAccessibleByPro = useGetAccessibleByProExtendedQuery()
  const myCompanies = _companiesAccessibleByPro.data
  const allCompaniesIds =
    (myCompanies &&
      flattenProCompaniesExtended(myCompanies).map((_) => _.company.id)) ??
    []

  return (
    <Page>
      <PageTitle>Gestion des accès</PageTitle>
      <p className="mb-8">
        Cette page vous permet d'ajouter, supprimer, ou modifier les accès de{' '}
        <b>un ou plusieurs utilisateurs</b> à{' '}
        <b>une ou plusieurs entreprises</b>, en quelques clics.
      </p>

      <div className="space-y-2">
        <h2 className="font-bold text-2xl">Que voulez-vous faire ?</h2>
        <div className="flex gap-2">
          <CleanDiscreetPanel>Retirer des accès</CleanDiscreetPanel>
          <CleanDiscreetPanel>Ajouter ou modifier des accès</CleanDiscreetPanel>
        </div>
        <h2 className="font-bold text-2xl">
          Sélectionner une ou plusieurs entreprises
        </h2>
        <div className="">
          {myCompanies ? (
            <div className="">
              {myCompanies.headOfficesAndSubsidiaries.map(
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
              {myCompanies.loneSubsidiaries.map((company) => {
                return <TopLevelRow key={company.company.id} {...{ company }} />
              })}
            </div>
          ) : (
            <CircularProgress />
          )}
        </div>
        <h2 className="font-bold text-2xl">
          Sélectionner un ou plusieurs utilisateurs
        </h2>
      </div>
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
  const showSecondLevel = !!secondLevel && secondLevel.length > 0
  return (
    <>
      <RowContent
        {...{ company }}
        isTopLevel={true}
        hasSecondLevel={showSecondLevel}
      />
      {showSecondLevel ? <SecondLevelWrapper {...{ secondLevel }} /> : null}
    </>
  )
}

function RowContent({
  company: _company,
  isTopLevel,
  hasSecondLevel,
}: {
  company: CompanyWithAccessAndCounts
  isTopLevel: boolean
  hasSecondLevel: boolean
}) {
  const { company } = _company
  const companyId = company.id

  return (
    <div
      className={`border border-gray-400 border-b-0 last:border-b-1 ${hasSecondLevel ? 'border-b-1' : ''} ${isTopLevel ? 'p-1 py-3' : 'p-1 py-2'}`}
    >
      <div className="flex gap-2 justify-between">
        <div className="flex gap-2">
          <div className="">
            <Checkbox className="!p-0 " />
          </div>
          <p className="w-34">{company.siret}</p>
          <div className="">
            <Link
              to="/entreprise/$companyId/bilan"
              params={{ companyId }}
              className={`text-scbluefrance`}
            >
              {company.name}
            </Link>
            {company.isHeadOffice ? ' (siège social)' : null}
          </div>
        </div>
        <div className="">
          <PlaceOutlinedIcon className="!text-[1.1em] -mt-0.5" />

          {company.address.postalCode}
        </div>
      </div>
    </div>
  )
}

function SecondLevelWrapper({
  secondLevel,
}: {
  secondLevel: CompanyWithAccessAndCounts[]
}) {
  return (
    <div className="ml-15 mt-2 mb-4">
      <div className="flex gap-2 items-center mb-2">
        <span className="">
          {secondLevel.length} établissements secondaires
        </span>
        <Button size="small" variant="outlined">
          Sélectionner tous
        </Button>
        <Button size="small" variant="outlined">
          Désélectionner tous
        </Button>
      </div>
      <div className="">
        {secondLevel.map((c, idx) => {
          return <RowContent {...{ company: c }} isTopLevel={false} />
        })}
      </div>
    </div>
  )
}
