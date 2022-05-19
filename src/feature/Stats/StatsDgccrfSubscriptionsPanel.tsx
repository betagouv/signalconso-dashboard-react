import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {ScLineChart} from '../../shared/Chart/Chart'
import * as React from 'react'
import {useEffect} from 'react'
import {statsFormatCurveDate} from './Stats'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Txt} from 'mui-extension/lib/Txt/Txt'
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
              () => api.secured.stats.getDgccrfControlsCurve({ticks}),
              () => api.secured.stats.getDgccrfSubscriptionsCurve({ticks}),
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
