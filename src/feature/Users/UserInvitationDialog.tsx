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
import {RoleAdminOrDggcrf} from 'core/model'

export const UserInvitationDialog = ({role}: {role: RoleAdminOrDggcrf}) => {
  const {m} = useI18n()
  const {
    register,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<{email: string}>({mode: 'onChange'})
  const usersContext = useUsersContext()
  const {toastSuccess} = useToast()

  const _invite = role === 'Admin' ? usersContext.inviteAdmin : usersContext.inviteDgccrf
  const buttonLabel = role === 'Admin' ? m.invite_admin : m.invite_dgccrf
  const dialogTitle = role === 'Admin' ? m.users_invite_dialog_title_admin : m.users_invite_dialog_title_dgcrrf
  const dialogDesc = role === 'Admin' ? m.users_invite_dialog_desc_admin : m.users_invite_dialog_desc_dgccrf
  const emailRegexp = role === 'Admin' ? regexp.emailAdmin : regexp.emailDGCCRF
  const emailValidationMessage = role === 'Admin' ? m.emailAdminValidation : m.emailDGCCRFValidation

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
          {role === 'Admin' && (
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
      <ScButton icon="person_add" variant="outlined" color="primary">
        {buttonLabel}
      </ScButton>
    </ScDialog>
  )
}
