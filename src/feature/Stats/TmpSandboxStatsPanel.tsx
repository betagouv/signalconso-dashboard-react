import {SimplifiedAsyncLineChart} from 'shared/Chart/LineChartWrappers'
import {useLogin} from '../../core/context/LoginContext'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'

export const TmpSandboxStatsPanel = () => {
  const {apiSdk: api} = useLogin()
  const curves = [
    // {
    //   label: 'tous les signalements',
    //   color: 'gray',
    //   loadData: () => api.public.stats.getReportCountCurve(),
    // },
    {
      label: "tous les transmis + ceux où l'entreprise n'est pas identifiée",
      loadData: () => api.secured.stats.doTmpQuery('transmissible_or_nonidentified'),
    },
    {
      label: 'tous les transmis',
      loadData: () => api.secured.stats.doTmpQuery('transmissible'),
    },
    {
      label: 'réponses des pros (basée sur la date des signalements)',
      loadData: () => api.secured.stats.doTmpQuery('reponses_aux_transmissibles_base_sur_table_reports'),
    },
    {
      label: 'réponses des pros (basée sur la date des réponses)',
      loadData: () => api.secured.stats.doTmpQuery('responses_corrected_to_transmissibles'),
    },
  ]

  return (
    <Panel>
      <PanelHead>Comparaison des différentes queries</PanelHead>
      <PanelBody>
        <SimplifiedAsyncLineChart {...{curves}} />
      </PanelBody>
    </Panel>
  )
}
