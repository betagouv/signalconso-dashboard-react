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
import {StatsReportsProProcessedPanel} from "./StatsReportsProProcessed";
import {StatsReportsProResponsePanel} from "./StatsReportsProResponse";

const ticks = 12

export const statsFormatCurveDate = (m: I18nContextProps['m']) => ({
                                                                       date,
                                                                       count
                                                                   }: CountByDate): { date: string, count: number } => ({
    date: (m.monthShort_ as any)[date.getMonth() + 1],
    count,
})

export const curveRatio = (numerator: CountByDate[], denominator: CountByDate[]): CountByDate[] => {

    return numerator.map<CountByDate>((k, i, t) =>
        ({
            date: k.date,
            count: denominator[i] && denominator[i].count > 0 ? Math.round((k.count / denominator[i].count) * 100) : 0
        } as CountByDate)
    )
}

export const Stats = () => {
    const {m} = useI18n()

    return (
        <Page>
            <PageTitle>{m.menu_stats}</PageTitle>
            <StatsReportsCurvePanel ticks={ticks}/>
            <StatsProUserPanel ticks={ticks}/>
            <StatsReportsProProcessedPanel ticks={ticks}/>
            <StatsReportsProResponsePanel/>
            <StatsDgccrfAccountPanel ticks={ticks}/>
            <StatsDgccrfSubscriptionsPanel ticks={ticks}/>
            <StatsReportsByRegion/>
            <StatsReportsInternetPanel/>
        </Page>
    )
}
