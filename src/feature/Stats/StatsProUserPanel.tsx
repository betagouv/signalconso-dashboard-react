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
import {curveRatio} from "./ReportStats";

interface Props {
  ticks: number
}

export const StatsProUserPanel = ({ticks}: Props) => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()
  const cssUtils = useCssUtils()
  const reportedActiveProAccountRate = useFetcher(api.secured.stats.getReportedInactiveProAccountRate)
  const reportVisibleByProCountCurve = useFetcher(api.secured.stats.getProReportTransmittedStat)

  useEffect(() => {
    reportedActiveProAccountRate.fetch({}, {ticks})
    reportVisibleByProCountCurve.fetch({}, {ticks})
  }, [ticks])

  return (
    <Panel loading={reportedActiveProAccountRate.loading || reportVisibleByProCountCurve.loading}>
      <PanelHead>{m.reportsOnFisrtProActivationAccount}</PanelHead>
      <PanelBody>
        <Txt color="hint" gutterBottom block dangerouslySetInnerHTML={{__html: m.reportsProUserDesc}}/>
        {reportedActiveProAccountRate.entity && reportVisibleByProCountCurve.entity && (
          <ScLineChart
            curves={[
                {
                    label: m.reportsProVisible,
                    key: 'visible_by_pro',
                    curve: reportVisibleByProCountCurve.entity.map(statsFormatCurveDate(m)),
                },
              {
                label: m.proFirstAccountActivation,
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
