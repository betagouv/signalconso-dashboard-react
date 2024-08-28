import React, { useState } from 'react'
import { ScButton } from '../../shared/Button'
import { useAsync } from '../../alexlibs/react-hooks-lib'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { MenuItem, Select } from '@mui/material'
import { ResendEmailType } from '../../core/client/admin/ResendEmailType'
import { PeriodWithTimePicker } from '../../shared/PeriodWithTimePicker'
import { Alert } from '../../alexlibs/mui-extension'
import { CleanWidePanel } from 'shared/Panel/simplePanels'

export const ResendEmailsAdminTool = () => {
  const { apiSdk: api } = useConnectedContext()

  const [periodValue, setPeriodValue] = useState<
    [Date | undefined, Date | undefined]
  >([undefined, undefined])
  const [emailType, setEmailType] = useState<ResendEmailType>(
    'NewReportAckToConsumer',
  )

  const _resendEmails = useAsync(api.secured.admin.resendEmails)

  const handleClick = () => {
    if (periodValue[0] && periodValue[1]) {
      return _resendEmails.call(periodValue[0], periodValue[1], emailType)
    }
    return Promise.resolve()
  }

  return (
    <CleanWidePanel>
      <h2 className="font-bold text-lg mb-2">Renvoi d'emails</h2>
      <div>
        Cet outil a pour but de renvoyer les emails lors d'une défaillance
        Brevo. Les emails pouvant être renvoyés sont :
        <ul className="list-disc pl-4 my-4">
          <li>
            Accusé de réception d'un signalement au consommateur l'ayant soumis
          </li>
          <li>Notification d'un nouveau signalement au professionnel</li>
          <li>
            Notification d'un nouveau signalement concernant un produit
            dangereux à la DGCCRF
          </li>
          <li>
            Notification d'une réponse d'un professionnel sur un signalement au
            consommateur
          </li>
        </ul>
        <Alert type="warning" className={'my-4'}>
          Les dates doivent être saisies avec la timezone locale{' '}
          <b>(pas UTC)</b>
        </Alert>
        <div className="flex flex-col gap-2">
          <PeriodWithTimePicker
            value={periodValue}
            onChange={setPeriodValue}
            sx={{ mr: 1 }}
            fullWidth
          />
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={emailType}
            label="Type d'email"
            onChange={(t) => {
              setEmailType(t.target.value as ResendEmailType)
            }}
          >
            <MenuItem value={'NewReportAckToConsumer'}>
              Nouveau signalement au conso
            </MenuItem>
            <MenuItem value={'NewReportAckToPro'}>
              Nouveau signalement au pro
            </MenuItem>
            <MenuItem value={'NotifyDGCCRF'}>Produit dangereux</MenuItem>
            <MenuItem value={'ReportProResponse'}>
              Réponse du pro au conso
            </MenuItem>
          </Select>
          <ScButton
            onClick={handleClick}
            color="primary"
            disabled={!periodValue[0] || !periodValue[1]}
          >
            Renvoyer
          </ScButton>
        </div>
      </div>
    </CleanWidePanel>
  )
}
