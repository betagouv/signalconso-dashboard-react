import { useMutation } from '@tanstack/react-query'
import { ReactElement } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert } from '../../alexlibs/mui-extension'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { useToast } from '../../core/context/toast/toastContext'
import { useI18n } from '../../core/i18n'
import {
  AccountEventActions,
  EventCategories,
  trackEvent,
} from '../../core/plugins/Matomo'
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
  const { api: apiSdk, connectedUser, setConnectedUser } = useConnectedContext()
  const _editUser = useMutation({
    mutationFn: apiSdk.secured.user.edit,
  })

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
      maxWidth="md"
      onOpen={() => {
        reset(defaultFormValues)
      }}
      confirmLabel={m.edit}
      confirmDisabled={!isValid || !hasUserChanged}
      loading={_editUser.isPending}
      onConfirm={(e, close) => {
        handleSubmit((form: Form) => {
          _editUser
            .mutateAsync(form)
            .then(() => {
              toastSuccess(m.saved)
              close()
              trackEvent(
                connectedUser,
                EventCategories.CompteUtilisateur,
                AccountEventActions.changeNameSuccess,
              )
              setConnectedUser((previous) =>
                previous ? { ...previous, ...form } : undefined,
              )
            })
            .catch((_) => {
              trackEvent(
                connectedUser,
                EventCategories.CompteUtilisateur,
                AccountEventActions.changeNameFail,
              )
            })
        })()
      }}
      content={
        <>
          {_editUser.error && (
            <Alert dense type="error" deletable gutterBottom>
              {_editUser.error.message ?? m.anErrorOccurred}
            </Alert>
          )}
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
