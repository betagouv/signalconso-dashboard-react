import { useMutation } from '@tanstack/react-query'
import { ReactElement } from 'react'
import { Btn, Txt } from '../../alexlibs/mui-extension'
import { Report } from '../../core/client/report/Report'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useToast } from '../../core/context/toastContext'
import { useI18n } from '../../core/i18n'
import { ScDialog } from '../../shared/ScDialog'

interface Props {
  report: Report
  children: ReactElement<any>
}

export const ReportReOpening = ({ report, children }: Props) => {
  const { m } = useI18n()
  const { api: apiSdk } = useConnectedContext()
  const _reOpenReport = useMutation({
    mutationFn: apiSdk.secured.reports.reOpen,
    onSuccess: () => {
      window.location.reload()
      toastSuccess('Signalement ré-ouvert avec succès.')
    },
  })
  const { toastSuccess } = useToast()

  return (
    <ScDialog
      title={m.reOpenReportDesc}
      content={
        <>
          <Txt className={'mt-3'} color="hint" block size="small" italic>
            Le professionnel sera informé par email de la réouverture de son
            signalement et disposera de 3 jours pour y répondre. Passé ce délai,
            le signalement sera clôturé automatiquement.
          </Txt>
        </>
      }
      onConfirm={(event, close) =>
        _reOpenReport.mutateAsync(report.id).finally(close)
      }
    >
      <Btn loading={_reOpenReport.isPending} icon="replay">
        {m.reOpen}
      </Btn>
    </ScDialog>
  )
}
