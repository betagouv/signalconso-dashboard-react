import { Checkbox } from '@mui/material'
import { useConnectedContext } from 'core/context/connected/connectedContext'
import { User } from 'core/model'
import { useUsersOfProQuery } from 'core/queryhooks/accessesMassManagementQueryHooks'
import { Controller, useForm, UseFormReturn } from 'react-hook-form'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'

type FormShape = {
  selection: { [id: string]: boolean }
}
type Form = UseFormReturn<FormShape>

export function ProUsersSelection() {
  const form = useForm<FormShape>()
  const _query = useUsersOfProQuery()
  const data = _query.data
  return (
    <CleanInvisiblePanel loading={_query.isLoading}>
      {data ? <Loaded {...{ data }} /> : null}
    </CleanInvisiblePanel>
  )
}

function Loaded({ data }: { data: User[] }) {
  const allIds = data.map((_) => _.id)
  const form = useForm<FormShape>({
    defaultValues: {
      selection: Object.fromEntries(allIds.map((_) => [_, false])),
    },
  })
  console.log('@@@', form.watch('selection'))
  return (
    <div>
      {data.map((user) => {
        return <RowContent key={user.id} user={user} form={form} />
      })}
    </div>
  )
}

function RowContent({ user, form }: { user: User; form: Form }) {
  const { connectedUser } = useConnectedContext()
  const disabled = connectedUser.id === user.id
  return (
    <div
      className={`border ${disabled ? 'bg-gray-100 border-gray-300 text-gray-500' : 'border-gray-400'} border-b-0 last:border-b-1 px-2 py-3`}
    >
      <div className="flex gap-2 items-center">
        <div className={`mx-6 h-fit`}>
          <Controller
            control={form.control}
            name={`selection.${user.id}`}
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Checkbox
                  className="!p-0 "
                  disabled={disabled}
                  checked={value}
                  {...{ onBlur, onChange }}
                  slotProps={{ input: { ref } }}
                />
              )
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p>{user.email}</p>
          <div className="">
            {user.firstName} {user.lastName}
          </div>
        </div>
        {disabled && <p className="text-sm text-right grow"> c'est vous !</p>}
      </div>
    </div>
  )
}
