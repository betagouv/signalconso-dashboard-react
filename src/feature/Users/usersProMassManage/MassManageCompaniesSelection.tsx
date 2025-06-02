import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import { Checkbox } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useApiContext } from 'core/context/ApiContext'
import {
  AccessLevel,
  CompanyWithAccess,
  flattenProCompanies,
  ProCompanies,
} from 'core/model'
import { Controller, useForm, UseFormReturn } from 'react-hook-form'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import {
  MassManageNextButton,
  MassManageTinyButton,
} from './usersProMassManageTinyComponents'
import { MassManageInputs } from './usersProMassManagementConstants'
type FormShape = {
  selection: { [id: string]: boolean }
}
type Form = UseFormReturn<FormShape>

type OnSubmit = (selectedCompaniesIds: string[]) => void

export function MassManageCompaniesSelection({
  choices,
  onSubmit,
}: {
  choices: MassManageInputs
  onSubmit: OnSubmit
}) {
  const { api } = useApiContext()
  const _query = useQuery({
    queryKey: ['accessesMassManagement_getCompaniesOfPro'],
    queryFn: () =>
      api.secured.accessesMassManagement.getMassManagementCompanies(),
  })
  const data = _query.data
  return (
    <CleanInvisiblePanel loading={_query.isLoading}>
      {data ? <Loaded {...{ data, onSubmit, choices }} /> : null}
    </CleanInvisiblePanel>
  )
}

function Loaded({
  data,
  onSubmit,
  choices,
}: {
  data: ProCompanies
  onSubmit: OnSubmit
  choices: MassManageInputs
}) {
  const allIds = flattenProCompanies(data).map((_) => _.company.id)
  const form = useForm<FormShape>({
    defaultValues: {
      selection: Object.fromEntries(
        allIds.map((id) => [id, choices.companiesIds.includes(id)]),
      ),
    },
  })
  const isAtLeastOneSelected = Object.values(form.watch('selection')).some(
    (_) => _,
  )
  const selectableIds = flattenProCompanies(data)
    .filter((c) => !shouldBeDisabled(c))
    .map((c) => c.company.id)
  return (
    <>
      <p className="mb-2">Sélectionnez une ou plusieurs entreprises :</p>
      <div className="bg-gray-100 py-2 px-4 mb-4">
        <div className="flex gap-2 items-end justify-between mb-2">
          <div className="flex flex-col lg:flex-row gap-2 h-fit">
            <MassManageTinyButton
              label="Sélectionner tous"
              onClick={() => {
                selectableIds?.forEach((id) => {
                  form.setValue(`selection.${id}`, true)
                })
              }}
            />
            <MassManageTinyButton
              label="Désélectionner tous"
              onClick={() => {
                selectableIds?.forEach((id) => {
                  form.setValue(`selection.${id}`, false)
                })
              }}
            />
          </div>
        </div>
        {data.headOfficesAndSubsidiaries.map(({ headOffice, subsidiaries }) => {
          return (
            <TopLevelRow
              key={headOffice.company.id}
              company={headOffice}
              secondLevel={subsidiaries}
              form={form}
            />
          )
        })}
        {data.loneSubsidiaries.map((company) => {
          return <TopLevelRow key={company.company.id} {...{ company, form }} />
        })}
      </div>
      <MassManageNextButton
        disabled={!isAtLeastOneSelected}
        onClick={form.handleSubmit(({ selection }) => {
          onSubmit(
            Object.entries(selection)
              .filter(([_, selected]) => selected)
              .map(([id]) => id),
          )
        })}
      />
    </>
  )
}

function TopLevelRow({
  company,
  secondLevel,
  form,
}: {
  company: CompanyWithAccess
  secondLevel?: CompanyWithAccess[]
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

function SecondLevelWrapper({
  secondLevel,
  form,
}: {
  secondLevel: CompanyWithAccess[]
  form: Form
}) {
  const selectableIds = secondLevel
    .filter((c) => !shouldBeDisabled(c))
    .map((c) => c.company.id)

  return (
    <div className="ml-15 mt-4 mb-4">
      <div className="flex items-start flex-col lg:flex-row gap-2 lg:items-center mb-2">
        <h3 className=" font-bold text-lg">
          {secondLevel.length} établissements secondaires
        </h3>
        <MassManageTinyButton
          label="Sélectionner tous"
          onClick={() => {
            selectableIds.forEach((id) => {
              form.setValue(`selection.${id}`, true)
            })
          }}
        />
        <MassManageTinyButton
          label="Désélectionner tous"
          onClick={() => {
            selectableIds.forEach((id) => {
              form.setValue(`selection.${id}`, false)
            })
          }}
        />
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

function RowContent({
  company: companyWithAccess,
  isTopLevel,
  hasSecondLevel,
  form,
}: {
  company: CompanyWithAccess
  isTopLevel: boolean
  hasSecondLevel: boolean
  form: Form
}) {
  const { company } = companyWithAccess
  const disabled = shouldBeDisabled(companyWithAccess)
  return (
    <div
      className={`border-t ${disabled ? 'bg-gray-100 border-gray-300 text-gray-500 border-x' : 'bg-white border-gray-400 '} last:border-b ${hasSecondLevel ? 'border-b' : ''} ${isTopLevel ? 'px-2 py-3' : 'p-1 py-2'}`}
    >
      <div className="flex gap-2 justify-between">
        <div className={` ${isTopLevel ? 'mx-6' : 'mx-2'}`}>
          <Controller
            control={form.control}
            name={`selection.${company.id}`}
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Checkbox
                  className="p-0! "
                  disabled={disabled}
                  checked={value}
                  {...{ onBlur, onChange }}
                  slotProps={{ input: { ref } }}
                />
              )
            }}
          />
        </div>
        <div className="grow lg:contents">
          <p className={`w-34`}>{company.siret}</p>
          <div className="grow">
            {company.name}
            {company.isHeadOffice ? (
              <span className="text-green-800 text-sm"> Siège social</span>
            ) : null}
          </div>
          {disabled && (
            <span className="text-sm grow">
              {' '}
              vous n'êtes pas administrateur
            </span>
          )}
          <div className="">
            <PlaceOutlinedIcon className="text-[1.1em]! -mt-0.5" />
            {company.address.postalCode}
          </div>
        </div>
      </div>
    </div>
  )
}

function shouldBeDisabled(c: CompanyWithAccess) {
  return c.access.level !== AccessLevel.ADMIN
}
