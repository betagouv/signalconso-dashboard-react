import { Tooltip } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { Btn, Txt } from '../../alexlibs/mui-extension'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { useToast } from '../../core/context/toast/toastContext'
import { useI18n } from '../../core/i18n'
import { Id } from '../../core/model'
import { ScDialog } from '../../shared/ScDialog'

interface Props {
  reportIds: Id[]
}

export const ReportReOpening = ({ reportIds }: Props) => {
  const { m } = useI18n()
  const { api: apiSdk } = useConnectedContext()
  const _reOpenReport = useMutation({
    mutationFn: apiSdk.secured.reports.reOpen,
    onSuccess: () => {
      window.location.reload()
      toastSuccess('Signalement(s) rouvert(s) avec succès.')
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
      onConfirm={(_, close) =>
        _reOpenReport.mutateAsync(reportIds).finally(close)
      }
    >
      <Tooltip title={m.reportReopening}>
        <Btn
          loading={_reOpenReport.isPending}
          variant={'outlined'}
          icon="replay"
        >
          {m.reOpen}
        </Btn>
      </Tooltip>
    </ScDialog>
  )
}
