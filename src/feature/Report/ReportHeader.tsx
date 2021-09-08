import {Panel, PanelBody} from '../../shared/Panel'
import {ReportStatusChip} from '../../shared/ReportStatus/ReportStatus'
import {Alert} from 'mui-extension/lib'
import {ReportCategories} from './ReportCategories'
import {Icon, makeStyles, Theme} from '@material-ui/core'
import {Report} from '../../core/api'
import {PanelFoot} from '../../shared/Panel/PanelFoot'
import {ScChip} from '../../shared/Chip/ScChip'
import React, {ReactNode} from 'react'
import {styleUtils} from '../../core/theme'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {useI18n} from '../../core/i18n'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    transition: t.transitions.create('box-shadow'),
  },
  pageTitle: {
    display: 'flex',
    alignItems: 'flex-start',
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
  elevated?: boolean
  children?: ReactNode
  hideTags?: boolean
  hideSiret?: boolean
}

export const ReportHeader = ({hideTags, hideSiret, report, children, elevated}: Props) => {
  const css = useStyles()
  const cssUtils = useCssUtils()
  const {m} = useI18n()

  return (
    <Panel elevation={elevated ? 3 : 0} className={css.root}>
      <PanelBody>
        <div className={css.pageTitle}>
          <div>
            <h1 className={css.pageTitle_txt}>
              {m.report_pageTitle}
              {!hideSiret && (
                <>
                  &nbsp;
                  {report.companySiret}
                </>
              )}
            </h1>
            {!hideSiret && <div className={cssUtils.colorTxtHint}>{report.companyName}</div>}
            <div className={cssUtils.colorTxtHint}>ID {report.id}</div>
          </div>
          <ReportStatusChip className={cssUtils.marginLeftAuto} status={report.status} />
        </div>
        <Alert id="report-info" dense type="info" deletable persistentDelete className={cssUtils.marginBottom2}>
          {m.reportCategoriesAreSelectByConsumer}
        </Alert>
        <ReportCategories categories={[report.category, ...report.subcategories]} />
      </PanelBody>
      {(!hideTags || children) && (
        <PanelFoot className={css.actions} border>
          {!hideTags && (
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
          )}
          {children}
        </PanelFoot>
      )}
    </Panel>
  )
}
