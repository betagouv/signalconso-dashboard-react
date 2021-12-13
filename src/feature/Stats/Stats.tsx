import {Page, PageTitle} from 'shared/Layout'
import * as React from 'react'
import {CountByDate} from '@signal-conso/signalconso-api-sdk-js'
import {useI18n} from '../../core/i18n'
import {StatsReportsByRegion} from './StatsReportsByRegion'
import {I18nContextProps} from '../../core/i18n/I18n'
import {StatsReportsCurvePanel} from './StatsReportsCurve'
import {StatsProUserPanel} from './StatsProUserPanel'
import {StatsDgccrfAccountPanel} from './StatsDgccrfAccountPanel'
import {StatsDgccrfSubscriptionsPanel} from './StatsDgccrfSubscriptionsPanel'
import {StatsReportsInternetPanel} from './StatsReportsInternetPanel'

const ticks = 12

export const statsFormatCurveDate = (m: I18nContextProps['m']) => ({date, count}: CountByDate): {date: string, count: number} => ({
  date: (m.monthShort_ as any)[date.getMonth() + 1],
  count,
})

export const Stats = () => {
  const {m} = useI18n()

  return (
    <Page>
      <PageTitle>{m.menu_stats}</PageTitle>

      <StatsReportsCurvePanel ticks={ticks}/>
      <StatsProUserPanel ticks={ticks}/>
      <StatsDgccrfAccountPanel ticks={ticks}/>
      <StatsDgccrfSubscriptionsPanel ticks={ticks}/>
      <StatsReportsByRegion/>
      <StatsReportsInternetPanel/>
    </Page>
  )
}
