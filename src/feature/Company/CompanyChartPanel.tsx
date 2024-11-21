import { alpha, Button, ButtonGroup, MenuItem } from '@mui/material'
import { useConnectedContext } from 'core/context/ConnectedContext'
import { useI18n } from 'core/i18n'
import { siteMap } from 'core/siteMap'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  CurveDefinition,
  LineChartOrPlaceholder,
} from 'shared/Chart/LineChartWrappers'
import { CleanDiscreetPanel } from 'shared/Panel/simplePanels'
import { CompanyWithReportsCount } from '../../core/client/company/Company'
import {
  NbReportsTotals,
  Period,
  Ticks,
} from '../../core/client/stats/statsTypes'
import { Id, ReportStatus } from '../../core/model'
import { ScSelect } from '../../shared/Select/Select'

const periods: Period[] = ['Day', 'Week', 'Month']
const ticks: Ticks[] = [3, 6, 12, 24]

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
  const [reportsTick, setReportsTick] = useState<Ticks>(6)
  const companyIds = [companyId]
  const [curves, setCurves] = useState<CurveDefinition[] | undefined>()

  useEffect(() => {
    async function inner() {
      setCurves(undefined)
      const [reports, responses] = await Promise.all([
        apiSdk.secured.stats.getReportCountCurve({
          companyIds,
          ticks: reportsTick,
          tickDuration: reportsCurvePeriod,
        }),
        apiSdk.secured.stats.getReportCountCurve({
          companyIds,
          status: [
            ReportStatus.PromesseAction,
            ReportStatus.Infonde,
            ReportStatus.MalAttribue,
          ],
          ticks: reportsTick,
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
  }, [reportsCurvePeriod, reportsTick])

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

  const tickToString = (tick: Ticks): string => {
    switch (tick) {
      case 3:
        return m.tick3
      case 6:
        return m.tick6
      case 12:
        return m.tick12
      case 24:
        return m.tick24
    }
  }

  return (
    <CleanDiscreetPanel>
      <div className="flex items-center justify-between mb-2">
        {reportTotals && (
          <ReportsTotalWithLink {...{ companyId, reportTotals }} />
        )}
        <div className={'flex flex-row items-center gap-1'}>
          <ScSelect
            label={'Période'}
            value={reportsTick}
            onChange={(x) => setReportsTick(x.target.value as Ticks)}
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
            onChange={(x) => setReportsCurvePeriod(x.target.value as Period)}
            style={{ margin: 0 }}
          >
            {periods.map((t) => (
              <MenuItem key={t} value={t}>
                {periodToString(t)}
              </MenuItem>
            ))}
          </ScSelect>
          {/*<ButtonGroup color="primary" style={{ height: '41px' }}>*/}
          {/*  {periods.map((p) => (*/}
          {/*    <Button*/}
          {/*      key={p}*/}
          {/*      sx={*/}
          {/*        p === reportsCurvePeriod*/}
          {/*          ? { background: (t) => alpha(t.palette.primary.main, 0.14) }*/}
          {/*          : {}*/}
          {/*      }*/}
          {/*      onClick={() => setReportsCurvePeriod(p)}*/}
          {/*    >*/}
          {/*      {periodToString(p)}*/}
          {/*    </Button>*/}
          {/*  ))}*/}
          {/*</ButtonGroup>*/}
        </div>
      </div>
      <LineChartOrPlaceholder
        hideLabelToggle={true}
        {...{ curves }}
        period={reportsCurvePeriod}
      />
    </CleanDiscreetPanel>
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
