import {Panel, PanelBody} from '../../shared/Panel'
import {Divider} from '@material-ui/core'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {ReportFiles} from './File/ReportFiles'
import {EventActionValues, FileOrigin, Report, UploadedFile} from '@betagouv/signalconso-api-sdk-js'
import React, {ReactNode} from 'react'
import {useReportContext} from '../../core/context/ReportContext'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {useCssUtils} from '../../core/helper/useCssUtils'

interface Props {
  files?: UploadedFile[]
  report: Report
  children?: ReactNode
}

export const ReportDescription = ({report, files, children}: Props) => {
  const _report = useReportContext()
  const {connectedUser} = useLogin()
  const {m} = useI18n()
  const cssUtils = useCssUtils()

  return (
    <Panel>
      <PanelBody>
        {report.details.map((detail, i) => (
          <div key={i} className={cssUtils.marginBottom}>
            <div className={cssUtils.txtBold} dangerouslySetInnerHTML={{__html: detail.label.replace(/\:$/, '')}} />
            <div className={cssUtils.colorTxtSecondary} dangerouslySetInnerHTML={{__html: detail.value}} />
          </div>
        ))}
        <Divider className={cssUtils.divider} />
        <Txt bold block gutterBottom>
          {m.attachedFiles}
        </Txt>
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
            <Divider className={cssUtils.divider} />
            {children}
          </>
        )}
      </PanelBody>
    </Panel>
  )
}
