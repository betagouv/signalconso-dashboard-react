import { useMutation } from '@tanstack/react-query'
import { useConnectedContext } from 'core/context/connected/connectedContext'
import { useI18n } from 'core/i18n'
import {
  EventCategories,
  ExportsActions,
  trackEvent,
} from 'core/plugins/Matomo'
import React from 'react'
import { Id, ReportSearch } from '../../core/model'
import { ScButton } from '../../shared/Button'
import { DatatableToolbar } from '../../shared/Datatable/DatatableToolbar'
import { ReportReOpening } from '../Report/ReportReOpening'
import { publicApiSdk } from '../../core/apiSdkInstances'

type SelectReportType = {
  size: number
  clear: () => void
  toArray: () => Array<Id>
}

type DatatableToolbarComponentProps = {
  selectReport: SelectReportType
  canReOpen: boolean
  reportFilter: ReportSearch
}

export const DatatableToolbarComponent: React.FC<
  DatatableToolbarComponentProps
> = ({ selectReport, canReOpen, reportFilter }) => {
  const { api: apiSdk, connectedUser: user } = useConnectedContext()
  const { m } = useI18n()
  const MAX_ALLOWED_DOWNLOADS = 25

  const downloadReports = useMutation({
    mutationFn: ({
      ids,
      reportFilter,
    }: {
      ids: Id[]
      reportFilter: ReportSearch
    }) => apiSdk.secured.reports.download(ids, reportFilter),
  })
  const downloadReportsWithAttachments = useMutation({
    mutationFn: ({
      ids,
      reportFilter,
    }: {
      ids: Id[]
      reportFilter: ReportSearch
    }) => apiSdk.secured.reports.downloadZip(ids, reportFilter),
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
              downloadReports.mutate({
                ids: selectReport.toArray(),
                reportFilter,
              })
            }}
            sx={{
              marginLeft: 'auto',
            }}
          >
            Export
          </ScButton>
          {user.isNotPro && (
            <ScButton
              loading={downloadReportsWithAttachments.isPending}
              variant="contained"
              icon="file_download"
              disabled={selectReport.size > MAX_ALLOWED_DOWNLOADS}
              onClick={() => {
                trackEvent(
                  user,
                  EventCategories.Exports,
                  ExportsActions.exportReportsPdf,
                )
                downloadReportsWithAttachments.mutate({
                  ids: selectReport.toArray(),
                  reportFilter,
                })
              }}
              sx={{
                marginLeft: 'auto',
              }}
            >
              Export avec Pièces jointes &nbsp;
              {selectReport.size > MAX_ALLOWED_DOWNLOADS ? (
                <span className={'text-red-400'}>
                  ({MAX_ALLOWED_DOWNLOADS} MAX)
                </span>
              ) : (
                <></>
              )}
            </ScButton>
          )}
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
