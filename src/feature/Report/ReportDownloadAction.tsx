import { useMutation } from '@tanstack/react-query'
import { ReactElement, useState } from 'react'
import { Alert } from '../../alexlibs/mui-extension'
import { Report } from '../../core/client/report/Report'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useI18n } from '../../core/i18n'
import { Id, UploadedFile } from '../../core/model'
import { ScRadioGroup } from '../../shared/RadioGroup'
import { ScRadioGroupItem } from '../../shared/RadioGroupItem'
import { ScDialog } from '../../shared/ScDialog'
import { objectKeysUnsafe } from 'core/helper'

interface Props {
  report: Report
  files: UploadedFile[]
  children: ReactElement<any>
}

export enum DownloadType {
  ReportWithAttachment = 'ReportWithAttachment',
  ReportOnly = 'ReportOnly',
}

export const ReportDownloadAction = ({ report, files, children }: Props) => {
  const { m } = useI18n()
  const { apiSdk } = useConnectedContext()

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
      onConfirm={(event, close) =>
        _download
          .mutateAsync({
            id: report.id,
            reportType:
              downloadReportWithAttachments ??
              DownloadType.ReportWithAttachment,
          })
          .finally(close)
      }
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
