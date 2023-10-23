import {useI18n} from '../../core/i18n'
import React from 'react'
import {Controller, useForm} from 'react-hook-form'
import {RoleAgents} from '../../core/client/user/User'
import {useUsersContext} from '../../core/context/UsersContext'
import {useToast} from '../../core/toast'
import {ScDialog} from '../../shared/ScDialog'
import {ScOption} from '../../core/helper/ScOption'
import {Alert, Txt} from '../../alexlibs/mui-extension'
import {ToggleButton, ToggleButtonGroup} from '@mui/material'
import {ScButton} from '../../shared/Button'

export const UserAgentsImportDialog = () => {
  const {m} = useI18n()
  const {
    register,
    handleSubmit,
    control,
    formState: {isValid},
  } = useForm<{role: RoleAgents; emailFiles: FileList}>({mode: 'onChange'})
  const usersContext = useUsersContext()
  const {toastSuccess} = useToast()

  const _invite = usersContext.importAgents

  return (
    <ScDialog
      maxWidth="xs"
      onConfirm={(event, close) => {
        handleSubmit(({role, emailFiles}) => {
          if (emailFiles && emailFiles[0]) {
            _invite
              .fetch({}, emailFiles[0], role)
              .then(() => toastSuccess(m.userInvitationsSent))
              .then(close)
          }
        })()
      }}
      confirmLabel="Importer"
      loading={_invite?.loading}
      confirmDisabled={!isValid}
      title="Inviter des agents"
      content={
        <>
          {ScOption.from(_invite?.error?.details?.id)
            .map(errId => (
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
            render={({field}) => (
              <ToggleButtonGroup color="primary" fullWidth value={field.value} onChange={field.onChange}>
                <ToggleButton value="DGCCRF">DGCCRF</ToggleButton>
                <ToggleButton value="DGAL">DGAL</ToggleButton>
              </ToggleButtonGroup>
            )}
          />
          <Alert id="agent-invitation-select" dense type="warning" sx={{mb: 2}}>
            <>
              Vérifiez bien le type d'agent sélectionné,{' '}
              <u>
                <b>ils n'ont pas les même droits !</b>
              </u>
            </>
          </Alert>

          <Txt color="hint" block gutterBottom>
            Pour inviter plusieurs agents à la fois, créez un fichier contenant la liste des emails. Séparez chaque email par une
            virgule, ou bien mettez une adresse par ligne. Un courrier électronique sera envoyé à chaque adresse e-mail saisie
            dans le fichier avec un lien sécurisé permettant de créer un compte DGCCRF / DGAL.
          </Txt>
          <input type="file" {...register('emailFiles', {required: m.required})} />
        </>
      }
    >
      <ScButton icon="person_add" variant="outlined" color="primary">
        Importer
      </ScButton>
    </ScDialog>
  )
}
