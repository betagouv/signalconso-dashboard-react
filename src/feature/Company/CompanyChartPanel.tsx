import {alpha, Button, ButtonGroup} from '@mui/material'
import {useLogin} from 'core/context/LoginContext'
import {useI18n} from 'core/i18n'
import {siteMap} from 'core/siteMap'
import {useEffect, useState} from 'react'
import {NavLink} from 'react-router-dom'
import {CurveDefinition, LineChartOrPlaceholder} from 'shared/Chart/LineChartWrappers'
import {CleanDiscreetPanel} from 'shared/Panel/simplePanels'
import {CompanyWithReportsCount} from '../../core/client/company/Company'
import {NbReportsTotals, Period} from '../../core/client/stats/Stats'
import {Id, ReportStatus} from '../../core/model'

const periods: Period[] = ['Day', 'Week', 'Month']

const ticks = 7

export const CompanyChartPanel = ({
  companyId,
  company,
  reportTotals,
}: {
  company: CompanyWithReportsCount
  companyId: Id
  reportTotals: NbReportsTotals | undefined
}) => {
  const {apiSdk} = useLogin()
  const {m, formatLargeNumber} = useI18n()
  const [reportsCurvePeriod, setReportsCurvePeriod] = useState<Period>('Month')
  const companyIds = [companyId]
  const [curves, setCurves] = useState<CurveDefinition[] | undefined>()

  useEffect(() => {
    async function inner() {
      setCurves(undefined)
      const [reports, responses] = await Promise.all([
        apiSdk.secured.stats.getReportCountCurve({
          companyIds,
          ticks,
          tickDuration: reportsCurvePeriod,
        }),
        apiSdk.secured.stats.getReportCountCurve({
          companyIds,
          status: [ReportStatus.PromesseAction, ReportStatus.Infonde, ReportStatus.MalAttribue],
          ticks,
          tickDuration: reportsCurvePeriod,
        }),
      ])
      setCurves([
        {
          label: m.reportsCount,
          data: reports,
        },
        {
          label: m.responsesCount,
          data: responses,
        },
      ])
    }
    inner()
  }, [reportsCurvePeriod])

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

  return (
    <CleanDiscreetPanel>
      <div className="flex items-center justify-between mb-2">
        {reportTotals && <ReportsTotalWithLink {...{companyId, reportTotals}} />}
        <ButtonGroup color="primary">
          {periods.map(p => (
            <Button
              key={p}
              sx={p === reportsCurvePeriod ? {background: t => alpha(t.palette.primary.main, 0.14)} : {}}
              onClick={() => setReportsCurvePeriod(p)}
            >
              {periodToString(p)}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <LineChartOrPlaceholder hideLabelToggle={true} {...{curves}} period={reportsCurvePeriod} />
    </CleanDiscreetPanel>
  )
}

function ReportsTotalWithLink({reportTotals, companyId}: {reportTotals: NbReportsTotals; companyId: Id}) {
  const {connectedUser} = useLogin()
  const {formatLargeNumber} = useI18n()

  const firstPart = `${formatLargeNumber(reportTotals.total)} signalements`
  const secondPart = `${formatLargeNumber(reportTotals.totalWaitingResponse)} en attente de réponse`
  const url = siteMap.logged.reports({companyIds: [companyId]})
  if (connectedUser.isPro) {
    return (
      <h2 className="font-bold text-lg">
        {firstPart} (dont <NavLink to={url}>{secondPart}</NavLink>)
      </h2>
    )
  }
  return (
    <h2 className="font-bold text-lg">
      <NavLink to={url}>{firstPart}</NavLink> (dont {secondPart})
    </h2>
  )
}
