import { useMutation } from '@tanstack/react-query'
import { useConnectedContext } from 'core/context/ConnectedContext'
import { useI18n } from 'core/i18n'
import { ScButton } from '../../shared/Button'
import { DatatableToolbar } from '../../shared/Datatable/DatatableToolbar'

type SelectReportType = {
  size: number
  clear: () => void
  toArray: () => Array<any>
}

type DatatableToolbarComponentProps = {
  selectReport: SelectReportType
}

export const DatatableToolbarComponent: React.FC<
  DatatableToolbarComponentProps
> = ({ selectReport }) => {
  const { apiSdk } = useConnectedContext()
  const { m } = useI18n()
  const downloadReports = useMutation({
    mutationFn: apiSdk.secured.reports.download,
  })
  return (
    <DatatableToolbar
      open={selectReport.size > 0}
      onClear={selectReport.clear}
      actions={
        <ScButton
          loading={downloadReports.isPending}
          variant="contained"
          icon="file_download"
          onClick={() => downloadReports.mutate(selectReport.toArray())}
          sx={{
            marginLeft: 'auto',
          }}
        >
          {m.download}
        </ScButton>
      }
    >
      <span
        dangerouslySetInnerHTML={{ __html: m.nSelected(selectReport.size) }}
      />
    </DatatableToolbar>
  )
}
