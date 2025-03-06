import { SimplifiedAsyncLineChart } from 'shared/Chart/chartWrappers'
import { CleanWidePanel } from 'shared/Panel/simplePanels'
import { Txt } from '../../alexlibs/mui-extension'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { useI18n } from '../../core/i18n'

export const StatsDgccrfSubscriptionsPanel = () => {
  const { api: api } = useConnectedContext()
  const { m } = useI18n()
  const ticks = 12
  return (
    <CleanWidePanel>
      <h2 className="font-bold text-xl mb-2">{m.dgccrfActions}</h2>
      <div>
        <Txt
          color="hint"
          gutterBottom
          block
          dangerouslySetInnerHTML={{ __html: m.dgccrfActionsDesc }}
        />
        <SimplifiedAsyncLineChart
          curves={[
            {
              label: m.dgccrfSubscriptionsCurve,
              loadData: () =>
                api.secured.stats.getDgccrfSubscriptionsCurve({ ticks }),
            },
            {
              label: m.dgccrfControlsCurve,
              loadData: () =>
                api.secured.stats.getDgccrfControlsCurve({ ticks }),
            },
          ]}
        />
      </div>
    </CleanWidePanel>
  )
}
