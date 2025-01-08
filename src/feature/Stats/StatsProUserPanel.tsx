import { SimplifiedAsyncLineChart } from 'shared/Chart/chartWrappers'
import { CleanWidePanel } from 'shared/Panel/simplePanels'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useI18n } from '../../core/i18n'

export const StatsProUserPanel = () => {
  const { api: api } = useConnectedContext()
  const { m } = useI18n()
  const ticks = 12
  return (
    <CleanWidePanel>
      <h2 className="font-bold text-xl mb-2">
        {m.reportsOnFisrtProActivationAccount}
      </h2>
      <div>
        <ul className="text-gray-500 list-disc list-inside">
          <li>
            Nombre de signalements transmis aux professionnels (certains
            signalements n'ont pas vocation à être transmis, par exemple ceux
            relatifs aux produit dangereux. D'autres ne peuvent être transmis,
            par exemple si l'entreprise n'a pu être identifiée)
          </li>
          <li>
            Nombre d'entreprises ayant activé un compte utilisateur la première
            fois.
          </li>
        </ul>
        <SimplifiedAsyncLineChart
          curves={[
            {
              label: m.reportsProTransmittedCount,
              loadData: () =>
                api.secured.stats.getProReportTransmittedStat({ ticks }),
            },
            {
              label: m.proFirstAccountActivation,
              loadData: () =>
                api.secured.stats.getReportedInactiveProAccountRate({ ticks }),
            },
          ]}
        />
      </div>
    </CleanWidePanel>
  )
}
