import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {ScLineChart} from '../../shared/Chart/Chart'
import * as React from 'react'
import {useEffect} from 'react'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {Period} from '@signal-conso/signalconso-api-sdk-js'
import {statsFormatCurveDate} from './Stats'
import {curveRatio} from './ReportStats'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Txt} from 'mui-extension/lib/Txt/Txt'

interface Props {
  ticks?: number
}

export const StatsReportsProProcessedPanel = ({ticks}: Props) => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()
  const cssUtils = useCssUtils()
  const reportCountCurve = useFetcher(api.public.stats.getReportCountCurve)
  const reportResponseCountCurve = useFetcher(api.secured.stats.getProReportResponseStat)
  const reportTransmittedCountCurve = useFetcher(api.secured.stats.getProReportTransmittedStat)

  const fetchCurve = (period: Period) => {
    reportCountCurve.fetch({}, {ticks, tickDuration: period})
    reportResponseCountCurve.fetch({}, {ticks})
    reportTransmittedCountCurve.fetch({}, {ticks})
  }

  useEffect(() => {
    fetchCurve('Month')
  }, [ticks])

  return (
    <Panel loading={reportCountCurve.loading || reportTransmittedCountCurve.loading || reportResponseCountCurve.loading}>
      <PanelHead>{m.reportsProProcessed}</PanelHead>
      <PanelBody>
        <Txt color="hint" gutterBottom block dangerouslySetInnerHTML={{__html: m.reportsProProcessedDesc}} />
        {reportCountCurve.entity && reportTransmittedCountCurve.entity && reportResponseCountCurve.entity && (
          <ScLineChart
            curves={[
              {
                label: m.reportsProVisible,
                key: 'visible_by_pro',
                curve: curveRatio(reportTransmittedCountCurve.entity, reportCountCurve.entity).map(statsFormatCurveDate(m)),
              },
              {
                label: m.reportsProResponse,
                key: 'response_pro',
                curve: curveRatio(reportResponseCountCurve.entity, reportCountCurve.entity).map(statsFormatCurveDate(m)),
              },
            ]}
          />
        )}
      </PanelBody>
    </Panel>
  )
}
