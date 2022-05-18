import {Panel, PanelBody, PanelHead} from 'shared/Panel'
import {alpha, Button, ButtonGroup, Icon, IconButton} from '@mui/material'
import {NavLink} from 'react-router-dom'
import {siteMap} from 'core/siteMap'
import {ChartAsync} from 'shared/Chart/ChartAsync'
import {CompanyWithReportsCount, CountByDate, Id, Period, ReportStatus} from '@signal-conso/signalconso-api-sdk-js'
import * as React from 'react'
import {useState} from 'react'
import {useLogin} from 'core/context/LoginContext'
import {useI18n} from 'core/i18n'
import {I18nContextProps} from 'core/i18n/I18n'

const periods: Period[] = ['Day', 'Month']

const ticks = 7

const formatCurveDate =
  (m: I18nContextProps['m']) => ({date, count}: CountByDate): {date: string; count: number} => ({
    date: (m.monthShort_ as any)[date.getMonth() + 1],
    count,
  })

export const CompanyChartPanel = ({
  companyId,
  company,
}: {
  company: CompanyWithReportsCount
  companyId: Id
}) => {
  const {apiSdk} = useLogin()
  const {m, formatLargeNumber} = useI18n()
  const [reportsCurvePeriod, setReportsCurvePeriod] = useState<Period>('Month')
  return (
    <Panel>
      <PanelHead
        action={
          <ButtonGroup color="primary">
            {periods.map(p => (
              <Button
                key={p}
                sx={p === reportsCurvePeriod
                  ? {background: t => alpha(t.palette.primary.main, 0.14)}
                  : {}
                }
                onClick={() => setReportsCurvePeriod(p)}
              >
                {p === 'Day' ? m.day : m.month}
              </Button>
            ))}
          </ButtonGroup>
        }
      >
        {company.count && formatLargeNumber(company.count)}
        &nbsp;
        {m.reports.toLocaleLowerCase()}
        <NavLink to={siteMap.logged.reports()}>
          <IconButton size={'small'} sx={{color: t => t.palette.text.secondary, ml: 1}}>
            <Icon>open_in_new</Icon>
          </IconButton>
        </NavLink>
      </PanelHead>
      <PanelBody>
        <ChartAsync
          fetchDeps={[reportsCurvePeriod, ticks]}
          promises={[
            () => apiSdk.publicConnected.stats.getReportCountCurve({
              companyIds: [companyId],
              ticks,
              tickDuration: reportsCurvePeriod,
            }),
            () => apiSdk.publicConnected.stats.getReportCountCurve({
              companyIds: [companyId],
              status: [ReportStatus.PromesseAction, ReportStatus.Infonde, ReportStatus.MalAttribue],
              ticks,
              tickDuration: reportsCurvePeriod,
            }),
          ]}
          curves={[
            {
              label: m.reportsCount,
              key: 'count',
              curve: ([total]) => total.map(formatCurveDate(m)),
            }, {
              label: m.responsesCount,
              key: 'countResponded',
              curve: ([, responded]) => responded.map(formatCurveDate(m)),
            },
          ]}
        />
      </PanelBody>
    </Panel>
  )
}
