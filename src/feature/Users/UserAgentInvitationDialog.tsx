import { Controller, useForm } from 'react-hook-form'
import { Alert, Txt } from '../../alexlibs/mui-extension'
import { regexp } from '../../core/helper/regexp'
import { useI18n } from '../../core/i18n'
import { useToast } from '../../core/toast'
import { ScButton } from '../../shared/Button'
import { ScInput } from '../../shared/ScInput'

import { ScOption } from 'core/helper/ScOption'
import { ScDialog } from '../../shared/ScDialog'
import { RoleAgents } from 'core/model'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { ApiError } from '../../core/client/ApiClient'
import { useApiContext } from '../../core/context/ApiContext'

export const UserAgentInvitationDialog = () => {
  const { m } = useI18n()
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm<{ role: RoleAgents; email: string }>({ mode: 'onChange' })
  const { toastSuccess } = useToast()
  const { api } = useApiContext()
  const _role = watch('role')

  const selectFromRole = <T,>(role: RoleAgents, dgccrf: T, dgal: T) => {
    switch (role) {
      case 'DGCCRF':
        return dgccrf
      case 'DGAL':
        return dgal
    }
  }

  const _invite = useMutation<
    void,
    ApiError,
    { email: string; role: RoleAgents },
    unknown
  >({
    mutationFn: (params: { email: string; role: RoleAgents }) =>
      api.secured.user.inviteAgent(params.email, params.role),
  })
  const emailRegexp = selectFromRole(
    _role,
    regexp.emailDGCCRF,
    regexp.emailDGAL,
  )
  const emailValidationMessage = selectFromRole(
    _role,
    m.emailDGCCRFValidation,
    m.emailDGALValidation,
  )
  const buttonLabel = m.invite_agent
  const dialogTitle = m.users_invite_dialog_title_agent
  const dialogDesc = m.users_invite_dialog_desc_agent

  return (
    <ScDialog
      maxWidth="xs"
      onConfirm={(event, close) => {
        handleSubmit(({ role, email }) => {
          _invite
            .mutateAsync({ email, role })
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
                value={field.value}
                onChange={field.onChange}
              >
                <ToggleButton value="DGCCRF">DGCCRF</ToggleButton>
                <ToggleButton value="DGAL">DGAL</ToggleButton>
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
        </>
      }
    >
      <ScButton icon="person_add" variant="outlined" color="primary">
        {buttonLabel}
      </ScButton>
    </ScDialog>
  )
}
