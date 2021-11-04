import {Page} from 'shared/Layout'
import {useEffect} from 'react'
import {Period, ReportTag} from '@signal-conso/signalconso-api-sdk-js'
import {useStatsContext} from '../../core/context/StatsContext'
import {useLogin} from '../../core/context/LoginContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib/lib'

const ticks = 12
const period: Period = 'Month'

export const Stats = () => {

  const {apiSdk} = useLogin()
  const reportCount = useFetcher(apiSdk.public.stats.curve.getReportCount)
  const reportInternetCount = useFetcher(() => apiSdk.public.stats.curve.getReportCount({tags: [ReportTag.Internet]}))

  const _stats = useStatsContext()

  const fetchCurve = (period: Period) => {
    reportCount.fetch({}, {ticks, tickDuration: period})
    reportInternetCount.fetch({}, {ticks, tickDuration: period})
  }

  useEffect(() => {
    reportCount.fetch()
    reportInternetCount.fetch()
  }, [])

  return (
    <Page>

    </Page>
  )
}
