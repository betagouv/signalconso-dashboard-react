import { Checkbox, CircularProgress } from '@mui/material'
import { useConnectedContext } from 'core/context/connected/connectedContext'
import { User } from 'core/model'
import { useUsersOfProQuery } from 'core/queryhooks/accessesMassManagementQueryHooks'
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
  const _query = useUsersOfProQuery()
  const data = _query.data
  return data ? (
    <div>
      {data.map((user) => {
        return <RowContent key={user.id} {...{ user, form }} />
      })}
    </div>
  ) : (
    <CircularProgress />
  )
}

function RowContent({ user, form }: { user: User; form: Form }) {
  const { connectedUser } = useConnectedContext()
  const isYou = connectedUser.id === user.id
  return (
    <div
      className={`border ${isYou ? 'bg-gray-100 border-gray-300 text-gray-500' : 'border-gray-400'} border-b-0 last:border-b-1 px-2 py-3`}
    >
      <div className="flex gap-2 items-center">
        <div className={`mx-6 h-fit`}>
          <Checkbox
            className="!p-0 "
            value={user.id}
            disabled={isYou}
            {...form.register('selectedIds')}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className={``}>{user.email}</p>
          <div className="">
            {user.firstName} {user.lastName}
          </div>
        </div>
        {isYou && <p className="text-sm text-right grow"> c'est vous !</p>}
      </div>
    </div>
  )
}
