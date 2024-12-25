import { MenuItem } from '@mui/material'
import { useConnectedContext } from 'core/context/ConnectedContext'
import { useI18n } from 'core/i18n'
import { siteMap } from 'core/siteMap'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  CurveDefinition,
  LineChartOrPlaceholder,
} from 'shared/Chart/chartWrappers'
import { chartColors } from 'shared/Chart/chartsColors'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { ScSelect } from 'shared/Select/Select'
import { CompanyWithReportsCount } from '../../core/client/company/Company'
import {
  MonthTicks,
  NbReportsTotals,
  Period,
} from '../../core/client/stats/statsTypes'
import { Id, ReportStatus } from '../../core/model'

const periods: Period[] = ['Day', 'Week', 'Month']
const ticks: MonthTicks[] = [1, 6, 12, 24]

export const CompanyChartPanel = ({
  companyId,
  company,
  reportTotals,
}: {
  company: CompanyWithReportsCount
  companyId: Id
  reportTotals: NbReportsTotals | undefined
}) => {
  const { api: apiSdk } = useConnectedContext()
  const { m, formatLargeNumber } = useI18n()
  const [reportsCurvePeriod, setReportsCurvePeriod] = useState<Period>('Month')
  const [reportsTick, setReportsTick] = useState<MonthTicks>(6)
  const companyIds = [companyId]
  const [curves, setCurves] = useState<CurveDefinition[] | undefined>()

  useEffect(() => {
    async function inner() {
      setCurves(undefined)
      const [reports, responses] = await Promise.all([
        apiSdk.secured.stats.getReportCountCurve({
          companyIds,
          ticks: computeTicks(),
          tickDuration: reportsCurvePeriod,
        }),
        apiSdk.secured.stats.getReportCountCurve({
          companyIds,
          status: [
            ReportStatus.PromesseAction,
            ReportStatus.Infonde,
            ReportStatus.MalAttribue,
          ],
          ticks: computeTicks(),
          tickDuration: reportsCurvePeriod,
        }),
      ])
      const reportsWithoutResponse = reports.map(({ date, count }) => {
        const nbResponses =
          responses.find((_) => _.date.getTime() === date.getTime())?.count ?? 0
        const nbReportsWithoutResponses = count - nbResponses
        return { date, count: nbReportsWithoutResponses }
      })
      setCurves([
        {
          label: 'Signalements répondus',
          data: responses,
          color: chartColors.darkblue,
        },
        {
          label: 'Signalements en attente de réponse',
          data: reportsWithoutResponse,
          color: chartColors.darkred,
        },
      ])
    }

    inner()
  }, [reportsCurvePeriod, reportsTick])

  const computeTicks = () => {
    const today = new Date()
    const xMonthsAgo = new Date()
    xMonthsAgo.setMonth(today.getMonth() - reportsTick)
    const diffInMilliseconds = today.getTime() - xMonthsAgo.getTime()

    switch (reportsCurvePeriod) {
      case 'Day':
        const diffInDays = Math.floor(
          diffInMilliseconds / (24 * 60 * 60 * 1000),
        )
        return diffInDays
      case 'Week':
        const diffInWeeks = Math.floor(
          diffInMilliseconds / (7 * 24 * 60 * 60 * 1000),
        )
        return diffInWeeks
      case 'Month':
        return reportsTick
    }
  }

  const periodToString = (period: Period): string => {
    switch (period) {
      case 'Day':
        return m.day
      case 'Week':
        return m.week
      case 'Month':
        return m.month
    }
  }

  const tickToString = (tick: MonthTicks): string => {
    switch (tick) {
      case 1:
        return m.tick1
      case 6:
        return m.tick6
      case 12:
        return m.tick12
      case 24:
        return m.tick24
    }
  }

  return (
    <CleanInvisiblePanel>
      <div className="flex items-center justify-between mb-2">
        {reportTotals && (
          <ReportsTotalWithLink {...{ companyId, reportTotals }} />
        )}
      </div>
      <div className="flex flex-col gap-2 border border-solid border-gray-400 p-2 pr-4 pt-4">
        <div className={'flex flex-row justify-end gap-2'}>
          <ScSelect
            label={'Période'}
            value={reportsTick}
            onChange={(x) => {
              const selected = x.target.value as MonthTicks
              //reset interval filter depending on period
              if (selected !== 1) {
                setReportsCurvePeriod('Month')
              } else {
                setReportsCurvePeriod('Week')
              }
              return setReportsTick(selected)
            }}
            style={{ margin: 0 }}
          >
            {ticks.map((t) => (
              <MenuItem key={t} value={t}>
                {tickToString(t)}
              </MenuItem>
            ))}
          </ScSelect>
          <ScSelect
            label={'Intervalle'}
            value={reportsCurvePeriod}
            onChange={(x) => {
              return setReportsCurvePeriod(x.target.value as Period)
            }}
            style={{ margin: 0 }}
          >
            {periods
              //Do not allow to see Day when period is too large and month when the period is 1 month
              .filter(
                (_) =>
                  (reportsTick === 1 && _ !== 'Month') ||
                  (reportsTick !== 1 && _ !== 'Day'),
              )
              .map((t) => (
                <MenuItem key={t} value={t}>
                  {periodToString(t)}
                </MenuItem>
              ))}
          </ScSelect>
        </div>
        <LineChartOrPlaceholder
          hideLabelToggle={true}
          {...{ curves }}
          period={reportsCurvePeriod}
          chartKind="stackedbarchart"
        />
      </div>
    </CleanInvisiblePanel>
  )
}

function ReportsTotalWithLink({
  reportTotals,
  companyId,
}: {
  reportTotals: NbReportsTotals
  companyId: Id
}) {
  const { connectedUser } = useConnectedContext()
  const { formatLargeNumber } = useI18n()

  const firstPart = `${formatLargeNumber(reportTotals.total)} signalements`
  const secondPart = `${formatLargeNumber(
    reportTotals.totalWaitingResponse,
  )} en attente de réponse`
  const url = siteMap.logged.reports({ companyIds: [companyId] })
  if (connectedUser.isPro) {
    return (
      <h2 className="text-2xl">
        <span className="font-bold">{firstPart}</span>{' '}
        <span className="text-base">
          dont{' '}
          <NavLink to={url} className="font-bold">
            {secondPart}
          </NavLink>
        </span>
      </h2>
    )
  }
  return (
    <h2 className="text-2xl">
      <span className="font-bold">
        <NavLink to={url}>{firstPart}</NavLink>
      </span>{' '}
      <span className="text-base">dont {secondPart}</span>
    </h2>
  )
}
