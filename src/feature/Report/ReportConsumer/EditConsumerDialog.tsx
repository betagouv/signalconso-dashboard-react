import {ReactElement} from 'react'
import {useForm} from 'react-hook-form'
import {Report, ReportConsumerUpdate} from '../../../core/client/report/Report'
import {regexp} from '../../../core/helper/regexp'
import {emptyStringToUndefined} from '../../../core/helper/utils'
import {useI18n} from '../../../core/i18n'
import {ScDialog} from '../../../shared/Confirm/ScDialog'
import {ScInput} from '../../../shared/Input/ScInput'

interface Props {
  report: Report
  children: ReactElement<any>
  onChange: (userForm: ReportConsumerUpdate) => unknown
}

// Inside this component, we replace empty string by undefined
type FormData = Omit<ReportConsumerUpdate, 'consumerReferenceNumber'> & {
  consumerReferenceNumber: string
}

function buildFormData(report: Report): FormData {
  const {firstName, lastName, email, consumerReferenceNumber} = report
  return {firstName, lastName, email, consumerReferenceNumber: consumerReferenceNumber ?? ''}
}

function translateFormData({consumerReferenceNumber, ...rest}: FormData): ReportConsumerUpdate {
  return {consumerReferenceNumber: emptyStringToUndefined(consumerReferenceNumber), ...rest}
}

export const EditConsumerDialog = ({report, onChange, children}: Props) => {
  const {m} = useI18n()
  const {
    register,
    getValues,
    formState: {errors},
  } = useForm<FormData>({mode: 'onChange', defaultValues: buildFormData(report)})
  return (
    <ScDialog
      PaperProps={{sx: {overflow: 'visible'}}}
      title={m.editConsumer}
      maxWidth="xs"
      confirmLabel={m.edit}
      onConfirm={(e, close) => {
        onChange(translateFormData(getValues()))
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
            {...register('firstName', {
              required: {value: true, message: m.required},
            })}
          />

          <ScInput
            fullWidth
            label={m.lastName}
            error={!!errors.lastName}
            helperText={errors.lastName?.message ?? ' '}
            {...register('lastName', {
              required: {value: true, message: m.required},
            })}
          />

          <ScInput
            fullWidth
            label={m.email}
            error={!!errors.email}
            helperText={errors.email?.message ?? ' '}
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
            {...register('consumerReferenceNumber')}
          />
        </>
      }
    >
      {children}
    </ScDialog>
  )
}
