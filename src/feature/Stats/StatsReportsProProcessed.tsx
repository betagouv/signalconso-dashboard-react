import { AsyncLineChart, toPercentage } from 'shared/Chart/chartWrappers'
import { CleanWidePanel } from 'shared/Panel/simplePanels'
import { Alert, Txt } from '../../alexlibs/mui-extension'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useI18n } from '../../core/i18n'

export const StatsReportsProProcessedPanel = () => {
  const { api: api } = useConnectedContext()
  const { m } = useI18n()

  const loadCurves = async () => {
    const [toTransmit, transmitted, responses] = await Promise.all([
      api.secured.stats.getProReportToTransmitStat(),
      api.secured.stats.getProReportTransmittedStat(),
      api.secured.stats.getProReportResponseStat(),
    ])
    return [
      {
        label: m.reportsProTransmitted,
        data: toPercentage(transmitted, toTransmit),
      },
      {
        label: m.reportsProResponse,
        data: toPercentage(responses, toTransmit),
      },
    ]
  }

  return (
    <CleanWidePanel>
      <h2 className="font-bold text-xl mb-2">{m.reportsProProcessed}</h2>
      <div>
        <Txt
          color="hint"
          gutterBottom
          block
          dangerouslySetInnerHTML={{ __html: m.reportsProProcessedDesc }}
        />
        <AsyncLineChart {...{ loadCurves }} />
        <Alert type="info" gutterTop>
          {m.reportsProProcessedInfo}
        </Alert>
      </div>
    </CleanWidePanel>
  )
}
