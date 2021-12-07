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
import {StatsReportsByRegion} from './StatsReportsByRegion'

const ticks = 12

const formatCurveDate = (m: typeof messagesFr) => ({date, count}: CountByDate): {date: string, count: number} => ({
  date: (m.monthShort_ as any)[date.getMonth() + 1],
  count,
})

export const Stats = () => {

  const {apiSdk: api} = useLogin()
  const {m} = useI18n()
  const reportCountCurve = useFetcher(api.public.stats.getReportCountCurve)
  const reportedActiveProAccountRate = useFetcher(api.secured.stats.getReportedActiveProAccountRate)

  const dgccrfActiveAccount = useFetcher(api.secured.stats.getActiveDgccrfAccountCurve)
  const dgccrfAccount = useFetcher(api.secured.stats.getDgccrfAccountCurve)
  const dgccrfControlsCurve = useFetcher(api.secured.stats.getDgccrfControlsCurve)
  const dgccrfSubscriptionsCurve = useFetcher(api.secured.stats.getDgccrfSubscriptionsCurve)

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
    reportedActiveProAccountRate.fetch({}, {ticks})
    dgccrfActiveAccount.fetch({}, {ticks})
    dgccrfAccount.fetch({}, {ticks})
    dgccrfControlsCurve.fetch({}, {ticks})
    dgccrfSubscriptionsCurve.fetch({}, {ticks})
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

      <Panel loading={reportCountCurve.loading || reportInternetCountCurve.loading || reportDemarchageCountCurve.loading}>
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
      </Panel>

      <Panel loading={reportedActiveProAccountRate.loading}>
        <PanelHead>{m.proUser}</PanelHead>
        <PanelBody>
          {reportedActiveProAccountRate.entity && (
            <ScLineChart curves={[
              {label: m.reportsProUserAccountRate, key: 'pro', curve: reportedActiveProAccountRate.entity.map(formatCurveDate(m))},
            ]}/>
          )}
        </PanelBody>
      </Panel>

      <Panel loading={dgccrfActiveAccount.loading || dgccrfAccount.loading}>
        <PanelHead>{m.dgccrfUser}</PanelHead>
        <PanelBody>
          {dgccrfActiveAccount.entity && dgccrfAccount.entity && (
            <ScLineChart curves={[
              {label: m.dgccrfCountActiveAccount, key: 'dgccrfActiveAccount', curve: dgccrfActiveAccount.entity.map(formatCurveDate(m))},
              {label: m.dgccrfCountAccount, key: 'dgccrfAccount', curve: dgccrfAccount.entity.map(formatCurveDate(m))},
            ]}/>
          )}
        </PanelBody>
      </Panel>

      <Panel loading={dgccrfSubscriptionsCurve.loading || dgccrfControlsCurve.loading}>
        <PanelHead>{m.dgccrfActions}</PanelHead>
        <PanelBody>
          {dgccrfSubscriptionsCurve.entity && dgccrfControlsCurve.entity && (
            <ScLineChart curves={[
              {label: m.dgccrfSubscriptionsCurve, key: 'getDgccrfSubscriptionsCurve', curve: dgccrfSubscriptionsCurve.entity.map(formatCurveDate(m))},
              {label: m.dgccrfControlsCurve, key: 'getDgccrfControlsCurve', curve: dgccrfControlsCurve.entity.map(formatCurveDate(m))},
            ]}/>
          )}
        </PanelBody>
      </Panel>

      <StatsReportsByRegion/>
    </Page>
  )
}
