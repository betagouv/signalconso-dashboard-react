import {useTheme} from '@mui/material'
import {SimplifiedAsyncLineChart} from 'shared/Chart/LineChartWrappers'
import {CleanWidePanel} from 'shared/Panel/simplePanels'
import {Txt} from '../../alexlibs/mui-extension'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'

export const StatsProUserPanel = () => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()
  const theme = useTheme()
  const ticks = 12
  return (
    <CleanWidePanel>
      <h2 className="font-bold text-xl mb-2">{m.reportsOnFisrtProActivationAccount}</h2>
      <div>
        <Txt color="hint" gutterBottom block dangerouslySetInnerHTML={{__html: m.reportsProUserDesc}} />
        <SimplifiedAsyncLineChart
          curves={[
            {
              label: m.reportsProTransmittedCount,
              loadData: () => api.secured.stats.getProReportTransmittedStat({ticks}),
            },
            {
              label: m.proFirstAccountActivation,
              loadData: () => api.secured.stats.getReportedInactiveProAccountRate({ticks}),
            },
          ]}
        />
      </div>
    </CleanWidePanel>
  )
}
