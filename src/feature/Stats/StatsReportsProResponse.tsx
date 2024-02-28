import {AsyncLineChart, toPercentage} from 'shared/Chart/LineChartWrappers'
import {CleanWidePanel} from 'shared/Panel/simplePanels'
import {Txt} from '../../alexlibs/mui-extension'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'

export const StatsReportsProResponsePanel = () => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()
  const loadCurves = async () => {
    const [allResponses, notConcerned, rejected, accepted] = await Promise.all([
      api.secured.stats.getProReportResponseStat(),
      api.secured.stats.getProReportResponseStat({
        responseStatusQuery: ['NOT_CONCERNED'],
      }),
      api.secured.stats.getProReportResponseStat({
        responseStatusQuery: ['REJECTED'],
      }),
      api.secured.stats.getProReportResponseStat({
        responseStatusQuery: ['ACCEPTED'],
      }),
    ])
    return [
      {
        label: m.reportsProMalAttribue,
        data: toPercentage(notConcerned, allResponses),
      },
      {
        label: m.reportsProInfonde,
        data: toPercentage(rejected, allResponses),
      },
      {
        label: m.reportsProPromesseAction,
        data: toPercentage(accepted, allResponses),
      },
    ]
  }
  return (
    <CleanWidePanel>
      <h2 className="font-bold text-xl mb-2">{m.reportsProResponseType}</h2>
      <div>
        <Txt color="hint" gutterBottom block dangerouslySetInnerHTML={{__html: m.reportsProResponseTypeDesc}} />
        <AsyncLineChart {...{loadCurves}} />
      </div>
    </CleanWidePanel>
  )
}
