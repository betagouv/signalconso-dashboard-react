import { useForm } from 'react-hook-form'
import { Alert, Txt } from '../../alexlibs/mui-extension'
import { regexp } from '../../core/helper/regexp'
import { useI18n } from '../../core/i18n'
import { useToast } from '../../core/toast'
import { ScButton } from '../../shared/Button'
import { ScInput } from '../../shared/ScInput'

import { ScOption } from 'core/helper/ScOption'
import { ScDialog } from '../../shared/ScDialog'
import { useMutation } from '@tanstack/react-query'
import { useApiContext } from '../../core/context/ApiContext'
import { ApiError } from '../../core/client/ApiClient'

export const UserAdminInvitationDialog = () => {
  const { m } = useI18n()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<{ email: string }>({ mode: 'onChange' })
  const { toastSuccess } = useToast()
  const { api } = useApiContext()

  const _invite = useMutation<void, ApiError, string, unknown>({
    mutationFn: api.secured.user.inviteAdmin,
  })
  const buttonLabel = m.invite_admin
  const dialogTitle = m.users_invite_dialog_title_admin
  const dialogDesc = m.users_invite_dialog_desc_admin
  const emailRegexp = regexp.emailAdmin
  const emailValidationMessage = m.emailAdminValidation

  return (
    <ScDialog
      maxWidth="xs"
      onConfirm={(event, close) => {
        handleSubmit(({ email }) => {
          _invite
            .mutateAsync(email)
            .then(() => toastSuccess(m.userInvitationSent))
            .then(close)
        })()
      }}
      confirmLabel={m.invite}
      loading={_invite.isPending}
      confirmDisabled={!isValid}
      title={dialogTitle}
      content={
        <>
          {ScOption.from(_invite.error?.details?.id)
            .map((errId) => (
              <Alert dense type="error" deletable gutterBottom>
                {m.apiErrorsCode[errId as keyof typeof m.apiErrorsCode]}
              </Alert>
            ))
            .toUndefined()}
          <Txt color="hint" block gutterBottom>
            {dialogDesc}
          </Txt>
          <Alert type="warning" sx={{ mb: 2 }} dense>
            <Txt bold>{m.users_invite_dialog_alert_admin}</Txt>
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
        </>
      }
    >
      <ScButton icon="person_add" variant="outlined" color="primary">
        {buttonLabel}
      </ScButton>
    </ScDialog>
  )
}
