import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {Box} from '@mui/material'
import {Btn, Txt} from '../../alexlibs/mui-extension'
import {ReportFiles} from './File/ReportFiles'
import React, {ReactNode} from 'react'
import {useReportContext} from '../../core/context/ReportContext'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {Divider} from '../../shared/Divider'
import {EventActionValues} from '../../core/client/event/Event'
import {FileOrigin, UploadedFile} from '../../core/client/file/UploadedFile'
import {Report} from '../../core/client/report/Report'
import {ReportFileDeleteButton} from './File/ReportFileDownloadAllButton'

interface Props {
  files?: UploadedFile[]
  report: Report
  children?: ReactNode
}

export const ReportDescription = ({report, files, children}: Props) => {
  const _report = useReportContext()
  const {connectedUser} = useLogin()
  const {m} = useI18n()
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
          <ReportFileDeleteButton reportId={report.id} fileOrigin={FileOrigin.Consumer} />
        </div>
        <ReportFiles
          hideAddBtn={!connectedUser.isAdmin}
          files={files?.filter(_ => _.origin === FileOrigin.Consumer)}
          reportId={report.id}
          fileOrigin={FileOrigin.Consumer}
          onNewFile={file => {
            _report.postAction
              .fetch({}, report.id, {
                details: '',
                fileIds: [file.id],
                actionType: EventActionValues.ConsumerAttachments,
              })
              .then(() => _report.get.fetch({force: true, clean: false}, report.id))
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
