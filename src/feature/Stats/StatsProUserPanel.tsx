import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import * as React from 'react'
import {statsFormatCurveDate} from './Stats'
import {useI18n} from '../../core/i18n'
import {useLogin} from '../../core/context/LoginContext'
import {Txt} from '../../alexlibs/mui-extension'
import {ChartAsync} from '../../shared/Chart/ChartAsync'
import {Period} from '@signal-conso/signalconso-api-sdk-js'

interface Props {
  ticks: number
  tickDuration?: Period
}

export const StatsProUserPanel = ({ticks, tickDuration}: Props) => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()

  return (
    <Panel>
      <PanelHead>{m.reportsOnFisrtProActivationAccount}</PanelHead>
      <PanelBody>
        <Txt color="hint" gutterBottom block dangerouslySetInnerHTML={{__html: m.reportsProUserDesc}} />
        <ChartAsync
          promisesDeps={[ticks, tickDuration]}
          promises={[
            () => api.secured.stats.getProReportTransmittedStat({ticks, tickDuration}),
            () => api.secured.stats.getReportedInactiveProAccountRate({ticks, tickDuration}),
          ]}
          curves={[
            {
              label: m.reportsProVisibleCount,
              key: 'visible_by_pro',
              curve: _ => _[0].map(statsFormatCurveDate(m)),
            },
            {
              label: m.proFirstAccountActivation,
              key: 'pro',
              curve: _ => _[1].map(statsFormatCurveDate(m)),
            },
          ]}
        />
      </PanelBody>
    </Panel>
  )
}
