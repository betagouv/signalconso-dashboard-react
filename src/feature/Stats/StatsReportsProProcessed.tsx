import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import * as React from 'react'
import {useEffect} from 'react'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {Period} from '@signal-conso/signalconso-api-sdk-js'
import {statsFormatCurveDate} from './Stats'
import {curveRatio} from './ReportStats'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {ChartAsync} from '../../shared/Chart/ChartAsync'

interface Props {
  ticks?: number
}

export const StatsReportsProProcessedPanel = ({ticks}: Props) => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()

  return (
    <Panel>
      <PanelHead>{m.reportsProProcessed}</PanelHead>
      <PanelBody>
        <Txt color="hint" gutterBottom block dangerouslySetInnerHTML={{__html: m.reportsProProcessedDesc}} />
        <ChartAsync
          promisesDeps={[ticks]}
          promises={[
            () => api.public.stats.getReportCountCurve({ticks}),
            () => api.secured.stats.getProReportResponseStat({ticks}),
            () => api.secured.stats.getProReportTransmittedStat({ticks}),
          ]}
          curves={[{
            label: m.reportsProVisible,
            key: 'visible_by_pro',
            curve: promises => curveRatio(promises[2], promises[0]).map(statsFormatCurveDate(m)),
          }, {
            label: m.reportsProResponse,
            key: 'response_pro',
            curve: promises => curveRatio(promises[1], promises[0]).map(statsFormatCurveDate(m)),
          }]}
        />
      </PanelBody>
    </Panel>
  )
}
