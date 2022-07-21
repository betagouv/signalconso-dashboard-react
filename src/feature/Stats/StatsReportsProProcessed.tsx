import {Report, ReportStatus, ReportTag} from 'core/model'
import {AsyncLineChart, toPercentage} from 'shared/Chart/LineChartWrappers'
import {Txt} from '../../alexlibs/mui-extension'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'

export const StatsReportsProProcessedPanel = () => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()

  const loadCurves = async () => {
    const [transmitted, responses] = await Promise.all([
      api.secured.stats.getProReportVisibleStat(),
      api.secured.stats.getProReportResponseStat(),
    ])
    return [
      {
        label: m.reportsProResponse,
        data: toPercentage(responses, transmitted),
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
