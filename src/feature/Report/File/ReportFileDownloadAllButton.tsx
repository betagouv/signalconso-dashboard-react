import { useI18n } from '../../../core/i18n'
import { useMutation } from '@tanstack/react-query'
import { FileOrigin } from '../../../core/client/file/UploadedFile'
import { Report } from '../../../core/client/report/Report'
import { useApiContext } from '../../../core/context/ApiContext'
import { ScButton } from '../../../shared/Button'

export function ReportFileDownloadAllButton({
  report,
  fileOrigin,
}: {
  report: Report
  fileOrigin?: FileOrigin
}) {
  const { m } = useI18n()
  const { api } = useApiContext()

  const downloadReport = useMutation({
    mutationFn: (params: { report: Report; fileOrigin?: FileOrigin }) =>
      api.secured.reports.downloadAll(params.report, params.fileOrigin),
  })

  const download = (event: any) => {
    event.preventDefault() // Prevent default link behavior
    downloadReport.mutate({ report, fileOrigin })
  }

  return (
    <ScButton
      style={{ textTransform: 'none', textDecoration: 'underline' }}
      onClick={download}
      loading={downloadReport.isPending}
    >
      ({m.downloadAll})
    </ScButton>
  )
}
