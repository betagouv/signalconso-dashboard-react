
import {Page} from '../../shared/Layout'
import * as React from 'react'

import {StatsReportsByRegion} from "./StatsReportsByRegion";
import {StatsReportsCurvePanel} from "./StatsReportsCurve";
import {StatsReportsInternetPanel} from "./StatsReportsInternetPanel";
import {CountByDate} from "@signal-conso/signalconso-api-sdk-js";


export const curveRatio = (numerator: CountByDate[], denominator: CountByDate[]): CountByDate[] => {

    return numerator.map<CountByDate>((k, i, t) =>
        ({
            date: k.date,
            count: denominator[i] && denominator[i].count > 0 ? Math.round((k.count / denominator[i].count) * 100) : 0
        } as CountByDate)
    )
}

export const ReportStats = () => {
  return (
    <Page>
      <StatsReportsCurvePanel/>
      <StatsReportsByRegion/>
      <StatsReportsInternetPanel/>
    </Page>
  )
}
