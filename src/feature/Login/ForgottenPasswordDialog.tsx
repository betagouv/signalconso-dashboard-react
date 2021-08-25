import {Alert} from 'mui-extension'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {ScInput} from '../../shared/Input/ScInput'
import {regexp} from '../../core/helper/regexp'
import * as React from 'react'
import {ReactElement, useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {useI18n} from '../../core/i18n'
import {useToast} from '../../core/toast'
import {ScDialog} from '../../shared/Confirm/ScDialog'

interface Props {
  onSubmit: (email: string) => Promise<any>
  loading?: boolean
  errorMsg?: string
  children: ReactElement<any>
  value?: string
}

interface Form {
  emailForgotten: string
}

export const ForgottenPasswordDialog = ({value, onSubmit, loading, errorMsg, children}: Props) => {
  const {m} = useI18n()
  const {toastSuccess} = useToast()
  const {
    register,
    getValues,
    setValue,
    formState: {errors, isValid},
  } = useForm<Form>({mode: 'onSubmit'})

  useEffect(() => {
    setValue('emailForgotten', value ?? '')
  }, [value])

  const submit = (form: Form, close: () => void) => {
    onSubmit(form.emailForgotten)
      .then(close)
      .then(() => toastSuccess(m.emailSentToYou))
  }

  return (
    <ScDialog
      confirmDisabled={!isValid || loading}
      loading={loading}
      title={m.forgottenPassword}
      confirmLabel={m.createNewPassword}
      maxWidth="xs"
      onConfirm={(e, close) => submit(getValues(), close)}
      content={
        <>
          {errorMsg !== undefined && (
            <Alert type="error" gutterBottom deletable>
              {m.anErrorOccurred}
            </Alert>
          )}
          <Txt color="hint" block gutterBottom>
            {m.forgottenPasswordDesc}
          </Txt>
          <ScInput
            fullWidth
            autoFocus
            type="email"
            label={m.email}
            {...register('emailForgotten', {
              required: {value: true, message: m.required},
              pattern: {value: regexp.email, message: m.invalidEmail},
            })}
          />
        </>
      }
    >
      {children}
    </ScDialog>
  )
}
