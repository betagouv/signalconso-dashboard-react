import {Panel, PanelBody} from '../../shared/Panel'
import {isStatusFinal, isStatusInvisibleToPro, ReportStatusLabel} from '../../shared/ReportStatus'
import {Alert} from '../../alexlibs/mui-extension'
import {ReportCategories} from './ReportCategories'
import {Box, Icon} from '@mui/material'
import {PanelFoot} from '../../shared/Panel/PanelFoot'
import {ScChip} from '../../shared/ScChip'
import React, {ReactNode} from 'react'
import {styleUtils} from '../../core/theme'
import {useI18n} from '../../core/i18n'
import {makeSx} from '../../alexlibs/mui-extension'
import {Report} from '../../core/client/report/Report'
import {WithInlineIcon} from 'shared/WithInlineIcon'

const css = makeSx({
  root: {
    transition: t => t.transitions.create('box-shadow'),
  },
  pageTitle: {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    mb: 2,
  },
  pageTitle_txt: {
    margin: 0,
    fontSize: t => styleUtils(t).fontSize.bigTitle,
  },
  actions: {
    flexWrap: 'wrap',
    whiteSpace: 'nowrap',
  },
})

interface Props {
  report: Report
  elevated?: boolean
  children?: ReactNode
  isUserPro?: boolean
}

const ExpiresSoonWarning = ({report, isUserPro}: {report: Report; isUserPro: boolean}) => {
  const {m} = useI18n()
  const expectResponse = isUserPro && !isStatusFinal(report.status)
  const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000
  const expiresSoon = Math.abs(report.expirationDate.getTime() - new Date().getTime()) < sevenDaysInMilliseconds
  if (expectResponse && expiresSoon) {
    return (
      <Alert type="warning" sx={{mb: 2}}>
        {m.reportLimitedTimeToAnswer}
      </Alert>
    )
  }
  return null
}

const ExpirationDate = ({report, isUserPro}: {report: Report; isUserPro: boolean}) => {
  const {m, formatDate} = useI18n()
  const isFinal = isStatusFinal(report.status)
  const isInvisibleToPro = isStatusInvisibleToPro(report.status)
  function getTextAndColor() {
    if (isInvisibleToPro) return null
    if (isUserPro) {
      if (isFinal) {
        return null
      }
      return {text: m.reportNeedsAnswerBefore}
    }
    if (isFinal) {
      return {text: m.reportProHadToAnswerBefore, grayedOut: true}
    }
    return {text: m.reportProMustAnswerBefore}
  }
  const textAndColor = getTextAndColor()
  if (!textAndColor) return null
  const {text, grayedOut} = textAndColor
  const dateFormatted = formatDate(report.expirationDate)
  return (
    <Box sx={{color: t => (grayedOut ? t.palette.text.disabled : t.palette.text.primary)}}>
      {text} {dateFormatted}
    </Box>
  )
}

export const ReportHeader = ({report, children, elevated, isUserPro = false}: Props) => {
  const {m} = useI18n()

  const hideSiret = !isUserPro
  const hideTags = isUserPro

  return (
    <Panel elevation={elevated ? 3 : 0} sx={css.root}>
      <PanelBody>
        <Box sx={css.pageTitle}>
          <div>
            <Box component="h1" sx={css.pageTitle_txt}>
              {m.report_pageTitle}
              {!hideSiret && (
                <>
                  &nbsp;
                  {report.companySiret}
                </>
              )}
            </Box>
            {!hideSiret && <Box sx={{color: t => t.palette.text.disabled}}>{report.companyName}</Box>}
            <Box sx={{color: t => t.palette.text.disabled}}>ID {report.id}</Box>
            <ExpirationDate {...{report, isUserPro}} />
          </div>
          <ReportStatusLabel style={{marginLeft: 'auto'}} status={report.status} />
        </Box>

        <ExpiresSoonWarning {...{report, isUserPro}} />

        <Alert id="report-info" dense type="info" deletable persistentDelete sx={{mb: 2}}>
          {m.reportCategoriesAreSelectByConsumer}
        </Alert>
        <ReportCategories categories={[m.ReportCategoryDesc[report.category], ...report.subcategories]} />
      </PanelBody>
      {(!hideTags || children) && (
        <PanelFoot sx={css.actions} border>
          {!hideTags && (
            <div style={{flex: 1}}>
              {report.tags.map(tag => [
                <ScChip
                  icon={
                    <Icon style={{fontSize: 20}} sx={{color: t => t.palette.text.disabled}}>
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
