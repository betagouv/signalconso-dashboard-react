import { Button, Checkbox, TextField } from '@mui/material'
import { AccessesMassManagementUsers } from 'core/client/accesses-mass-management/accessesMassManagement'
import { useConnectedContext } from 'core/context/connected/connectedContext'
import { regexp } from 'core/helper/regexp'
import { User } from 'core/model'
import { useUsersOfProQuery } from 'core/queryhooks/accessesMassManagementQueryHooks'
import { Controller, useForm, UseFormReturn } from 'react-hook-form'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { ScDialog } from 'shared/ScDialog'
import { NextButton, TinyButton } from './usersProMassManageTinyComponents'
import { MassManageChoices } from './usersProMassManagementConstants'

// This form allows to select 3 types :
// - users already in DB
// - people that have been invited by email already (i.e. pending tokens)
// - additional emails addresses to be invited (added by the "Inviter" button)

type FormShape = {
  users: { [id: string]: boolean }
  invited: { [id: string]: boolean }
  emailsToInvite: string[]
}

type Form = UseFormReturn<FormShape>

type OnSubmit = (_: {
  selectedUserIds: string[]
  selectedAlreadyInvited: string[]
  emailsToInvite: string[]
}) => void

export function ProUsersSelection({
  choices,
  allowInvitation,
  onSubmit,
}: {
  choices: MassManageChoices
  allowInvitation: boolean
  onSubmit: OnSubmit
}) {
  const _query = useUsersOfProQuery()
  const data = _query.data
  return (
    <CleanInvisiblePanel loading={_query.isLoading}>
      {data ? (
        <Loaded
          {...{
            data,
            allowInvitation,
            onSubmit,
            choices,
          }}
        />
      ) : null}
    </CleanInvisiblePanel>
  )
}

function Loaded({
  data,
  allowInvitation,
  onSubmit,
  choices,
}: {
  data: AccessesMassManagementUsers
  allowInvitation: boolean
  onSubmit: OnSubmit
  choices: MassManageChoices
}) {
  const { connectedUser } = useConnectedContext()
  const form = useForm<FormShape>({
    defaultValues: {
      users: Object.fromEntries(
        data.users
          .map((_) => _.id)
          .map((id) => [id, choices.users.usersIds.includes(id)]),
      ),
      invited: Object.fromEntries(
        data.invitedByEmail
          .map((_) => _.id)
          .map((id) => [id, choices.users.alreadyInvitedTokenIds.includes(id)]),
      ),
      emailsToInvite: choices.users.emailsToInvite,
    },
  })
  const isAtLeastOneSelected =
    Object.values(form.watch('users')).some((_) => _) ||
    Object.values(form.watch('invited')).some((_) => _) ||
    form.watch('emailsToInvite').length > 0

  function setAllSelectableTo(value: boolean) {
    data.users
      .filter((c) => !shouldBeDisabled(c, connectedUser))
      .map((c) => c.id)
      .forEach((id) => {
        form.setValue(`users.${id}`, value)
      })
    data.invitedByEmail
      .map((_) => _.id)
      .forEach((id) => {
        form.setValue(`invited.${id}`, value)
      })
  }
  return (
    <>
      <p className="mb-4">Sélectionnez un ou plusieurs utilisateurs :</p>
      <div className="bg-gray-100 py-2 px-4 mb-4">
        <div className="flex gap-2 items-end justify-between mb-2">
          <div className="flex gap-2 h-fit">
            <TinyButton
              label="Sélectionner tous"
              onClick={() => {
                setAllSelectableTo(true)
              }}
            />
            <TinyButton
              label="Désélectionner tous"
              onClick={() => {
                setAllSelectableTo(false)
              }}
            />
          </div>
          {allowInvitation && (
            <InviteButtonWithDialog
              onInvite={(email) => {
                form.setValue('emailsToInvite', [
                  email,
                  ...form.getValues('emailsToInvite'),
                ])
              }}
              isEmailAlreadyPresent={(email) =>
                form.watch('emailsToInvite').includes(email)
              }
            />
          )}
        </div>
        {form.watch('emailsToInvite').map((email) => {
          return <RowToInvite key={email} email={email} {...{ form }} />
        })}
        {data.users.map((user) => {
          return <RowExistingUser key={user.id} user={user} {...{ form }} />
        })}
      </div>
      <NextButton
        disabled={!isAtLeastOneSelected}
        onClick={form.handleSubmit((formValues) => {
          onSubmit({
            selectedUserIds: Object.entries(formValues.users)
              .filter(([_, selected]) => selected)
              .map(([id]) => id),
            selectedAlreadyInvited: Object.entries(formValues.invited)
              .filter(([_, selected]) => selected)
              .map(([id]) => id),
            emailsToInvite: formValues.emailsToInvite,
          })
        })}
      />
    </>
  )
}

function RowWrapper({
  children,
  disabled,
  checkbox,
}: {
  children: React.ReactNode
  disabled: boolean
  checkbox: React.ReactNode
}) {
  return (
    <div
      className={`border-t ${disabled ? 'bg-gray-100 border-gray-300 text-gray-500 border-x' : 'bg-white border-gray-400'} last:border-b-1 px-2 py-3`}
    >
      <div className="flex gap-2 items-center">
        <div className={`mx-6 h-fit`}>{checkbox}</div>
        {children}
      </div>
    </div>
  )
}

function RowToInvite({ email, form }: { email: string; form: Form }) {
  return (
    <RowWrapper
      disabled={false}
      checkbox={<Checkbox className="!p-0 " disabled checked />}
    >
      <div>
        <p>{email}</p>
        <p className="text-sm italic">
          Une invitation sera envoyée{' '}
          <Button
            variant="text"
            onClick={() => {
              form.setValue(
                'emailsToInvite',
                form.getValues('emailsToInvite').filter((_) => _ !== email),
              )
            }}
            size="small"
            className="!py-0 !-mt-0.5"
          >
            annuler
          </Button>
        </p>
      </div>
    </RowWrapper>
  )
}

function RowExistingUser({ user, form }: { user: User; form: Form }) {
  const { connectedUser } = useConnectedContext()
  const disabled = shouldBeDisabled(user, connectedUser)
  return (
    <RowWrapper
      {...{ disabled }}
      checkbox={
        <Controller
          control={form.control}
          name={`users.${user.id}`}
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
      }
    >
      <div className="flex flex-col gap-0 ">
        <p>{user.email}</p>
        <div className="text-sm">
          {user.firstName} {user.lastName}
        </div>
      </div>
      {disabled && <p className="text-sm text-right grow"> c'est vous !</p>}
    </RowWrapper>
  )
}

function shouldBeDisabled(user: User, connectedUser: User) {
  return user.id === connectedUser.id
}

function InviteButtonWithDialog({
  onInvite,
  isEmailAlreadyPresent,
}: {
  onInvite: (email: string) => void
  isEmailAlreadyPresent: (email: string) => boolean
}) {
  const {
    register,
    reset,
    handleSubmit,

    formState: { errors, isValid },
  } = useForm<{
    email: string
  }>({ mode: 'onSubmit' })
  return (
    <ScDialog
      title={'Inviter un utilisateur'}
      onOpen={reset}
      onConfirm={(_, close) => {
        handleSubmit((form) => {
          onInvite(form.email)
          close()
        })()
      }}
      content={
        <div className="min-w-sm">
          <p>
            Tapez l'adresse email d'un nouvel utilisateur à ajouter sur ces
            entreprises. S'il n'a pas de compte SignalConso, une invitation lui
            sera envoyée par email.
          </p>
          <TextField
            className="!mb-4"
            size="small"
            variant="filled"
            margin="dense"
            type="email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message ?? ''}
            label={'Email'}
            {...register('email', {
              required: { value: true, message: 'Requis' },
              pattern: { value: regexp.email, message: 'Email invalide' },
              validate: (value) => {
                if (isEmailAlreadyPresent(value)) {
                  return 'Email déjà présent dans la liste'
                }
                return true
              },
            })}
          />
        </div>
      }
    >
      <TinyButton label="Inviter" />
    </ScDialog>
  )
}
