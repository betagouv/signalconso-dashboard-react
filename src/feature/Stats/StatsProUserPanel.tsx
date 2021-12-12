import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {ScLineChart} from '../../shared/Chart/Chart'
import * as React from 'react'
import {useEffect} from 'react'
import {statsFormatCurveDate} from './Stats'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useI18n} from '../../core/i18n'
import {useLogin} from '../../core/context/LoginContext'

interface Props {
  ticks: number
}

export const StatsProUserPanel = ({ticks}: Props) => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()
  const reportedActiveProAccountRate = useFetcher(api.secured.stats.getReportedActiveProAccountRate)

  useEffect(() => {
    reportedActiveProAccountRate.fetch({}, {ticks})
  }, [ticks])

  return (
    <Panel loading={reportedActiveProAccountRate.loading}>
      <PanelHead>{m.proUser}</PanelHead>
      <PanelBody>
        {reportedActiveProAccountRate.entity && (
          <ScLineChart curves={[
            {label: m.reportsProUserAccountRate, key: 'pro', curve: reportedActiveProAccountRate.entity.map(statsFormatCurveDate(m))},
          ]}/>
        )}
      </PanelBody>
    </Panel>
  )
}
