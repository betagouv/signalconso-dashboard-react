import { useMutation } from '@tanstack/react-query'
import { useConnectedContext } from 'core/context/ConnectedContext'
import { useI18n } from 'core/i18n'
import {
  EventCategories,
  ExportsActions,
  trackEvent,
} from 'core/plugins/Matomo'
import React from 'react'
import { Id } from '../../core/model'
import { ScButton } from '../../shared/Button'
import { DatatableToolbar } from '../../shared/Datatable/DatatableToolbar'
import { ReportReOpening } from '../Report/ReportReOpening'

type SelectReportType = {
  size: number
  clear: () => void
  toArray: () => Array<Id>
}

type DatatableToolbarComponentProps = {
  selectReport: SelectReportType
  canReOpen: boolean
}

export const DatatableToolbarComponent: React.FC<
  DatatableToolbarComponentProps
> = ({ selectReport, canReOpen }) => {
  const { api: apiSdk, connectedUser: user } = useConnectedContext()
  const { m } = useI18n()
  const downloadReports = useMutation({
    mutationFn: apiSdk.secured.reports.download,
  })
  return (
    <DatatableToolbar
      open={selectReport.size > 0}
      onClear={selectReport.clear}
      actions={
        <div className="flex flex-row gap-2">
          <ScButton
            loading={downloadReports.isPending}
            variant="contained"
            icon="file_download"
            onClick={() => {
              trackEvent(
                user,
                EventCategories.Exports,
                ExportsActions.exportReportsPdf,
              )
              downloadReports.mutate(selectReport.toArray())
            }}
            sx={{
              marginLeft: 'auto',
            }}
          >
            Télécharger
          </ScButton>
          {canReOpen && <ReportReOpening reportIds={selectReport.toArray()} />}
        </div>
      }
    >
      <span
        dangerouslySetInnerHTML={{ __html: m.nSelected(selectReport.size) }}
      />
    </DatatableToolbar>
  )
}
