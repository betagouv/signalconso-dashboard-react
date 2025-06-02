import { Button, Checkbox, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useApiContext } from 'core/context/ApiContext'
import { useConnectedContext } from 'core/context/connected/connectedContext'
import { regexp } from 'core/helper/regexp'
import { User } from 'core/model'
import { Controller, useForm, UseFormReturn } from 'react-hook-form'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { ScDialog } from 'shared/ScDialog'
import {
  MassManageNextButton,
  MassManageTinyButton,
} from './usersProMassManageTinyComponents'
import {
  MassManageInputs,
  MassManagementUsers,
} from './usersProMassManagementConstants'

// This form allows to select 3 types :
// - users already in DB
// - people that have been invited by email already (i.e. pending tokens)
// - additional emails addresses to be invited (added by the "Inviter" button)

type FormShape = {
  users: { [id: string]: boolean }
  // the emails can contain dots, which messes with react-hook-form, so we use base64
  alreadyInvitedEmails: { [emailBase64: string]: boolean }
  emailsToInvite: string[]
}

type Form = UseFormReturn<FormShape>

type OnSubmit = (_: MassManageInputs['users']) => void

export function MassManageUsersSelection({
  choices,
  allowInvitation,
  onSubmit,
}: {
  choices: MassManageInputs
  allowInvitation: boolean
  onSubmit: OnSubmit
}) {
  const { api } = useApiContext()
  const _query = useQuery({
    queryKey: ['accessesMassManagement_getUsersOfPro'],
    queryFn: () => api.secured.accessesMassManagement.getMassManagementUsers(),
  })
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
  data: MassManagementUsers
  allowInvitation: boolean
  onSubmit: OnSubmit
  choices: MassManageInputs
}) {
  const { connectedUser } = useConnectedContext()
  const form = useForm<FormShape>({
    defaultValues: {
      users: Object.fromEntries(
        data.users
          .map((_) => _.id)
          .map((id) => [id, choices.users.usersIds.includes(id)]),
      ),
      alreadyInvitedEmails: Object.fromEntries(
        data.invitedEmails.map((email) => [
          btoa(email),
          choices.users.alreadyInvitedEmails.includes(email),
        ]),
      ),
      emailsToInvite: choices.users.emailsToInvite,
    },
  })
  const isAtLeastOneSelected =
    Object.values(form.watch('users')).some((_) => _) ||
    Object.values(form.watch('alreadyInvitedEmails')).some((_) => _) ||
    form.watch('emailsToInvite').length > 0

  function setAllSelectableTo(value: boolean) {
    data.users
      .filter((c) => !shouldBeDisabled(c, connectedUser))
      .map((c) => c.id)
      .forEach((id) => {
        form.setValue(`users.${id}`, value)
      })
    data.invitedEmails.forEach((email) => {
      form.setValue(`alreadyInvitedEmails.${btoa(email)}`, value)
    })
  }
  return (
    <form
      onSubmit={form.handleSubmit((formValues) => {
        onSubmit({
          usersIds: Object.entries(formValues.users)
            .filter(([_, selected]) => selected)
            .map(([id]) => id),
          alreadyInvitedEmails: Object.entries(formValues.alreadyInvitedEmails)
            .filter(([_, selected]) => selected)
            .map(([email]) => atob(email)),
          emailsToInvite: formValues.emailsToInvite,
        })
      })}
    >
      <p className="">Sélectionnez un ou plusieurs utilisateurs :</p>
      <p className="text-sm text-gray-500 mb-4">
        Sont listés ci-dessous tous les utilisateurs avec lesquels vous avez au
        moins une entreprise en commun.{' '}
        {allowInvitation &&
          'Pour ajouter quelqu\'un d\'autre, utilisez le bouton "Inviter".'}
      </p>
      <div className="bg-gray-100 py-2 px-4 mb-4">
        <div className="flex gap-2 items-end justify-between mb-2">
          <div className="flex gap-2 h-fit">
            <MassManageTinyButton
              label="Sélectionner tous"
              onClick={() => {
                setAllSelectableTo(true)
              }}
            />
            <MassManageTinyButton
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
        {data.invitedEmails.map((email) => {
          return <RowInvited key={email} email={email} {...{ form }} />
        })}
        {data.users.map((user) => {
          return <RowExistingUser key={user.id} user={user} {...{ form }} />
        })}
      </div>
      <MassManageNextButton disabled={!isAtLeastOneSelected} />
    </form>
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
      className={`border-t ${disabled ? 'bg-gray-100 border-gray-300 text-gray-500 border-x' : 'bg-white border-gray-400'} last:border-b px-2 py-3`}
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
      checkbox={<Checkbox className="p-0! " disabled checked />}
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
            className="py-0! -mt-0.5!"
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
                className="p-0! "
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
      <div className="flex flex-col items-start lg:contents">
        <div className="flex flex-col gap-0">
          <p className="break-all">{user.email}</p>
          <div className="text-sm font-bold">
            {user.firstName} {user.lastName}
          </div>
        </div>
        {disabled && <p className="text-sm text-right grow"> c'est vous !</p>}
      </div>
    </RowWrapper>
  )
}

function RowInvited({ email, form }: { email: string; form: Form }) {
  return (
    <RowWrapper
      disabled={false}
      checkbox={
        <Controller
          control={form.control}
          name={`alreadyInvitedEmails.${btoa(email)}`}
          render={({ field: { onChange, onBlur, value, ref } }) => {
            return (
              <Checkbox
                className="p-0! "
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
        <p className="break-all">{email}</p>
        <div className="text-sm italic">Invitation envoyée</div>
      </div>
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
            className="mb-4!"
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
      <MassManageTinyButton label="Inviter" />
    </ScDialog>
  )
}
