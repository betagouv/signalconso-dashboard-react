import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiContext } from 'core/context/ApiContext'
import { ScOption } from 'core/helper/ScOption'
import { useForm } from 'react-hook-form'
import { Alert, Txt } from '../../alexlibs/mui-extension'
import { ApiError } from '../../core/client/ApiClient'
import { apiErrorsCode, useToast } from '../../core/context/toastContext'
import { regexp } from '../../core/helper/regexp'
import { useI18n } from '../../core/i18n'
import { ListConsumerBlacklistQueryKeys } from '../../core/queryhooks/consumerBlacklistQueryHooks'
import { ScButton } from '../../shared/Button'
import { ScDialog } from '../../shared/ScDialog'
import { ScInput } from '../../shared/ScInput'

export const ConsumerBlacklistAddDialog = () => {
  const { m } = useI18n()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<{ email: string; comments: string }>({ mode: 'onChange' })
  const { api } = useApiContext()
  const queryClient = useQueryClient()
  const _addToBlacklist = useMutation({
    mutationFn: (params: { email: string; comments: string }) =>
      api.secured.consumerBlacklist.add(params.email, params.comments),
    onSuccess: () => {
      toastSuccess(m.added)
      return queryClient.invalidateQueries({
        queryKey: ListConsumerBlacklistQueryKeys,
      })
    },
  })

  const { toastSuccess } = useToast()

  const buttonText = m.add_email_to_blacklist
  const dialogTitle = m.add_email_to_blacklist
  const dialogDesc = m.add_email_to_blacklist_desc
  const dialogDescAlert = m.add_email_to_blacklist_desc_alert
  const emailRegexp = regexp.email
  const emailValidationMessage = m.invalidEmail

  return (
    <ScDialog
      maxWidth="xs"
      onConfirm={(event, close) => {
        handleSubmit(({ email, comments }) => {
          _addToBlacklist.mutateAsync({ email, comments }).then(close)
        })()
      }}
      confirmLabel={m.add}
      loading={_addToBlacklist.isPending}
      confirmDisabled={!isValid}
      title={dialogTitle}
      content={
        <>
          {_addToBlacklist.error instanceof ApiError &&
            ScOption.from(_addToBlacklist.error.details?.id)
              .map((errId) => (
                <Alert dense type="error" deletable gutterBottom>
                  {apiErrorsCode[errId as keyof typeof apiErrorsCode]}
                </Alert>
              ))
              .toUndefined()}
          <Txt color="hint" block gutterBottom>
            {dialogDesc}
          </Txt>
          <Alert type="warning" sx={{ mb: 2 }} dense>
            <Txt bold>{dialogDescAlert}</Txt>
          </Alert>
          <ScInput
            autoFocus
            fullWidth
            label={m.email}
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email', {
              required: m.required,
              pattern: {
                value: emailRegexp,
                message: emailValidationMessage,
              },
            })}
          />
          <Txt color="hint" block gutterTop>
            Inscrivez un petit commentaire pour se rappeler pourquoi il est
            indésirable :
          </Txt>
          <ScInput
            fullWidth
            type="text"
            label={'Commentaire'}
            error={!!errors.comments}
            helperText={errors.comments?.message}
            {...register('comments', {
              required: m.required,
              maxLength: { value: 50, message: m.textTooLarge(50) },
            })}
          />
        </>
      }
    >
      <ScButton
        icon="sentiment_very_dissatisfied"
        variant="contained"
        color="primary"
      >
        {buttonText}
      </ScButton>
    </ScDialog>
  )
}
