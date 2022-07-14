import {useTheme} from '@mui/material'
import {toPercentage, AsyncLineChart} from 'shared/Chart/LineChartWrappers'
import {Txt} from '../../alexlibs/mui-extension'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'

export const StatsReportsProProcessedPanel = () => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()

  const loadCurves = async () => {
    const [reports, transmitted, responses] = await Promise.all([
      api.public.stats.getReportCountCurve(),
      api.secured.stats.getProReportTransmittedStat(),
      api.secured.stats.getProReportResponseStat(),
    ])
    return [
      {
        label: m.reportsProVisible,
        data: toPercentage(transmitted, reports),
      },
      {
        label: m.reportsProResponse,
        data: toPercentage(responses, reports),
      },
    ]
  }

  return (
    <Panel>
      <PanelHead>{m.reportsProProcessed}</PanelHead>
      <PanelBody>
        <Txt color="hint" gutterBottom block dangerouslySetInnerHTML={{__html: m.reportsProProcessedDesc}} />
        <AsyncLineChart {...{loadCurves}} />
      </PanelBody>
    </Panel>
  )
}
