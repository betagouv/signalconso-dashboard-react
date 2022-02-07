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

interface Props {
  ticks: number
}

export const StatsDgccrfSubscriptionsPanel = ({ticks}: Props) => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()

  const dgccrfControlsCurve = useFetcher(api.secured.stats.getDgccrfControlsCurve)
  const dgccrfSubscriptionsCurve = useFetcher(api.secured.stats.getDgccrfSubscriptionsCurve)
  const cssUtils = useCssUtils()

  useEffect(() => {
    dgccrfControlsCurve.fetch({}, {ticks})
    dgccrfSubscriptionsCurve.fetch({}, {ticks})
  }, [ticks])

  return (
    <Panel loading={dgccrfSubscriptionsCurve.loading || dgccrfControlsCurve.loading}>
      <PanelHead>{m.dgccrfActions}</PanelHead>
      <PanelBody>
        <Txt color="hint" gutterBottom block dangerouslySetInnerHTML={{__html: m.dgccrfActionsDesc}} />
        {dgccrfSubscriptionsCurve.entity && dgccrfControlsCurve.entity && (
          <ScLineChart
            curves={[
              {
                label: m.dgccrfSubscriptionsCurve,
                key: 'getDgccrfSubscriptionsCurve',
                curve: dgccrfSubscriptionsCurve.entity.map(statsFormatCurveDate(m)),
              },
              {
                label: m.dgccrfControlsCurve,
                key: 'getDgccrfControlsCurve',
                curve: dgccrfControlsCurve.entity.map(statsFormatCurveDate(m)),
              },
            ]}
          />
        )}
      </PanelBody>
    </Panel>
  )
}
