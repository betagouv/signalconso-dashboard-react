import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import { Checkbox, CircularProgress } from '@mui/material'
import { AccessLevel, CompanyWithAccessAndCounts } from 'core/model'
import { useGetAccessibleByProExtendedQuery } from 'core/queryhooks/companyQueryHooks'
import { useForm, UseFormReturn } from 'react-hook-form'

type FormShape = {
  selectedIds:
    | string[]
    // if there's only one user, react-hook-form will not use an array
    | string
}
type Form = UseFormReturn<FormShape>
export function ProUsersSelection() {
  const form = useForm<FormShape>()
  const _companiesAccessibleByPro = useGetAccessibleByProExtendedQuery()
  const myCompanies = _companiesAccessibleByPro.data
  return myCompanies ? (
    <div>
      {myCompanies.headOfficesAndSubsidiaries.map(({ headOffice }) => {
        return (
          <RowContent
            key={headOffice.company.id}
            company={headOffice}
            form={form}
          />
        )
      })}
    </div>
  ) : (
    <CircularProgress />
  )
}

function RowContent({
  company: _company,
  form,
}: {
  company: CompanyWithAccessAndCounts
  form: Form
}) {
  const { company, access } = _company
  const notAdmin = access.level !== AccessLevel.ADMIN
  return (
    <div
      className={`border ${notAdmin ? 'bg-gray-100 border-gray-300 text-gray-500' : 'border-gray-400'} border-b-0 last:border-b-1 px-2 py-3`}
    >
      <div className="flex gap-2 justify-between">
        <div className="flex gap-2">
          <div className={`mx-6`}>
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
