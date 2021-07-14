import {ScButton} from '../../shared/Button/Button'
import {Alert, Confirm} from 'mui-extension/lib'
import React from 'react'
import {useI18n} from '../../core/i18n'
import {CompanyAccessLevel} from '../../core/api'
import {useForm} from 'react-hook-form'
import {ScInput} from '../../shared/Input/ScInput'
import {regexp} from '../../core/helper/regexp'
import {ScSelect} from '../../shared/Select/Select'
import {MenuItem} from '@material-ui/core'
import {useToast} from '../../core/toast'

interface Props {
  errorMessage?: string
  loading: boolean
  onCreate: (email: string, level: CompanyAccessLevel) => Promise<void>
}

interface Form {
  email: string
  level: CompanyAccessLevel
}

export const CompanyAccessCreateBtn = ({errorMessage, loading, onCreate}: Props) => {
  const {m} = useI18n()
  const {register, handleSubmit, getValues, formState: {errors, isValid}} = useForm<Form>({mode: 'onChange'})
  const {toastSuccess} = useToast()
  return (
    <Confirm
      maxWidth="xs"
      title={m.invitNewUser}
      cancelLabel={m.close}
      confirmLabel={m.create}
      loading={loading}
      confirmDisabled={!isValid}
      onConfirm={close => {
        handleSubmit(({email, level}) => {
          onCreate(email, level)
            .then(() => toastSuccess(m.userInvitationSent))
            .then(close)
        })()
      }}
      content={
        <>
          {errorMessage && (
            <Alert dense type="error" deletable gutterBottom>{m.anErrorOccurred}</Alert>
          )}
          <ScInput
            type="password"
            error={!!errors.email}
            helperText={errors.email?.message ?? ' '}
            fullWidth
            label={m.email}
            {...register('email', {
              pattern: {value: regexp.email, message: m.invalidEmail},
              required: {value: true, message: m.required},
            })}
          />
          <ScSelect fullWidth {...register('level')} defaultValue="admin">
            {Object.keys(CompanyAccessLevel).map(level =>
              <MenuItem key={level} value={level}>{(CompanyAccessLevel as any)[level]}</MenuItem>
            )}
          </ScSelect>
        </>
      }>

      <ScButton loading={loading} icon="add" color="primary" variant="contained">
        {m.invite}
      </ScButton>
    </Confirm>
  )
}
