import {Page} from 'shared/Layout'
import {useEffect} from 'react'
import {Period, ReportTag, CurveStatsParams} from '@signal-conso/signalconso-api-sdk-js'
import {useLogin} from '../../core/context/LoginContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib/lib'

const ticks = 12
const period: Period = 'Month'

export const Stats = () => {

  const {apiSdk} = useLogin()
  const reportCount = useFetcher(apiSdk.public.stats.getReportCountCurve)
  const reportInternetCount = useFetcher((_: CurveStatsParams) => apiSdk.public.stats.getReportCount({..._, tags: [ReportTag.Internet]}))

  const fetchCurve = (period: Period) => {
    reportCount.fetch({}, {ticks, tickDuration: period})
    reportInternetCount.fetch({}, {ticks, tickDuration: period})
  }

  useEffect(() => {
    fetchCurve('Month')
  }, [])

  return (
    <Page>

    </Page>
  )
}
