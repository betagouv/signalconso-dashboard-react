import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import * as React from 'react'
import {statsFormatCurveDate} from './Stats'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {Txt} from '../../alexlibs/mui-extension'
import {ChartAsync} from '../../shared/Chart/ChartAsync'

interface Props {
  ticks: number
}

export const StatsDgccrfSubscriptionsPanel = ({ticks}: Props) => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()
  return (
    <Panel>
      <PanelHead>{m.dgccrfActions}</PanelHead>
      <PanelBody>
        <Txt color="hint" gutterBottom block dangerouslySetInnerHTML={{__html: m.dgccrfActionsDesc}} />
        <ChartAsync
          promisesDeps={[ticks]}
          promises={[
            () => api.secured.stats.getDgccrfSubscriptionsCurve({ticks}),
            () => api.secured.stats.getDgccrfControlsCurve({ticks}),
          ]}
          curves={[
            {
              label: m.dgccrfSubscriptionsCurve,
              key: 'getDgccrfSubscriptionsCurve',
              curve: promises => promises[0].map(statsFormatCurveDate(m)),
            },
            {
              label: m.dgccrfControlsCurve,
              key: 'getDgccrfControlsCurve',
              curve: promises => promises[1].map(statsFormatCurveDate(m)),
            },
          ]}
        />
      </PanelBody>
    </Panel>
  )
}
