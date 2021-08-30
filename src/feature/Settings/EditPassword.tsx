import React from 'react'
import {useI18n} from '../../core/i18n'
import {ScButton} from '../../shared/Button/Button'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {useForm} from 'react-hook-form'
import {useUsersContext} from '../../core/context/UsersContext'
import {Alert} from 'mui-extension/lib'
import {useToast} from '../../core/toast'
import {fromNullable} from 'fp-ts/lib/Option'
import {ScDialog} from '../../shared/Confirm/ScDialog'
import {ScInputPassword} from '../../shared/InputPassword/InputPassword'
import {AccountEventActions, EventCategories, Matomo} from '../../core/analyics/Matomo'

interface Form {
  oldPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

export const EditPassword = () => {
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
          _changePassword.fetch({}, form.oldPassword, form.newPassword)
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
          {fromNullable(_changePassword.error)
            .map(error => (
              <Alert dense type="error" deletable gutterBottom>
                {error.code === 401 ? m.invalidPassword : m.failedToChangePassword}
              </Alert>
            ))
            .toUndefined()}
          <Txt color="hint" block gutterBottom>
            {m.editPasswordDialogDesc}
          </Txt>
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
              minLength: {value: 8, message: m.passwordNotLongEnough},
            })}
          />
          <ScInputPassword
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message ?? ' '}
            fullWidth
            label={m.newPassword}
            {...register('newPassword', {
              required: {value: true, message: m.required},
              minLength: {value: 8, message: m.passwordNotLongEnough},
              validate: value => value !== getValues().oldPassword || m.passwordAreIdentical,
            })}
          />
          <ScInputPassword
            error={!!errors.newPasswordConfirmation}
            helperText={errors.newPasswordConfirmation?.message ?? ' '}
            fullWidth
            label={m.newPasswordConfirmation}
            {...register('newPasswordConfirmation', {
              required: {value: true, message: m.required},
              minLength: {value: 8, message: m.passwordNotLongEnough},
              validate: value => value === getValues().newPassword || m.passwordDoesntMatch,
            })}
          />
        </>
      }
    >
      <ScButton icon="edit" color="primary">
        {m.edit}
      </ScButton>
    </ScDialog>
  )
}
