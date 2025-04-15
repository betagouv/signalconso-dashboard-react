import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import { Button, Checkbox, CircularProgress } from '@mui/material'
import { AccessLevel, CompanyWithAccessAndCounts } from 'core/model'
import { useGetAccessibleByProExtendedQuery } from 'core/queryhooks/companyQueryHooks'
import { useForm, UseFormReturn } from 'react-hook-form'

type FormShape = {
  selectedIds:
    | string[]
    // if there's only one company, react-hook-form will not use an array
    | string
}
type Form = UseFormReturn<FormShape>
export function ProCompaniesSelection() {
  const form = useForm<FormShape>()
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
              form={form}
            />
          )
        },
      )}
      {myCompanies.loneSubsidiaries.map((company) => {
        return <TopLevelRow key={company.company.id} {...{ company, form }} />
      })}
    </div>
  ) : (
    <CircularProgress />
  )
}

function TopLevelRow({
  company,
  secondLevel,
  form,
}: {
  company: CompanyWithAccessAndCounts
  secondLevel?: CompanyWithAccessAndCounts[]
  form: Form
}) {
  const showSecondLevel = !!secondLevel && secondLevel.length > 0
  return (
    <>
      <RowContent
        {...{ company }}
        isTopLevel={true}
        hasSecondLevel={showSecondLevel}
        form={form}
      />
      {showSecondLevel ? (
        <SecondLevelWrapper {...{ secondLevel, form }} />
      ) : null}
    </>
  )
}

function RowContent({
  company: _company,
  isTopLevel,
  hasSecondLevel,
  form,
}: {
  company: CompanyWithAccessAndCounts
  isTopLevel: boolean
  hasSecondLevel: boolean
  form: Form
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
            <Checkbox
              className="!p-0 "
              value={company.id}
              disabled={notAdmin}
              {...form.register('selectedIds')}
            />
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
  form,
}: {
  secondLevel: CompanyWithAccessAndCounts[]
  form: Form
}) {
  return (
    <div className="ml-15 mt-4 mb-4">
      <div className="flex gap-2 items-center mb-2">
        <h3 className="font-bold text-lg">
          {secondLevel.length} établissements secondaires
        </h3>
        <Button size="small" variant="outlined">
          Sélectionner tous
        </Button>
        <Button size="small" variant="outlined">
          Désélectionner tous
        </Button>
      </div>
      <div className="">
        {secondLevel.map((c) => {
          return (
            <RowContent
              key={c.company.id}
              {...{ company: c }}
              isTopLevel={false}
              hasSecondLevel={false}
              form={form}
            />
          )
        })}
      </div>
    </div>
  )
}
