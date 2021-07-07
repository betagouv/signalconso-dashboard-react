import React from 'react'
import {useI18n} from '../../core/i18n'
import {ScButton} from '../../shared/Button/Button'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {ScInput} from '../../shared/Input/ScInput'
import {useForm} from 'react-hook-form'
import {useUsersContext} from '../../core/context/UsersContext'
import {Alert, Confirm} from 'mui-extension/lib'
import {useToast} from '../../core/toast'
import {fromNullable} from 'fp-ts/lib/Option'

interface Form {
  oldPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

export const EditPassword = () => {
  const {m} = useI18n()
  const _changePassword = useUsersContext().changePassword
  const {register, handleSubmit, getValues, formState: {errors, isValid}} = useForm<Form>({mode: 'onChange'})
  const {toastSuccess} = useToast()

  return (
    <Confirm
      title={m.editPassword}
      maxWidth="xs"
      confirmLabel={m.edit}
      cancelLabel={m.close}
      confirmDisabled={!isValid}
      loading={_changePassword.loading}
      onConfirm={(close => {
        handleSubmit((form: Form) => {
          _changePassword.fetch()(form.oldPassword, form.newPassword)
            .then(() => toastSuccess(m.passwordEdited))
            .then(close)
        })()
      })}
      content={
        <>
          {fromNullable(_changePassword.error).map(error =>
            <Alert dense type="error" deletable gutterBottom>{error.code === 401 ? m.invalidPassword : m.failedToChangePassword}</Alert>
          ).toUndefined()}
          <Txt color="hint" block gutterBottom>{m.editPasswordDialogDesc}</Txt>
          <ScInput
            error={!!errors.oldPassword}
            helperText={errors.oldPassword?.message ?? ' '}
            fullWidth
            label={m.oldPassword}
            {...register('oldPassword', {
              required: {value: true, message: m.required},
              minLength: {value: 8, message: m.passwordNotLongEnough}
            })}
          />
          <ScInput
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
          <ScInput
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
    </Confirm>
  )
}
