import {Page, PageTitle} from 'shared/Layout'
import * as React from 'react'
import {useEffect, useMemo} from 'react'
import {CountByDate, CurveStatsParams, Period, ReportTag} from '@signal-conso/signalconso-api-sdk-js'
import {useLogin} from '../../core/context/LoginContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {messagesFr} from '../../core/i18n/messages/messages.fr'
import {useI18n} from '../../core/i18n'
import {ScLineChart} from '../../shared/Chart/Chart'

const ticks = 12
const period: Period = 'Month'

const formatCurveDate = (m: typeof messagesFr) => ({date, count}: CountByDate): {date: string, count: number} => ({
  date: (m.monthShort_ as any)[date.getMonth() + 1],
  count,
})

export const Stats = () => {

  const {apiSdk: api} = useLogin()
  const {m} = useI18n()
  const reportCountCurve = useFetcher(api.public.stats.getReportCountCurve)
  const getReportedActiveProAccountRate = useFetcher(api.secured.stats.getReportedActiveProAccountRate)
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
    getReportedActiveProAccountRate.fetch({}, {ticks})
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
  }, [])

  return (
    <Page>
      <PageTitle>{m.menu_stats}</PageTitle>
      <Panel loading={
        reportCountCurve.loading || reportInternetCountCurve.loading || reportDemarchageCountCurve.loading || getReportedActiveProAccountRate.loading
      }>
        <PanelHead>{m.reportsDivision}</PanelHead>
        <PanelBody>
          {reportCountCurve.entity && reportInternetCountCurve.entity && reportDemarchageCountCurve.entity && (
            <ScLineChart curves={[
              {label: m.reportsCount, key: 'all', curve: reportCountCurve.entity.map(formatCurveDate(m))},
              {label: m.reportsCountInternet, key: 'internet', curve: reportInternetCountCurve.entity.map(formatCurveDate(m))},
              {label: m.reportsCountDemarchage, key: 'demarchage', curve: reportDemarchageCountCurve.entity.map(formatCurveDate(m))},
              {label: m.reportsCountPhysique, key: 'physique', curve: curvePhysique.map(formatCurveDate(m))},
            ]}/>
          )}
        </PanelBody>
        <PanelHead>{m.proUser}</PanelHead>
        <PanelBody>
          {getReportedActiveProAccountRate.entity && (
              <ScLineChart curves={[
                {label: m.reportsProUserAccountRate, key: 'pro', curve: getReportedActiveProAccountRate.entity.map(formatCurveDate(m))}
              ]}/>
          )}
        </PanelBody>

      </Panel>
    </Page>
  )
}
