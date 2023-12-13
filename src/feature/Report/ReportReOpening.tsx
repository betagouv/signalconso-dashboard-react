import React, {ReactElement} from 'react'
import {Btn, Txt} from '../../alexlibs/mui-extension'
import {useI18n} from '../../core/i18n'
import {useLogin} from '../../core/context/LoginContext'
import {useToast} from '../../core/toast'
import {ScDialog} from '../../shared/ScDialog'
import {Report} from '../../core/client/report/Report'
import {useMutation} from '@tanstack/react-query'

interface Props {
  report: Report
  children: ReactElement<any>
}

export const ReportReOpening = ({report, children}: Props) => {
  const {m} = useI18n()
  const {apiSdk} = useLogin()
  const _reOpenReport = useMutation(apiSdk.secured.reports.reOpen)
  const {toastSuccess} = useToast()

  return (
    <ScDialog
      title={m.reOpenReportDesc}
      content={
        <>
          <Txt className={'mt-3'} color="hint" block size="small" italic>
            Le professionnel sera informé par email de la réouverture de son signalement et disposera de 3 jours pour y répondre.
            Passé ce délai, le signalement sera clôturé automatiquement.
          </Txt>
        </>
      }
      onConfirm={(event, close) =>
        _reOpenReport
          .mutateAsync(report.id)
          .then(() => window.location.reload())
          .then(() => toastSuccess('Signalement ré-ouvert avec succès.'))
          .finally(close)
      }
    >
      <Btn loading={_reOpenReport.isLoading} icon="replay">
        {m.reOpen}
      </Btn>
    </ScDialog>
  )
}
