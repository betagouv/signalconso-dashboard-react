import {ScDialog} from '../../shared/ScDialog'
import React, {ReactElement} from 'react'
import {useI18n} from '../../core/i18n'
import {useForm} from 'react-hook-form'
import {ScInput} from '../../shared/ScInput'
import {useLogin} from '../../core/context/LoginContext'
import {useMutation} from '@tanstack/react-query'
import {useToast} from '../../core/toast'
import {Alert} from '../../alexlibs/mui-extension'
import {regexp} from '../../core/helper/regexp'

interface Form {
  email: string
}

interface Props {
  children: ReactElement<any>
}

export const EditEmailDialog = ({children}: Props) => {
  const {m} = useI18n()
  const {apiSdk, connectedUser} = useLogin()
  const _sendEmailUpdateValidation = useMutation({
    mutationFn: apiSdk.secured.user.sendEmailUpdateValidation,
  })
  const {toastSuccess} = useToast()

  const defaultFormValues: Form = {
    email: connectedUser.email,
  }

  const {
    reset,
    register,
    formState: {errors, isValid},
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
            toastSuccess(`Email de changement d'adresse email envoyé à : ${form.email}`)
            close()
          })
        })()
      }}
      content={
        <>
          <Alert dense type="info" sx={{mb: 2}}>
            <>
              <u>
                <b>Votre email ne sera pas modifié immédiatement</b>
              </u>
              <br />
              Vous recevrez un email à votre nouvelle adresse pour la confirmer. Cliquez sur le lien dans cet email pour valider
              et modifier votre adresse.
            </>
          </Alert>
          <ScInput
            {...register('email', {
              required: {value: true, message: m.required},
              pattern: {value: regexp.email, message: m.invalidEmail},
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
