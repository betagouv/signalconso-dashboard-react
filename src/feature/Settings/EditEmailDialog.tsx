import { useMutation } from '@tanstack/react-query'
import { ReactElement } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from '../../alexlibs/mui-extension'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useToast } from '../../core/context/toastContext'
import { regexp } from '../../core/helper/regexp'
import { useI18n } from '../../core/i18n'
import { ScDialog } from '../../shared/ScDialog'
import { ScInput } from '../../shared/ScInput'

interface Form {
  email: string
}

interface Props {
  children: ReactElement<any>
}

export const EditEmailDialog = ({ children }: Props) => {
  const { m } = useI18n()
  const { api: apiSdk, connectedUser } = useConnectedContext()
  const _sendEmailUpdateValidation = useMutation({
    mutationFn: apiSdk.secured.user.sendEmailUpdateValidation,
  })
  const { toastSuccess } = useToast()

  const defaultFormValues: Form = {
    email: connectedUser.email,
  }

  const {
    reset,
    register,
    formState: { errors, isValid },
    watch,
    handleSubmit,
  } = useForm<Form>({
    defaultValues: defaultFormValues,
  })
  const email = watch('email')
  const isSameEmail = email === connectedUser.email

  return (
    <ScDialog
      title={m.editEmail}
      maxWidth="sm"
      onOpen={() => {
        reset(defaultFormValues)
      }}
      confirmLabel={m.edit}
      confirmDisabled={!isValid || isSameEmail || email.length === 0}
      loading={_sendEmailUpdateValidation.isPending}
      onConfirm={(event, close) => {
        handleSubmit((form: Form) => {
          _sendEmailUpdateValidation.mutateAsync(form.email).then(() => {
            toastSuccess(`${m.updateEmailSentTo} ${form.email}`)
            close()
          })
        })()
      }}
      content={
        <>
          <Alert dense type="info" sx={{ mb: 2 }}>
            <>
              <u>
                <b>{m.updateEmailAlert1}</b>
              </u>
              <br />
              {m.updateEmailAlert2}
            </>
          </Alert>
          <ScInput
            {...register('email', {
              required: { value: true, message: m.required },
              pattern: { value: regexp.email, message: m.invalidEmail },
            })}
            label={m.email}
            fullWidth
            autoComplete="false"
            error={!!errors.email}
            helperText={errors.email?.message ?? ' '}
          />
        </>
      }
    >
      {children}
    </ScDialog>
  )
}
