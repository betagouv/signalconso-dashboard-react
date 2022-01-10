import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {ScLineChart} from '../../shared/Chart/Chart'
import * as React from 'react'
import {useEffect} from 'react'
import {statsFormatCurveDate} from './Stats'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useI18n} from '../../core/i18n'
import {useLogin} from '../../core/context/LoginContext'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Txt} from 'mui-extension/lib/Txt/Txt'

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
      <PanelHead>{m.reportsProUserInactiveAccountRate}</PanelHead>
      <PanelBody>
        <Txt color="hint" gutterBottom block dangerouslySetInnerHTML={{__html: m.reportsProUserDesc}}/>
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
