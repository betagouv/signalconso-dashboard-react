import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import { Button, Checkbox, CircularProgress } from '@mui/material'
import { AccessLevel, CompanyWithAccessAndCounts } from 'core/model'
import { useGetAccessibleByProExtendedQuery } from 'core/queryhooks/companyQueryHooks'
import { Page, PageTitle } from 'shared/Page'
import { CleanDiscreetPanel } from 'shared/Panel/simplePanels'

export function AccessesManagementPro() {
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

        <ProCompaniesSelection />
        <h2 className="font-bold text-2xl">
          Sélectionner un ou plusieurs utilisateurs
        </h2>
      </div>
    </Page>
  )
}

function ProCompaniesSelection() {
  const _companiesAccessibleByPro = useGetAccessibleByProExtendedQuery()
  const myCompanies = _companiesAccessibleByPro.data
  return myCompanies ? (
    <div>
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
  const { company, access } = _company
  const notAdmin = access.level !== AccessLevel.ADMIN
  return (
    <div
      className={`border ${notAdmin ? 'bg-gray-100 border-gray-300 text-gray-500' : 'border-gray-400'} border-b-0 last:border-b-1 ${hasSecondLevel ? 'border-b-1' : ''} ${isTopLevel ? 'px-2 py-3' : 'p-1 py-2'}`}
    >
      <div className="flex gap-2 justify-between">
        <div className="flex gap-2">
          <div className={`${isTopLevel ? 'mx-6' : 'mx-2'}`}>
            <Checkbox className="!p-0 " disabled={notAdmin} />
          </div>
          <p className={`w-34`}>{company.siret}</p>
          <div className="">
            {company.name}
            {company.isHeadOffice ? (
              <span className="text-green-800 text-sm"> Siège social</span>
            ) : null}
          </div>
        </div>
        {notAdmin && (
          <span className="text-sm"> vous n'êtes pas administrateur</span>
        )}
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
          return (
            <RowContent
              {...{ company: c }}
              isTopLevel={false}
              hasSecondLevel={false}
            />
          )
        })}
      </div>
    </div>
  )
}
