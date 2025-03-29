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

  return (
    <DatatableToolbar
      open={selectReport.size > 0}
      onClear={selectReport.clear}
      actions={
        <div className="flex flex-row gap-2">
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
