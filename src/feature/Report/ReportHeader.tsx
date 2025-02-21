import { Icon } from '@mui/material'
import React, { ReactNode } from 'react'
import { CleanDiscreetPanel } from 'shared/Panel/simplePanels'
import { Alert, makeSx } from '../../alexlibs/mui-extension'
import { Report, ReportSearchResult } from '../../core/client/report/Report'
import { useI18n } from '../../core/i18n'
import { styleUtils } from '../../core/theme'
import {
  isStatusFinal,
  isStatusInvisibleToPro,
  ReportStatusLabel,
} from '../../shared/ReportStatus'
import { ScChip } from '../../shared/ScChip'
import { ReportCategories } from './ReportCategories'
import { BookmarkButton } from './bookmarks'
import { siteMap } from '../../core/siteMap'
import { Link } from '@tanstack/react-router'
import ReportSearchNavLink from './ReportSearchNavLink'

interface Props {
  report: ReportSearchResult
  elevated?: boolean
  children?: ReactNode
  isUserPro?: boolean
  isAdminClosure?: boolean
}

const ExpiresSoonWarning = ({
  report,
  isUserPro,
}: {
  report: Report
  isUserPro: boolean
}) => {
  const { m } = useI18n()
  const expectResponse = isUserPro && !isStatusFinal(report.status)
  const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000
  const expiresSoon =
    Math.abs(report.expirationDate.getTime() - new Date().getTime()) <
    sevenDaysInMilliseconds
  if (expectResponse && expiresSoon) {
    return (
      <Alert type="warning" sx={{ mb: 2 }}>
        {m.reportLimitedTimeToAnswer}
      </Alert>
    )
  }
  return null
}

export const ExpirationDate = ({
  report,
  isUserPro,
}: {
  report: Report
  isUserPro: boolean
}) => {
  const { m, formatDate } = useI18n()
  const isFinal = isStatusFinal(report.status)
  const isInvisibleToPro = isStatusInvisibleToPro(report.status)

  function getTextAndColor() {
    if (isInvisibleToPro) return null
    if (isUserPro) {
      if (isFinal) {
        return null
      }
      return { text: m.reportNeedsAnswerBefore }
    }
    if (isFinal) {
      return { text: m.reportProHadToAnswerBefore, grayedOut: true }
    }
    return { text: m.reportProMustAnswerBefore }
  }

  const textAndColor = getTextAndColor()
  if (!textAndColor) return null
  const { text, grayedOut } = textAndColor
  const dateFormatted = formatDate(report.expirationDate)
  return (
    <p className={grayedOut ? 'text-gray-500' : ''}>
      {text} {dateFormatted}
    </p>
  )
}

export const ReportHeader = ({
  report: reportSearchResult,
  isAdminClosure,
  children,
}: Props) => {
  const { m, formatDateTime } = useI18n()

  const { report, isBookmarked } = reportSearchResult
  const hideTags = false

  return (
    <CleanDiscreetPanel>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-xl font-bold">
            {m.report_pageTitle}{' '}
            <BookmarkButton isBookmarked={isBookmarked} reportId={report.id} />
          </h1>
          <span>Signalé le {formatDateTime(report.creationDate)}</span>
          <ExpirationDate {...{ report }} isUserPro={false} />
        </div>
        <Link to={siteMap.logged.reports({ status: [report.status] })}>
          <ReportStatusLabel
            style={{ marginLeft: 'auto' }}
            status={report.status}
            isAdminClosure={isAdminClosure}
          />
        </Link>
      </div>

      <ExpiresSoonWarning {...{ report }} isUserPro={false} />
      <ReportCategories
        categories={[
          m.ReportCategoryDesc[report.category],
          ...report.subcategories,
        ]}
      />
      {(!hideTags || children) && (
        <div className="flex justify-between">
          {!hideTags && (
            <div style={{ flex: 1 }}>
              {Report.readTags(report).map((tag) => [
                <ReportSearchNavLink
                  className={'no-underline'}
                  reportSearch={{
                    withTags: [tag],
                  }}
                  value={
                    <ScChip
                      icon={
                        <Icon
                          style={{ fontSize: 20 }}
                          sx={{ color: (t) => t.palette.text.disabled }}
                        >
                          sell
                        </Icon>
                      }
                      key={tag}
                      label={m.reportTagDesc[tag]}
                    />
                  }
                />,
                ' ',
              ])}
            </div>
          )}
          {children}
        </div>
      )}
    </CleanDiscreetPanel>
  )
}
