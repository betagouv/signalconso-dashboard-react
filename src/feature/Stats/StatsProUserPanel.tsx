import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {ScLineChart} from '../../shared/Chart/Chart'
import * as React from 'react'
import {useEffect} from 'react'
import {statsFormatCurveDate} from './Stats'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useI18n} from '../../core/i18n'
import {useLogin} from '../../core/context/LoginContext'
import {Alert} from 'mui-extension'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Text} from 'recharts'

interface Props {
  ticks: number
}

export const StatsProUserPanel = ({ticks}: Props) => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()
  const cssUtils = useCssUtils()
  const reportedActiveProAccountRate = useFetcher(api.secured.stats.getReportedInactiveProAccountRate)

  useEffect(() => {
    reportedActiveProAccountRate.fetch({}, {ticks})
  }, [ticks])

  return (
    <Panel loading={reportedActiveProAccountRate.loading}>
      <Alert type="info" className={cssUtils.marginBottom2}>
        <Text>{m.reportsProUserDesc}</Text>
      </Alert>
      <PanelHead>{m.reportsProUserInactiveAccountRate}</PanelHead>
      <PanelBody>
        {reportedActiveProAccountRate.entity && (
          <ScLineChart
            curves={[
              {
                label: m.reportsProUserInactiveAccountRateDesc,
                key: 'pro',
                curve: reportedActiveProAccountRate.entity.map(statsFormatCurveDate(m)),
              },
            ]}
          />
        )}
      </PanelBody>
    </Panel>
  )
}
