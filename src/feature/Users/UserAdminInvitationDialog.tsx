import { Controller, useForm } from 'react-hook-form'
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
import { RoleAdmins } from '../../core/client/user/User'
import { List, ListItem, ToggleButton, ToggleButtonGroup } from '@mui/material'
import React from 'react'

export const UserAdminInvitationDialog = () => {
  const { m } = useI18n()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<{ role: RoleAdmins; email: string }>({ mode: 'onChange' })
  const { toastSuccess } = useToast()
  const { api } = useApiContext()

  const _invite = useMutation<
    void,
    ApiError,
    { role: RoleAdmins; email: string },
    unknown
  >({
    mutationFn: (params: { role: RoleAdmins; email: string }) =>
      api.secured.user.inviteAdmin(params.email, params.role),
  })
  const buttonLabel = m.invite_admin
  const dialogTitle = m.users_invite_dialog_title_admin
  const dialogDesc = m.users_invite_dialog_desc_admin
  const emailRegexp = regexp.emailAdmin
  const emailValidationMessage = m.emailAdminValidation

  return (
    <ScDialog
      maxWidth="sm"
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
          <Alert type="warning" sx={{ mb: 2 }} dense>
            <Txt bold>{m.users_invite_dialog_alert_admin}</Txt>
          </Alert>
          <Txt color="hint" block gutterBottom>
            Sélectionner le type d'administrateur que vous souhaitez inviter
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
                <ToggleButton value="Admin">Admin</ToggleButton>
                <ToggleButton value="SuperAdmin">Super Admin</ToggleButton>
                <ToggleButton value="ReadOnlyAdmin">
                  Admin lecture seule
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          />
          <ul className="text-sm pl-4 mt-2 list-disc italic text-gray-600">
            <li>
              Un <strong>super admin</strong> aura tous les droits (réservé aux
              dev et aux PO)
            </li>
            <li>
              Un <strong>admin</strong> aura les mêmes droits sauf l'accès aux
              outils de devs et à la gestion des administrateurs
            </li>
            <li>
              Un <strong>admin lecture seule</strong> verra tout ce que voit un
              admin mais ne pourra pas agir
            </li>
          </ul>
          <Txt color="hint" block gutterBottom sx={{ mt: 4 }}>
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
