import {Page} from 'shared/Layout'
import {useEffect} from 'react'
import {Period} from '@signal-conso/signalconso-api-sdk-js'
import {useStatsContext} from '../../core/context/StatsContext'
import {useLogin} from '../../core/context/LoginContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib/lib'

const ticks = 12
const period: Period = 'Month'

export const Stats = () => {

  const {apiSdk} = useLogin()
  const reportCount = useFetcher(apiSdk.public.stats.getReportCount)
  const reportInternetCount = useFetcher(() => apiSdk.public.stats.getReportCount({}))

  const _stats = useStatsContext()

  const fetchCurve = (period: Period) => {
    _stats.curve.reportCount.fetch({}, {ticks, tickDuration: period})
    _stats.curve.reportRespondedCount.fetch({}, {ticks, tickDuration: period})
  }

  useEffect(() => {

  }, [])

  return (
    <Page>

    </Page>
  )
}
