import {useForm} from 'react-hook-form'
import {Alert, Txt} from '../../alexlibs/mui-extension'
import {useUsersContext} from '../../core/context/UsersContext'
import {regexp} from '../../core/helper/regexp'
import {useI18n} from '../../core/i18n'
import {useToast} from '../../core/toast'
import {ScButton} from '../../shared/Button/Button'
import {ScInput} from '../../shared/Input/ScInput'

import {ScOption} from 'core/helper/ScOption'
import {ScDialog} from '../../shared/Confirm/ScDialog'

export const UserInvitationDialog = ({kind}: {kind: 'admin' | 'dgccrf'}) => {
  const {m} = useI18n()
  const {
    register,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<{email: string}>({mode: 'onChange'})
  const _invite = useUsersContext().invite
  const {toastSuccess} = useToast()

  const buttonLabel = kind === 'admin' ? m.invite_admin : m.invite_dgccrf
  const dialogTitle = kind === 'admin' ? m.users_invite_dialog_title_admin : m.users_invite_dialog_title_dgcrrf
  const dialogDesc = kind === 'admin' ? m.users_invite_dialog_desc_admin : m.users_invite_dialog_desc_dgccrf
  const emailRegexp = kind === 'admin' ? regexp.emailAdmin : regexp.emailDGCCRF
  const emailValidationMessage = kind === 'admin' ? m.emailAdminValidation : m.emailDGCCRFValidation

  return (
    <ScDialog
      maxWidth="xs"
      onConfirm={(event, close) => {
        handleSubmit(({email}) => {
          _invite
            .fetch({}, email)
            .then(() => toastSuccess(m.userInvitationSent))
            .then(close)
        })()
      }}
      confirmLabel={m.invite}
      loading={_invite.loading}
      confirmDisabled={!isValid}
      title={dialogTitle}
      content={
        <>
          {ScOption.from(_invite.error?.details?.id)
            .map(errId => (
              <Alert dense type="error" deletable gutterBottom>
                {m.apiErrorsCode[errId as keyof typeof m.apiErrorsCode]}
              </Alert>
            ))
            .toUndefined()}
          <Txt color="hint" block gutterBottom>
            {dialogDesc}
          </Txt>
          {kind === 'admin' && (
            <Alert type="warning" sx={{mb: 2}} dense>
              <Txt bold>{m.users_invite_dialog_alert_admin}</Txt>
            </Alert>
          )}
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
      <ScButton sx={{ml: 2}} icon="person_add" variant="contained" color={kind === 'admin' ? 'primary' : 'primary'}>
        {buttonLabel}
      </ScButton>
    </ScDialog>
  )
}
