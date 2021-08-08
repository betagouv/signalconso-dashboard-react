import {Panel, PanelBody} from '../../shared/Panel'
import {ReportStatusChip} from '../../shared/ReportStatus/ReportStatus'
import {Alert, Btn, Confirm} from 'mui-extension/lib'
import {ReportCategories} from './ReportCategories'
import {Divider, Icon, makeStyles, Theme, Tooltip} from '@material-ui/core'
import {EventActionValues, FileOrigin, Id, Report, ReportStatus, UploadedFile} from '../../core/api'
import {ReportFiles} from './File/ReportFiles'
import {PanelFoot} from '../../shared/Panel/PanelFoot'
import {ScChip} from '../../shared/Chip/ScChip'
import {ReportAddComment} from './ReportAddComment'
import React from 'react'
import {utilsStyles} from '../../core/theme'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {useI18n} from '../../core/i18n'
import {useReportContext} from '../../core/context/ReportContext'
import {useLogin} from '../../core/context/LoginContext'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {ScButton} from '../../shared/Button/Button'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    transition: t.transitions.create('box-shadow'),
  },
  pageTitle: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: t.spacing(2),
  },
  pageTitle_txt: {
    margin: 0,
    fontSize: utilsStyles(t).fontSize.bigTitle,
  },
  actions: {
    flexWrap: 'wrap',
    whiteSpace: 'nowrap',
  },
}))

interface Props {
  report: Report
  files?: UploadedFile[]
  onRemove?: () => void
  elevated?: boolean
  onClickAnswerBtn?: () => void
}

export const ReportHeader = ({report, files, elevated, onClickAnswerBtn}: Props) => {
  const css = useStyles()
  const cssUtils = useCssUtils()
  const {m} = useI18n()
  const _report = useReportContext()
  const {connectedUser} = useLogin()

  const downloadReport = (reportId: Id) => _report.download.fetch({}, reportId)

  return (
    <Panel elevation={elevated ? 3 : 0} className={css.root}>
      <PanelBody>
        <div className={css.pageTitle}>
          <div>
            <h1 className={css.pageTitle_txt}>
              {m.report_pageTitle}&nbsp;
              <span>{report.companySiret}</span>
            </h1>
            <div className={cssUtils.colorTxtHint}>ID {report.id}</div>
          </div>
          <ReportStatusChip className={cssUtils.marginLeftAuto} status={report.status}/>
        </div>
        <Alert id="report-info" dense type="info" deletable persistentDelete className={cssUtils.marginBottom}>
          {m.reportCategoriesAreSelectByConsumer}
        </Alert>
        <ReportCategories categories={[report.category, ...report.subcategories]}/>
        <Divider className={cssUtils.divider}/>
        {report.details.map((detail, i) =>
          <div key={i} className={cssUtils.marginBottom}>
            <div className={cssUtils.txtBold} dangerouslySetInnerHTML={{__html: detail.label.replace(/\:$/, '')}}/>
            <div className={cssUtils.colorTxtSecondary} dangerouslySetInnerHTML={{__html: detail.value}}/>
          </div>,
        )}
        <Divider className={cssUtils.divider}/>
        <Txt bold block>{m.attachedFiles}</Txt>
        <ReportFiles
          hideAddBtn={connectedUser.isPro}
          files={files?.filter(_ => _.origin === FileOrigin.Consumer)}
          reportId={report.id}
          fileOrigin={FileOrigin.Consumer}
          onNewFile={file => {
            _report.postAction.fetch({}, report.id, {
              details: '',
              fileIds: [file.id],
              actionType: EventActionValues.ConsumerAttachments,
            }).then(() => _report.events.fetch({force: true, clean: false}, report.id))
          }}
        />
      </PanelBody>
      <PanelFoot className={css.actions}>
        <div style={{flex: 1}}>
          {report.tags.map(tag => [
            <ScChip icon={<Icon style={{fontSize: 20}} className={cssUtils.colorTxtHint}>sell</Icon>} key={tag} label={tag}/>,
            ' ',
          ])}
        </div>

        {onClickAnswerBtn && connectedUser.isPro && report.status !== ReportStatus.ClosedForPro && (
          <ScButton onClick={onClickAnswerBtn} icon="priority_high" color="error" variant="contained">
            {m.answer}
          </ScButton>
        )}
        {(connectedUser.isAdmin || connectedUser.isDGCCRF) && (
          <ReportAddComment report={report} onAdd={() => _report.events.fetch({force: true, clean: false}, report.id)}>
            <Tooltip title={m.addDgccrfComment}>
              <Btn variant="outlined" color="primary" icon="add_comment">
                {m.comment}
              </Btn>
            </Tooltip>
          </ReportAddComment>
        )}
        {(connectedUser.isAdmin || connectedUser.isDGCCRF) && (
          <Btn
            variant="outlined" color="primary" icon="download"
            loading={_report.download.loading}
            onClick={() => downloadReport(report.id)}
          >
            {m.download}
          </Btn>
        )}
        {(connectedUser.isAdmin || connectedUser.isDGCCRF) && (
          <Confirm
            title={m.removeAsk}
            content={m.removeReportDesc(report.companySiret)}
            onConfirm={(close) => _report.remove.fetch({}, report.id).then(() => window.history.back()).finally(close)}
          >
            <Btn loading={_report.remove.loading} variant="outlined" color="error" icon="delete">{m.delete}</Btn>
          </Confirm>
        )}
      </PanelFoot>
    </Panel>
  )
}
