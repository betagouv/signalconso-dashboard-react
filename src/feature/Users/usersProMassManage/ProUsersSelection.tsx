import { Button, Checkbox } from '@mui/material'
import { useConnectedContext } from 'core/context/connected/connectedContext'
import { User } from 'core/model'
import { useUsersOfProQuery } from 'core/queryhooks/accessesMassManagementQueryHooks'
import { SetStateAction, useState } from 'react'
import { Controller, useForm, UseFormReturn } from 'react-hook-form'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { TinyButton } from './usersProMassManageTinyComponents'

type FormShape = {
  selection: { [id: string]: boolean }
}
type Form = UseFormReturn<FormShape>

type RowData =
  | {
      kind: 'to_invite'
      email: string
    }
  | {
      kind: 'actual_user'
      user: User
    }

export function ProUsersSelection() {
  const _query = useUsersOfProQuery()
  const data = _query.data
  return (
    <CleanInvisiblePanel loading={_query.isLoading}>
      {data ? <Loaded {...{ data }} /> : null}
    </CleanInvisiblePanel>
  )
}

function Loaded({ data }: { data: User[] }) {
  const { connectedUser } = useConnectedContext()
  const [usersToInvite, setUsersToInvite] = useState<string[]>([
    'george@gmail.com',
    'walalla@gmail.com',
  ])
  const allIds = data.map((_) => _.id)
  const form = useForm<FormShape>({
    defaultValues: {
      selection: Object.fromEntries(allIds.map((_) => [_, false])),
    },
  })
  const selectableIds = data
    .filter((c) => !shouldBeDisabled(c, connectedUser))
    .map((c) => c.id)
  return (
    <>
      <p className="mb-4">Sélectionnez un ou plusieurs utilisateurs :</p>
      <div className="bg-gray-100 py-2 px-4">
        <div className="flex gap-2 items-end justify-between mb-2">
          <div className="flex gap-2 h-fit">
            <TinyButton
              label="Sélectionner tous"
              onClick={() => {
                selectableIds?.forEach((id) => {
                  form.setValue(`selection.${id}`, true)
                })
              }}
            />
            <TinyButton
              label="Désélectionner tous"
              onClick={() => {
                selectableIds?.forEach((id) => {
                  form.setValue(`selection.${id}`, false)
                })
              }}
            />
          </div>
          <TinyButton label="Inviter" onClick={() => {}} />
        </div>
        {usersToInvite.map((email) => {
          return (
            <RowContent
              key={email}
              rowData={{ kind: 'to_invite', email }}
              {...{ form, setUsersToInvite }}
            />
          )
        })}
        {data.map((user) => {
          return (
            <RowContent
              key={user.id}
              rowData={{ kind: 'actual_user', user }}
              {...{ form, setUsersToInvite }}
            />
          )
        })}
      </div>
    </>
  )
}

function RowContent({
  rowData,
  form,
  setUsersToInvite,
}: {
  rowData: RowData
  form: Form
  setUsersToInvite: React.Dispatch<SetStateAction<string[]>>
}) {
  const { connectedUser } = useConnectedContext()
  const disabled =
    rowData.kind === 'actual_user'
      ? shouldBeDisabled(rowData.user, connectedUser)
      : false
  return (
    <div
      className={`border-t ${disabled ? 'bg-gray-100 border-gray-300 text-gray-500 border-x' : 'bg-white border-gray-400'} last:border-b-1 px-2 py-3`}
    >
      <div className="flex gap-2 items-center">
        {rowData.kind === 'actual_user' ? (
          <>
            <div className={`mx-6 h-fit`}>
              <Controller
                control={form.control}
                name={`selection.${rowData.user.id}`}
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
            <div className="flex flex-col gap-0 ">
              <p>{rowData.user.email}</p>
              <div className="text-sm">
                {rowData.user.firstName} {rowData.user.lastName}
              </div>
            </div>
            {disabled && (
              <p className="text-sm text-right grow"> c'est vous !</p>
            )}
          </>
        ) : (
          <>
            <div className={`mx-6 h-fit`}>
              <Checkbox className="!p-0 " disabled checked />
            </div>
            <div>
              <p>{rowData.email}</p>
              <p className="text-sm italic">
                Une invitation sera envoyée{' '}
                <Button
                  variant="text"
                  onClick={() => {
                    setUsersToInvite((prev) =>
                      prev.filter((_) => _ !== rowData.email),
                    )
                  }}
                  size="small"
                  className="!py-0 !-mt-0.5"
                >
                  annuler
                </Button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function shouldBeDisabled(user: User, connectedUser: User) {
  return user.id === connectedUser.id
}
