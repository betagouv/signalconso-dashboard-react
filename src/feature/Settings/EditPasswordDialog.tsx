import {ReactElement} from 'react'
import {useForm} from 'react-hook-form'
import {Alert} from '../../alexlibs/mui-extension'
import {useUsersContext} from '../../core/context/UsersContext'
import {useI18n} from '../../core/i18n'
import {useToast} from '../../core/toast'
import {ScOption} from 'core/helper/ScOption'
import {validatePasswordComplexity} from 'core/helper/passwordComplexity'
import {AccountEventActions, EventCategories, Matomo} from '../../core/plugins/Matomo'
import {ScDialog} from '../../shared/Confirm/ScDialog'
import {ScInputPassword} from '../../shared/ScInputPassword/ScInputPassword'
import {PasswordRequirementsDesc} from 'shared/PasswordRequirementsDesc'

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
  const _changePassword = useUsersContext().changePassword
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
      loading={_changePassword.loading}
      onConfirm={(event, close) => {
        handleSubmit((form: Form) => {
          _changePassword
            .fetch({}, form.oldPassword, form.newPassword)
            .then(() => {
              toastSuccess(m.passwordEdited)
              close()
              Matomo.trackEvent(EventCategories.account, AccountEventActions.changePasswordSuccess)
            })
            .catch(_ => {
              Matomo.trackEvent(EventCategories.account, AccountEventActions.changePasswordFail)
            })
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
