import React, {ReactElement} from 'react'
import {useI18n} from '../../../core/i18n'
import {ScInput} from '../../../shared/Input/ScInput'
import {Controller, useForm} from 'react-hook-form'
import {regexp} from '../../../core/helper/regexp'
import {Checkbox, FormControlLabel} from '@mui/material'
import {ScDialog} from '../../../shared/Confirm/ScDialog'
import {Report, ReportConsumerUpdate} from '../../../core/client/report/Report'

interface Props {
  report: Report
  children: ReactElement<any>
  onChange: (userForm: ReportConsumerUpdate) => unknown
}

export const EditConsumerDialog = ({report, onChange, children}: Props) => {
  const {m} = useI18n()
  const {
    register,
    getValues,
    control,
    formState: {errors},
  } = useForm<ReportConsumerUpdate>({mode: 'onChange'})
  return (
    <ScDialog
      PaperProps={{sx: {overflow: 'visible'}}}
      title={m.editConsumer}
      maxWidth="xs"
      confirmLabel={m.edit}
      onConfirm={(event, close) => {
        onChange(getValues())
        close()
      }}
      content={
        <>
          <ScInput
            fullWidth
            autoFocus
            label={m.firstName}
            error={!!errors.firstName}
            helperText={errors.firstName?.message ?? ' '}
            defaultValue={report.firstName}
            {...register('firstName', {
              required: {value: true, message: m.required},
            })}
          />

          <ScInput
            fullWidth
            label={m.lastName}
            error={!!errors.lastName}
            helperText={errors.lastName?.message ?? ' '}
            defaultValue={report.lastName}
            {...register('lastName', {
              required: {value: true, message: m.required},
            })}
          />

          <ScInput
            fullWidth
            label={m.email}
            error={!!errors.email}
            helperText={errors.email?.message ?? ' '}
            defaultValue={report.email}
            {...register('email', {
              pattern: {value: regexp.email, message: m.invalidEmail},
              required: {value: true, message: m.required},
            })}
          />

          <ScInput
            fullWidth
            label={m.reportConsumerReferenceNumber}
            error={!!errors.consumerReferenceNumber}
            helperText={errors.consumerReferenceNumber?.message ?? ' '}
            defaultValue={report.consumerReferenceNumber}
            {...register('consumerReferenceNumber')}
          />

          <Controller
            name="contactAgreement"
            defaultValue={report.contactAgreement}
            control={control}
            render={({field}) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} disabled={report.contactAgreement} />}
                label={m.contactAgreement}
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
