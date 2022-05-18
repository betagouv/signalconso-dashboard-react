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

  // const reportCountCurve = useFetcher(api.public.stats.getReportCountCurve)
  // const reportInternetCountCurve = useFetcher((_: CurveStatsParams) =>
  //   api.public.stats.getReportCountCurve({..._, withTags: [ReportTag.Internet]}),
  // )
  // const reportDemarchageCountCurve = useFetcher((_: CurveStatsParams) =>
  //   api.public.stats.getReportCountCurve({..._, withTags: [ReportTag.DemarchageADomicile, ReportTag.DemarchageTelephonique]}),
  // )
  //
  // const fetchCurve = (period: Period) => {
  //   reportCountCurve.fetch({}, {ticks, tickDuration: period})
  //   reportInternetCountCurve.fetch({}, {ticks, tickDuration: period})
  //   reportDemarchageCountCurve.fetch({}, {ticks, tickDuration: period})
  // }

  // const curvePhysique = useMemo(() => {
  //   const res: CountByDate[] = []
  //   if (reportCountCurve.entity && reportInternetCountCurve.entity && reportDemarchageCountCurve.entity) {
  //     for (let i = 0; i < reportCountCurve.entity.length; i++) {
  //       res[i] = {
  //         date: reportCountCurve.entity[i].date,
  //         count:
  //           reportCountCurve.entity[i].count -
  //           reportInternetCountCurve.entity[i]?.count -
  //           reportDemarchageCountCurve.entity[i]?.count,
  //       }
  //     }
  //   }
  //   return res
  // }, [reportCountCurve, reportInternetCountCurve, reportDemarchageCountCurve])
  //
  // useEffect(() => {
  //   fetchCurve('Month')
  // }, [ticks])

  return (
    <Panel>
      <PanelHead>{m.reportsDivision}</PanelHead>
      <PanelBody>
        <Txt color="hint" gutterBottom block dangerouslySetInnerHTML={{__html: m.reportsDivisionDesc}} />
        <ChartAsync
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
        {/*{reportCountCurve.entity && reportInternetCountCurve.entity && reportDemarchageCountCurve.entity && (*/}
        {/*  <ScLineChart*/}
        {/*    curves={[*/}
        {/*      {label: m.reportsCount, key: 'all', curve: reportCountCurve.entity.map(statsFormatCurveDate(m))},*/}
        {/*      {*/}
        {/*        label: m.reportsCountInternet,*/}
        {/*        key: 'internet',*/}
        {/*        curve: reportInternetCountCurve.entity.map(statsFormatCurveDate(m)),*/}
        {/*      },*/}
        {/*      {*/}
        {/*        label: m.reportsCountDemarchage,*/}
        {/*        key: 'demarchage',*/}
        {/*        curve: reportDemarchageCountCurve.entity.map(statsFormatCurveDate(m)),*/}
        {/*      },*/}
        {/*      {label: m.reportsCountPhysique, key: 'physique', curve: curvePhysique.map(statsFormatCurveDate(m))},*/}
        {/*    ]}*/}
        {/*  />*/}
        {/*)}*/}
      </PanelBody>
    </Panel>
  )
}
