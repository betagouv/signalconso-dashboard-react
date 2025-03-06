import { toPercentage } from 'shared/Chart/chartUtils'
import { AsyncLineChart } from 'shared/Chart/chartWrappers'
import { CleanWidePanel } from 'shared/Panel/simplePanels'
import { Alert } from '../../alexlibs/mui-extension'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
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
        <div className="text-gray-500">
          <ul className="list-disc list-inside">
            <li>
              Pourcentage des signalements transmis aux professionnels (certains
              signalements ne sont pas transmis, faute de pouvoir identifier
              l'entreprise, ou parce qu'elle n'est pas française)
            </li>
            <li>
              Pourcentage des signalements auxquels les professionnels ont
              répondu
            </li>
          </ul>
          <p>
            Ces deux pourcentages sont calculé par rapport aux signalements
            qu'on souhaite transmettre aux pros (on ne veut pas transmettre
            certains signalements relatifs à certaines catégories, remontés par
            des informateurs internes, etc. ...)
          </p>
        </div>
        <AsyncLineChart {...{ loadCurves }} />
        <Alert type="info" gutterTop>
          {m.reportsProProcessedInfo}
        </Alert>
      </div>
    </CleanWidePanel>
  )
}
