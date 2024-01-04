import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {Box} from '@mui/material'
import {Btn, Txt} from '../../alexlibs/mui-extension'
import {ReportFiles} from './File/ReportFiles'
import React, {ReactNode} from 'react'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {Divider} from '../../shared/Divider'
import {EventActionValues, ReportAction} from '../../core/client/event/Event'
import {FileOrigin, UploadedFile} from '../../core/client/file/UploadedFile'
import {Report} from '../../core/client/report/Report'
import {ReportFileDeleteButton} from './File/ReportFileDownloadAllButton'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {Id} from '../../core/model'
import {GetReportQueryKeys} from '../../core/queryhooks/reportQueryHooks'

interface Props {
  files?: UploadedFile[]
  report: Report
  children?: ReactNode
}

export const ReportDescription = ({report, files, children}: Props) => {
  const {connectedUser, apiSdk} = useLogin()
  const queryClient = useQueryClient()
  const {m} = useI18n()

  const postAction = useMutation({
    mutationFn: (params: {id: Id; action: ReportAction}) => apiSdk.secured.reports.postAction(params.id, params.action),
    onSuccess: () => queryClient.invalidateQueries({queryKey: GetReportQueryKeys(report.id)}),
  })

  return (
    <Panel>
      <PanelBody>
        {report.details.map((detail, i) => (
          <Box key={i} sx={{mb: 1}}>
            <Box
              sx={{fontWeight: t => t.typography.fontWeightBold}}
              dangerouslySetInnerHTML={{__html: detail.label.replace(/:$/, '')}}
            />
            <Box sx={{color: t => t.palette.text.secondary}} dangerouslySetInnerHTML={{__html: detail.value}} />
          </Box>
        ))}
        <Divider margin />
        <div className="flex flex-row ">
          <Txt bold block size="big" gutterBottom>
            {m.attachedFiles}
          </Txt>
          {files && files.filter(_ => _.origin === FileOrigin.Consumer).length > 1 && (
            <ReportFileDeleteButton report={report} fileOrigin={FileOrigin.Consumer} />
          )}
        </div>
        <ReportFiles
          hideAddBtn={!connectedUser.isAdmin}
          files={files?.filter(_ => _.origin === FileOrigin.Consumer)}
          reportId={report.id}
          fileOrigin={FileOrigin.Consumer}
          onNewFile={file => {
            postAction.mutate({
              id: report.id,
              action: {
                details: '',
                fileIds: [file.id],
                actionType: EventActionValues.ConsumerAttachments,
              },
            })
          }}
        />
        {children && (
          <>
            <Divider margin />
            {children}
          </>
        )}
      </PanelBody>
    </Panel>
  )
}
