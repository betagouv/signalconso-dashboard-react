import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import * as React from 'react'
import {statsFormatCurveDate} from './Stats'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {ChartAsync} from '../../shared/Chart/ChartAsync'

interface Props {
  ticks: number
}

export const StatsDgccrfAccountPanel = ({ticks}: Props) => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()

  return (
    <Panel>
      <PanelHead>{m.dgccrfUser}</PanelHead>
      <PanelBody>
        <Txt color="hint" gutterBottom block dangerouslySetInnerHTML={{__html: m.dgccrfUserDesc}} />
        <ChartAsync
          promisesDeps={[ticks]}
          promises={[
            () => api.secured.stats.getActiveDgccrfAccountCurve({ticks}),
            () => api.secured.stats.getDgccrfAccountCurve({ticks}),
          ]}
          curves={[
            {
              label: m.dgccrfCountActiveAccount,
              key: 'dgccrfActiveAccount',
              curve: ([activeAccounts]) => activeAccounts.map(statsFormatCurveDate(m)),
            },
            {
              label: m.dgccrfCountAccount,
              key: 'dgccrfAccount',
              curve: ([, allAccounts]) => allAccounts.map(statsFormatCurveDate(m)),
            },
          ]}
        />
      </PanelBody>
    </Panel>
  )
}
