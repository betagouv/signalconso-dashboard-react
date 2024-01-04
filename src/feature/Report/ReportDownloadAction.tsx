import React, {ReactElement, useState} from 'react'
import {Alert} from '../../alexlibs/mui-extension'
import {useI18n} from '../../core/i18n'
import {useLogin} from '../../core/context/LoginContext'
import {ScDialog} from '../../shared/ScDialog'
import {Report} from '../../core/client/report/Report'
import {useMutation} from '@tanstack/react-query'
import {Id, UploadedFile} from '../../core/model'
import {ScRadioGroup} from '../../shared/RadioGroup'
import {Enum} from '../../alexlibs/ts-utils'
import {ScRadioGroupItem} from '../../shared/RadioGroupItem'

interface Props {
  report: Report
  files: UploadedFile[]
  children: ReactElement<any>
}

export enum DownloadType {
  ReportWithAttachment = 'ReportWithAttachment',
  ReportOnly = 'ReportOnly',
}

export const ReportDownloadAction = ({report, files, children}: Props) => {
  const {m} = useI18n()
  const {apiSdk} = useLogin()

  const _download = useMutation({
    mutationFn: (params: {id: Id; reportType: DownloadType}) => {
      return params.reportType === DownloadType.ReportWithAttachment
        ? apiSdk.secured.reports.downloadZip(report)
        : apiSdk.secured.reports.download([params.id])
    },
    onSuccess: () => {
      setDownloadReportWithAttachments(DownloadType.ReportWithAttachment)
    },
  })
  const [downloadReportWithAttachments, setDownloadReportWithAttachments] = useState<DownloadType>(
    DownloadType.ReportWithAttachment,
  )

  return (
    <ScDialog
      title={m.reportDownload}
      loading={_download.isPending}
      onConfirm={(event, close) =>
        _download
          .mutateAsync({
            id: report.id,
            reportType: downloadReportWithAttachments ?? DownloadType.ReportWithAttachment,
          })
          .finally(close)
      }
      confirmLabel={m.validate}
      content={
        <>
          {_download.error && <Alert type="error">{m.anErrorOccurred}</Alert>}
          <ScRadioGroup
            value={DownloadType.ReportWithAttachment}
            onChange={choice => {
              setDownloadReportWithAttachments(choice)
            }}
          >
            {Enum.keys(DownloadType).map(downloadType => (
              <ScRadioGroupItem
                title={m.reportDownloadTypeTitle[DownloadType[downloadType]]}
                description={m.reportDownloadTypeDescription[DownloadType[downloadType]]}
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
