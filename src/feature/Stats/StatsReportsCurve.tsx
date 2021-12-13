import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {ScLineChart} from '../../shared/Chart/Chart'
import * as React from 'react'
import {useEffect, useMemo} from 'react'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {CountByDate, CurveStatsParams, Period, ReportTag} from '@signal-conso/signalconso-api-sdk-js'
import {statsFormatCurveDate} from './Stats'

interface Props {
  ticks?: number
}

export const StatsReportsCurvePanel = ({ticks}: Props) => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()

  const reportCountCurve = useFetcher(api.public.stats.getReportCountCurve)
  const reportInternetCountCurve = useFetcher((_: CurveStatsParams) =>
    api.public.stats.getReportCountCurve({..._, tags: [ReportTag.Internet]}),
  )
  const reportDemarchageCountCurve = useFetcher((_: CurveStatsParams) =>
    api.public.stats.getReportCountCurve({..._, tags: [ReportTag.DemarchageADomicile, ReportTag.DemarchageTelephonique]}),
  )

  const fetchCurve = (period: Period) => {
    reportCountCurve.fetch({}, {ticks, tickDuration: period})
    reportInternetCountCurve.fetch({}, {ticks, tickDuration: period})
    reportDemarchageCountCurve.fetch({}, {ticks, tickDuration: period})
  }

  const curvePhysique = useMemo(() => {
    const res: CountByDate[] = []
    if (reportCountCurve.entity && reportInternetCountCurve.entity && reportDemarchageCountCurve.entity) {
      for (let i = 0; i < reportCountCurve.entity.length; i++) {
        res[i] = {
          date: reportCountCurve.entity[i].date,
          count: reportCountCurve.entity[i].count - reportInternetCountCurve.entity[i]?.count - reportDemarchageCountCurve.entity[i]?.count,
        }
      }
    }
    return res
  }, [reportCountCurve, reportInternetCountCurve, reportDemarchageCountCurve])


  useEffect(() => {
    fetchCurve('Month')
  }, [ticks])

  return (
    <Panel loading={reportCountCurve.loading || reportInternetCountCurve.loading || reportDemarchageCountCurve.loading}>
      <PanelHead>{m.reportsDivision}</PanelHead>
      <PanelBody>
        {reportCountCurve.entity && reportInternetCountCurve.entity && reportDemarchageCountCurve.entity && (
          <ScLineChart curves={[
            {label: m.reportsCount, key: 'all', curve: reportCountCurve.entity.map(statsFormatCurveDate(m))},
            {label: m.reportsCountInternet, key: 'internet', curve: reportInternetCountCurve.entity.map(statsFormatCurveDate(m))},
            {label: m.reportsCountDemarchage, key: 'demarchage', curve: reportDemarchageCountCurve.entity.map(statsFormatCurveDate(m))},
            {label: m.reportsCountPhysique, key: 'physique', curve: curvePhysique.map(statsFormatCurveDate(m))},
          ]}/>
        )}
      </PanelBody>
    </Panel>
  )
}
