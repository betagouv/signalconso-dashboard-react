import { Controller, useForm } from 'react-hook-form'
import { Alert, Txt } from '../../alexlibs/mui-extension'
import { apiErrorsCode, useToast } from '../../core/context/toast/toastContext'
import { regexp } from '../../core/helper/regexp'
import { useI18n } from '../../core/i18n'
import { ScButton } from '../../shared/Button'
import { ScInput } from '../../shared/ScInput'

import { MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { ScOption } from 'core/helper/ScOption'
import { AuthProvider, RoleAgents } from 'core/model'
import { ApiError } from '../../core/client/ApiClient'
import { useApiContext } from '../../core/context/ApiContext'
import { ScDialog } from '../../shared/ScDialog'
import { ScSelect } from '../../shared/Select/Select'

export const UserAgentInvitationDialog = () => {
  const { m } = useI18n()
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm<{ role: RoleAgents; email: string; authProvider: AuthProvider }>({
    mode: 'onChange',
  })
  const { toastSuccess } = useToast()
  const { api } = useApiContext()
  const _role = watch('role')

  const selectFromRole = <T,>(
    role: RoleAgents,
    dgccrf: T,
    dgal: T,
    ssmvm: T,
  ) => {
    switch (role) {
      case 'DGCCRF':
        return dgccrf
      case 'DGAL':
        return dgal
      case 'SSMVM':
        return ssmvm
    }
  }

  const _invite = useMutation<
    void,
    ApiError,
    { email: string; role: RoleAgents; authProvider?: AuthProvider },
    unknown
  >({
    mutationFn: (params: {
      email: string
      role: RoleAgents
      authProvider?: AuthProvider
    }) =>
      api.secured.user.inviteAgent(
        params.email,
        params.role,
        params.authProvider,
      ),
  })
  const emailRegexp = selectFromRole(
    _role,
    regexp.emailDGCCRF,
    regexp.emailDGAL,
    regexp.emailSSMVM,
  )
  const emailValidationMessage = selectFromRole(
    _role,
    m.emailDGCCRFValidation,
    m.emailDGALValidation,
    m.emailSSMVMValidation,
  )
  const buttonLabel = m.invite_agent
  const dialogTitle = m.users_invite_dialog_title_agent
  const dialogDesc = m.users_invite_dialog_desc_agent

  return (
    <ScDialog
      maxWidth="xs"
      onConfirm={(event, close) => {
        handleSubmit(({ role, email, authProvider }) => {
          _invite
            .mutateAsync({ email, role, authProvider })
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
                {apiErrorsCode[errId as keyof typeof apiErrorsCode]}
              </Alert>
            ))
            .toUndefined()}
          <Txt color="hint" block gutterBottom>
            Sélectionner le type d'agent que vous souhaitez inviter
          </Txt>
          <Controller
            name="role"
            control={control}
            rules={{
              required: m.required,
            }}
            render={({ field }) => (
              <ToggleButtonGroup
                color="primary"
                fullWidth
                exclusive
                value={field.value}
                onChange={field.onChange}
              >
                <ToggleButton value="DGCCRF">DGCCRF</ToggleButton>
                <ToggleButton value="DGAL">DGAL</ToggleButton>
                <ToggleButton value="SSMVM">SSMVM</ToggleButton>
              </ToggleButtonGroup>
            )}
          />
          <Alert
            id="agent-invitation-select"
            dense
            type="warning"
            sx={{ mb: 2 }}
          >
            <>
              Vérifiez bien le type d'agent sélectionné,{' '}
              <u>
                <b>ils n'ont pas les même droits !</b>
              </u>
            </>
          </Alert>

          <Txt color="hint" block gutterBottom>
            {dialogDesc}
          </Txt>
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
          {_role === 'DGCCRF' && (
            <Controller
              name="authProvider"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <ScSelect
                  value={field.value}
                  onChange={field.onChange}
                  label={"Fournisseur d'authentification"}
                  fullWidth
                >
                  <MenuItem value={AuthProvider.SignalConso}>
                    Signal Conso
                  </MenuItem>
                  <MenuItem value={AuthProvider.ProConnect}>
                    Pro Connect
                  </MenuItem>
                </ScSelect>
              )}
            />
          )}
        </>
      }
    >
      <ScButton icon="person_add" variant="outlined" color="primary">
        {buttonLabel}
      </ScButton>
    </ScDialog>
  )
}
