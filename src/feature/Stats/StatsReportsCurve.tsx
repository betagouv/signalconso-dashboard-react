import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import * as React from 'react'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {CountByDate, Period, ReportTag} from '@signal-conso/signalconso-api-sdk-js'
import {statsFormatCurveDate} from './Stats'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {ChartAsync} from '../../shared/Chart/ChartAsync'

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
      count:
        reportCountCurve[i].count -
        reportInternetCountCurve[i]?.count -
        reportDemarchageCountCurve[i]?.count,
    }
  }
  return res
}

export const StatsReportsCurvePanel = ({ticks, tickDuration = 'Month'}: Props) => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()

  return (
    <Panel>
      <PanelHead>{m.reportsDivision}</PanelHead>
      <PanelBody>
        <Txt color="hint" gutterBottom block dangerouslySetInnerHTML={{__html: m.reportsDivisionDesc}} />
        <ChartAsync
          promisesDeps={[ticks, tickDuration]}
          promises={[
            () => api.public.stats.getReportCountCurve({ticks, tickDuration}),
            () => api.public.stats.getReportCountCurve({ticks, tickDuration, withTags: [ReportTag.Internet]}),
            () => api.public.stats.getReportCountCurve({ticks, tickDuration, withTags: [ReportTag.DemarchageADomicile, ReportTag.DemarchageTelephonique]}),
          ]}
          curves={[
            {
              label: m.reportsCount,
              key: 'all',
              curve: ([total,]) => total.map(statsFormatCurveDate(m))
            }, {
              label: m.reportsCountInternet,
              key: 'internet',
              curve: ([, internet]) => internet.map(statsFormatCurveDate(m)),
            }, {
              label: m.reportsCountDemarchage,
              key: 'demarchage',
              curve: ([,,demarchage])  => demarchage.map(statsFormatCurveDate(m)),
            }, {
              label: m.reportsCountPhysique,
              key: 'physique',
              curve: _ => computeCurveReportPhysique(..._).map(statsFormatCurveDate(m))
            },
          ]}
        />
      </PanelBody>
    </Panel>
  )
}
