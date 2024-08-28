import { ScButton } from '../../shared/Button'
import { DatatableToolbar } from '../../shared/Datatable/DatatableToolbar'

type SelectReportType = {
  size: number
  clear: () => void
  toArray: () => Array<any>
}

type DownloadReportsType = {
  isPending: boolean
  mutate: (items: Array<any>) => void
}

type MType = {
  download: string
  nSelected: (size: number) => string
}

type DatatableToolbarComponentProps = {
  selectReport: SelectReportType
  downloadReports: DownloadReportsType
  m: MType
}

const DatatableToolbarComponent: React.FC<DatatableToolbarComponentProps> = ({
  selectReport,
  downloadReports,
  m,
}) => {
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

export default DatatableToolbarComponent
