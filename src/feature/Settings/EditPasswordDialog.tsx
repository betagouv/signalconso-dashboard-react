import {ReactElement} from 'react'
import {useForm} from 'react-hook-form'
import {Alert} from '../../alexlibs/mui-extension'
import {useI18n} from '../../core/i18n'
import {useToast} from '../../core/toast'
import {ScOption} from 'core/helper/ScOption'
import {validatePasswordComplexity} from 'core/helper/passwordComplexity'
import {AccountEventActions, EventCategories, Matomo} from '../../core/plugins/Matomo'
import {ScDialog} from '../../shared/ScDialog'
import {ScInputPassword} from '../../shared/ScInputPassword'
import {PasswordRequirementsDesc} from 'shared/PasswordRequirementsDesc'
import {useMutation} from '@tanstack/react-query'
import {useApiContext} from '../../core/context/ApiContext'
import {ApiError} from '../../core/client/ApiClient'

interface Form {
  oldPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

interface Props {
  children: ReactElement<any>
}

export const EditPasswordDialog = ({children}: Props) => {
  const {m} = useI18n()
  const {api} = useApiContext()
  const _changePassword = useMutation({
    mutationFn: (params: {oldPassword: string; newPassword: string}) =>
      api.secured.user.changePassword(params.oldPassword, params.newPassword),
    onSuccess: () => {
      toastSuccess(m.passwordEdited)
      Matomo.trackEvent(EventCategories.account, AccountEventActions.changePasswordSuccess)
    },
    onError: (error: ApiError) => {
      Matomo.trackEvent(EventCategories.account, AccountEventActions.changePasswordFail)
    },
  })
  const {
    register,
    handleSubmit,
    getValues,
    formState: {errors, isValid},
  } = useForm<Form>({mode: 'onChange'})
  const {toastSuccess} = useToast()

  return (
    <ScDialog
      title={m.editPassword}
      maxWidth="xs"
      confirmLabel={m.edit}
      confirmDisabled={!isValid}
      loading={_changePassword.isPending}
      onConfirm={(event, close) => {
        handleSubmit((form: Form) => {
          _changePassword.mutateAsync({oldPassword: form.oldPassword, newPassword: form.newPassword}).then(close)
        })()
      }}
      content={
        <>
          {ScOption.from(_changePassword.error)
            .map(error => (
              <Alert dense type="error" deletable gutterBottom>
                {error.details?.code === 401 ? m.invalidPassword : m.failedToChangePassword}
              </Alert>
            ))
            .toUndefined()}

          <ScInputPassword
            inputProps={{
              autocomplete: 'false',
            }}
            autoComplete="false"
            error={!!errors.oldPassword}
            helperText={errors.oldPassword?.message ?? ' '}
            fullWidth
            label={m.oldPassword}
            {...register('oldPassword', {
              required: {value: true, message: m.required},
            })}
          />
          <PasswordRequirementsDesc />
          <ScInputPassword
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message ?? ' '}
            fullWidth
            label={m.newPassword}
            {...register('newPassword', {
              required: {value: true, message: m.required},
              validate: (value: string) => {
                if (value === getValues().oldPassword) {
                  return m.passwordAreIdentical
                }
                const complexityMessage = validatePasswordComplexity(value)
                if (complexityMessage) {
                  return m[complexityMessage]
                }
              },
            })}
          />
          <ScInputPassword
            error={!!errors.newPasswordConfirmation}
            helperText={errors.newPasswordConfirmation?.message ?? ' '}
            fullWidth
            label={m.newPasswordConfirmation}
            {...register('newPasswordConfirmation', {
              required: {value: true, message: m.required},
              validate: value => value === getValues().newPassword || m.passwordDoesntMatch,
            })}
          />
        </>
      }
    >
      {children}
    </ScDialog>
  )
}
