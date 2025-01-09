import { useMutation } from '@tanstack/react-query'
import { objectKeysUnsafe } from 'core/helper'
import {
  EventCategories,
  ExportsActions,
  trackEvent,
} from 'core/plugins/Matomo'
import { ReactElement, useState } from 'react'
import { Alert } from '../../alexlibs/mui-extension'
import { Report } from '../../core/client/report/Report'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useI18n } from '../../core/i18n'
import { Id, UploadedFile, User } from '../../core/model'
import { ScRadioGroup } from '../../shared/RadioGroup'
import { ScRadioGroupItem } from '../../shared/RadioGroupItem'
import { ScDialog } from '../../shared/ScDialog'

interface Props {
  report: Report
  files: UploadedFile[]
  children: ReactElement<any>
}

export enum DownloadType {
  ReportWithAttachment = 'ReportWithAttachment',
  ReportOnly = 'ReportOnly',
}

export function trackReportDownload(user: User, downloadType: DownloadType) {
  trackEvent(
    user,
    EventCategories.Exports,
    downloadType === DownloadType.ReportWithAttachment
      ? ExportsActions.exportReportZip
      : ExportsActions.exportReportPdf,
  )
}

export const ReportDownloadAction = ({ report, files, children }: Props) => {
  const { m } = useI18n()
  const { api: apiSdk, connectedUser: user } = useConnectedContext()

  const _download = useMutation({
    mutationFn: (params: { id: Id; reportType: DownloadType }) => {
      return params.reportType === DownloadType.ReportWithAttachment
        ? apiSdk.secured.reports.downloadZip(report)
        : apiSdk.secured.reports.download([params.id])
    },
    onSuccess: () => {
      setDownloadReportWithAttachments(DownloadType.ReportWithAttachment)
    },
  })
  const [downloadReportWithAttachments, setDownloadReportWithAttachments] =
    useState<DownloadType>(DownloadType.ReportWithAttachment)

  return (
    <ScDialog
      title={m.reportDownload}
      loading={_download.isPending}
      onConfirm={(event, close) => {
        const downloadType =
          downloadReportWithAttachments ?? DownloadType.ReportWithAttachment
        trackReportDownload(user, downloadType)
        _download
          .mutateAsync({
            id: report.id,
            reportType: downloadType,
          })
          .finally(close)
      }}
      confirmLabel={m.validate}
      content={
        <>
          {_download.error && <Alert type="error">{m.anErrorOccurred}</Alert>}
          <ScRadioGroup
            value={DownloadType.ReportWithAttachment}
            onChange={(choice) => {
              setDownloadReportWithAttachments(choice)
            }}
          >
            {objectKeysUnsafe(DownloadType).map((downloadType) => (
              <ScRadioGroupItem
                title={m.reportDownloadTypeTitle[DownloadType[downloadType]]}
                description={
                  m.reportDownloadTypeDescription[DownloadType[downloadType]]
                }
                value={downloadType}
                key={downloadType}
              />
            ))}
          </ScRadioGroup>
        </>
      }
    >
      {children}
    </ScDialog>
  )
}
