import { SimplifiedAsyncLineChart } from 'shared/Chart/chartWrappers'
import { CleanWidePanel } from 'shared/Panel/simplePanels'
import { Txt } from '../../alexlibs/mui-extension'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useI18n } from '../../core/i18n'

export const StatsDgccrfAccountPanel = () => {
  const { api: api } = useConnectedContext()
  const { m } = useI18n()
  const ticks = 12
  return (
    <CleanWidePanel>
      <h2 className="font-bold text-xl mb-2">{m.dgccrfUser}</h2>
      <div>
        <Txt
          color="hint"
          gutterBottom
          block
          dangerouslySetInnerHTML={{ __html: m.dgccrfUserDesc }}
        />
        <SimplifiedAsyncLineChart
          curves={[
            {
              label: m.dgccrfCountActiveAccount,
              loadData: () =>
                api.secured.stats.getActiveDgccrfAccountCurve({ ticks }),
            },
            {
              label: m.dgccrfCountAccount,
              loadData: () =>
                api.secured.stats.getDgccrfAccountCurve({ ticks }),
            },
          ]}
        />
      </div>
    </CleanWidePanel>
  )
}
