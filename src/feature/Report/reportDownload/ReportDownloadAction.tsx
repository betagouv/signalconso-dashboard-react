import { useMutation } from '@tanstack/react-query'
import { ReactElement, useState } from 'react'
import { Alert } from '../../../alexlibs/mui-extension'
import { Report } from '../../../core/client/report/Report'
import { useConnectedContext } from '../../../core/context/connected/connectedContext'
import { useI18n } from '../../../core/i18n'
import { Id, UploadedFile } from '../../../core/model'
import { ScRadioGroup } from '../../../shared/RadioGroup'
import { ScRadioGroupItem } from '../../../shared/RadioGroupItem'
import { ScDialog } from '../../../shared/ScDialog'
import {
  DownloadType,
  downloadTypes,
  trackReportDownload,
} from './reportDownloadUtils'

interface Props {
  report: Report
  files: UploadedFile[]
  children: ReactElement<any>
}

export const ReportDownloadAction = ({ report, files, children }: Props) => {
  const { m } = useI18n()
  const { api: apiSdk, connectedUser: user } = useConnectedContext()

  const _download = useMutation({
    mutationFn: (params: { id: Id; reportType: DownloadType }) => {
      return params.reportType === 'reportWithAttachment'
        ? apiSdk.secured.reports.downloadZip(report.id)
        : apiSdk.secured.reports.download(params.id)
    },
    onSuccess: () => {
      setDownloadReportWithAttachments('reportWithAttachment')
    },
  })
  const [downloadReportWithAttachments, setDownloadReportWithAttachments] =
    useState<DownloadType>('reportWithAttachment')

  return (
    <ScDialog
      title={m.reportDownload}
      loading={_download.isPending}
      onConfirm={(event, close) => {
        const downloadType =
          downloadReportWithAttachments ?? 'reportWithAttachment'
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
          <ScRadioGroup<DownloadType>
            value={'reportWithAttachment'}
            onChange={(choice) => {
              setDownloadReportWithAttachments(choice)
            }}
          >
            {downloadTypes.map((downloadType) => (
              <ScRadioGroupItem
                title={m.reportDownloadTypeTitle[downloadType]}
                description={m.reportDownloadTypeDescription[downloadType]}
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
