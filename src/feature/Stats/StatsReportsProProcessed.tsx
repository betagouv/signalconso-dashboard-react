import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {ScLineChart} from '../../shared/Chart/Chart'
import * as React from 'react'
import {useEffect} from 'react'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {CurveStatsParams, Period, ReportStatus} from '@signal-conso/signalconso-api-sdk-js'
import {curveRatio, statsFormatCurveDate} from './Stats'

interface Props {
  ticks?: number
}

export const StatsReportsProProcessedPanel = ({ticks}: Props) => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()

  const reportCountCurve = useFetcher(api.public.stats.getReportCountCurve)
  const reportResponseCountCurve = useFetcher(api.secured.stats.getProReportResponseStat)
  const reportTransmittedCountCurve = useFetcher(api.secured.stats.getProReportTransmittedStat)
  const reportCountVisibleByProCurve = useFetcher((_: CurveStatsParams) =>
      api.public.stats.getReportCountCurve({
        ..._, status: [
          ReportStatus.TraitementEnCours,
          ReportStatus.Transmis,
          ReportStatus.PromesseAction,
          ReportStatus.Infonde,
          ReportStatus.NonConsulte,
          ReportStatus.ConsulteIgnore,
          ReportStatus.MalAttribue]
      }),
  )

  const fetchCurve = (period: Period) => {
    reportCountCurve.fetch({}, {ticks, tickDuration: period})
    reportResponseCountCurve.fetch({}, {ticks})
    reportTransmittedCountCurve.fetch({}, {ticks})
    reportCountVisibleByProCurve.fetch({}, {ticks, tickDuration: period})
  }

  useEffect(() => {
    fetchCurve('Month')
  }, [ticks])

  return (
    <Panel loading={reportCountCurve.loading || reportTransmittedCountCurve.loading || reportResponseCountCurve.loading || reportCountVisibleByProCurve.loading}>
      <PanelHead>{m.reportsProProcessed}</PanelHead>
      <PanelBody>
        {

            reportCountCurve.entity
            && reportTransmittedCountCurve.entity
            && reportResponseCountCurve.entity
            && reportCountVisibleByProCurve.entity && (
                <ScLineChart curves={[
                  {
                    label: m.reportsProVisible,
                    key: 'visible_by_pro',
                    curve: curveRatio(reportCountVisibleByProCurve.entity, reportCountCurve.entity).map(statsFormatCurveDate(m))
                  },
                  {
                    label: m.reportsProResponse,
                    key: 'response_pro',
                    curve: curveRatio(reportResponseCountCurve.entity, reportCountCurve.entity).map(statsFormatCurveDate(m))
                  },
                  {
                    label: m.reportsProTransmitted,
                    key: 'transmitted_pro',
                    curve: curveRatio(reportTransmittedCountCurve.entity, reportCountCurve.entity).map(statsFormatCurveDate(m))
                  }
                ]}/>
            )}
      </PanelBody>
    </Panel>
  )
}
