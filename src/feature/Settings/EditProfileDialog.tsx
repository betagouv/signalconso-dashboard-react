import { map } from 'core/helper'
import { ReactElement } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert } from '../../alexlibs/mui-extension'
import { useAsync } from '../../alexlibs/react-hooks-lib'
import { ApiError } from '../../core/client/ApiClient'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useI18n } from '../../core/i18n'
import {
  AccountEventActions,
  EventCategories,
  Matomo,
} from '../../core/plugins/Matomo'
import { useToast } from '../../core/toast'
import { ScDialog } from '../../shared/ScDialog'
import { ScInput } from '../../shared/ScInput'

interface Form {
  firstName: string
  lastName: string
}

interface Props {
  children: ReactElement<any>
}

export const EditProfileDialog = ({ children }: Props) => {
  const { m } = useI18n()
  const { apiSdk, connectedUser, setConnectedUser } = useConnectedContext()
  const _editUser = useAsync(apiSdk.secured.user.edit)
  const { toastSuccess } = useToast()
  const defaultFormValues: Form = {
    firstName: connectedUser.firstName,
    lastName: connectedUser.lastName,
  }
  const {
    getValues,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<Form>({
    mode: 'onChange',
    defaultValues: defaultFormValues,
  })

  watch('firstName')
  watch('lastName')
  const hasUserChanged =
    getValues().firstName !== connectedUser.firstName ||
    getValues().lastName !== connectedUser.lastName

  return (
    <ScDialog
      title={m.editName}
      maxWidth="xs"
      onOpen={() => {
        reset(defaultFormValues)
      }}
      confirmLabel={m.edit}
      confirmDisabled={!isValid || !hasUserChanged}
      loading={_editUser.loading}
      onConfirm={(event, close) => {
        handleSubmit((form: Form) => {
          _editUser
            .call(form)
            .then(() => {
              toastSuccess(m.saved)
              close()
              Matomo.trackEvent(
                EventCategories.account,
                AccountEventActions.changeNameSuccess,
              )
              setConnectedUser((previous) =>
                previous ? { ...previous, ...form } : undefined,
              )
            })
            .catch((_) => {
              Matomo.trackEvent(
                EventCategories.account,
                AccountEventActions.changeNameFail,
              )
            })
        })()
      }}
      content={
        <>
          {map(_editUser.error, (error: ApiError) => (
            <Alert dense type="error" deletable gutterBottom>
              {error.message ?? m.anErrorOccurred}
            </Alert>
          ))}
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <ScInput
                {...field}
                autoComplete="false"
                error={!!errors.firstName}
                helperText={errors.firstName?.message ?? ' '}
                fullWidth
                label={m.firstName}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <ScInput
                {...field}
                autoComplete="false"
                error={!!errors.lastName}
                helperText={errors.lastName?.message ?? ' '}
                fullWidth
                label={m.lastName}
              />
            )}
          />
        </>
      }
    >
      {children}
    </ScDialog>
  )
}
