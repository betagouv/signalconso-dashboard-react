import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {ScLineChart} from '../../shared/Chart/Chart'
import * as React from 'react'
import {statsFormatCurveDate} from './Stats'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useEffect} from 'react'

interface Props {
  ticks: number
}
export const StatsDgccrfAccountPanel = ({ticks}: Props) => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()

  const dgccrfActiveAccount = useFetcher(api.secured.stats.getActiveDgccrfAccountCurve)
  const dgccrfAccount = useFetcher(api.secured.stats.getDgccrfAccountCurve)

  useEffect(() => {
    dgccrfActiveAccount.fetch({}, {ticks})
    dgccrfAccount.fetch({}, {ticks})
  }, [ticks])

  return (
    <Panel loading={dgccrfActiveAccount.loading || dgccrfAccount.loading}>
      <PanelHead>{m.dgccrfUser}</PanelHead>
      <PanelBody>
        {dgccrfActiveAccount.entity && dgccrfAccount.entity && (
          <ScLineChart curves={[
            {label: m.dgccrfCountActiveAccount, key: 'dgccrfActiveAccount', curve: dgccrfActiveAccount.entity.map(statsFormatCurveDate(m))},
            {label: m.dgccrfCountAccount, key: 'dgccrfAccount', curve: dgccrfAccount.entity.map(statsFormatCurveDate(m))},
          ]}/>
        )}
      </PanelBody>
    </Panel>
  )
}
