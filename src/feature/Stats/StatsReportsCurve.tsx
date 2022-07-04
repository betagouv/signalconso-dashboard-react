import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import * as React from 'react'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {CountByDate, Period, ReportTag} from '@signal-conso/signalconso-api-sdk-js'
import {statsFormatCurveDate} from './Stats'
import {Txt} from '../../alexlibs/mui-extension'
import {ChartAsync} from '../../shared/Chart/ChartAsync'
import {useTheme} from '@mui/material'

interface Props {
  ticks?: number
  tickDuration?: Period
}

const computeCurveReportPhysique = (
  reportCountCurve: {date: Date; count: number}[],
  reportInternetCountCurve: {date: Date; count: number}[],
  reportDemarchageCountCurve: {date: Date; count: number}[],
) => {
  const res: CountByDate[] = []
  for (let i = 0; i < reportCountCurve.length; i++) {
    res[i] = {
      date: reportCountCurve[i].date,
      count: reportCountCurve[i].count - reportInternetCountCurve[i]?.count - reportDemarchageCountCurve[i]?.count,
    }
  }
  return res
}

export const StatsReportsCurvePanel = ({ticks, tickDuration = 'Month'}: Props) => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()
  const theme = useTheme()
  return (
    <Panel>
      <PanelHead>{m.reportsDivision}</PanelHead>
      <PanelBody>
        <Txt color="hint" gutterBottom block dangerouslySetInnerHTML={{__html: m.reportsDivisionDesc}} />
        <ChartAsync
          promisesDeps={[ticks, tickDuration]}
          promises={[
            () => api.public.stats.getReportCountCurve({ticks, tickDuration, withoutTags: [ReportTag.Bloctel]}),
            () =>
              api.public.stats.getReportCountCurve({
                ticks,
                tickDuration,
                withTags: [ReportTag.Internet],
                withoutTags: [ReportTag.Bloctel],
              }),
            () =>
              api.public.stats.getReportCountCurve({
                ticks,
                tickDuration,
                withTags: [ReportTag.DemarchageADomicile, ReportTag.DemarchageTelephonique],
                withoutTags: [ReportTag.Bloctel],
              }),
          ]}
          curves={[
            {
              label: m.reportsCount,
              key: 'all',
              color: theme.palette.primary.main,
              curve: ([total]) => total.map(statsFormatCurveDate(m)),
            },
            {
              label: m.reportsCountInternet,
              key: 'internet',
              color: '#e48c00',
              curve: ([, internet]) => internet.map(statsFormatCurveDate(m)),
            },
            {
              label: m.reportsCountDemarchage,
              key: 'demarchage',
              color: 'red',
              curve: ([, , demarchage]) => demarchage.map(statsFormatCurveDate(m)),
            },
            {
              label: m.reportsCountPhysique,
              key: 'physique',
              color: 'green',
              curve: _ => computeCurveReportPhysique(..._).map(statsFormatCurveDate(m)),
            },
          ]}
        />
      </PanelBody>
    </Panel>
  )
}
