import {Panel, PanelBody} from '../../shared/Panel'
import {ReportStatusChip} from '../../shared/ReportStatus/ReportStatus'
import {Alert} from 'mui-extension/lib'
import {ReportCategories} from './ReportCategories'
import {Divider, Icon, makeStyles, Theme} from '@material-ui/core'
import {EventActionValues, FileOrigin, Report, UploadedFile} from '../../core/api'
import {ReportFiles} from './File/ReportFiles'
import {PanelFoot} from '../../shared/Panel/PanelFoot'
import {ScChip} from '../../shared/Chip/ScChip'
import React, {ReactNode} from 'react'
import {styleUtils} from '../../core/theme'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {useI18n} from '../../core/i18n'
import {useReportContext} from '../../core/context/ReportContext'
import {useLogin} from '../../core/context/LoginContext'
import {Txt} from 'mui-extension/lib/Txt/Txt'

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
    fontSize: styleUtils(t).fontSize.bigTitle,
  },
  actions: {
    flexWrap: 'wrap',
    whiteSpace: 'nowrap',
  },
}))

interface Props {
  report: Report
  files?: UploadedFile[]
  elevated?: boolean
  actions?: ReactNode
  children?: ReactNode
}

export const ReportHeader = ({report, children, actions, files, elevated}: Props) => {
  const css = useStyles()
  const cssUtils = useCssUtils()
  const {m} = useI18n()
  const _report = useReportContext()
  const {connectedUser} = useLogin()

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
          <ReportStatusChip className={cssUtils.marginLeftAuto} status={report.status} />
        </div>
        <Alert id="report-info" dense type="info" deletable persistentDelete className={cssUtils.marginBottom}>
          {m.reportCategoriesAreSelectByConsumer}
        </Alert>
        <ReportCategories categories={[report.category, ...report.subcategories]} />
        <Divider className={cssUtils.divider} />
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
          hideAddBtn={connectedUser.isPro}
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
      <PanelFoot className={css.actions}>
        <div style={{flex: 1}}>
          {report.tags.map(tag => [
            <ScChip
              icon={
                <Icon style={{fontSize: 20}} className={cssUtils.colorTxtHint}>
                  sell
                </Icon>
              }
              key={tag}
              label={tag}
            />,
            ' ',
          ])}
        </div>
        {actions}
      </PanelFoot>
    </Panel>
  )
}
