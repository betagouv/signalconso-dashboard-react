import {Page} from '../../shared/Layout'
import * as React from 'react'

import {StatsReportsByRegion} from './StatsReportsByRegion'
import {StatsReportsCurvePanel} from './StatsReportsCurve'
import {StatsReportsInternetPanel} from './StatsReportsInternetPanel'
import {CountByDate} from '@signal-conso/signalconso-api-sdk-js'

export const ReportStats = () => {
  return (
    <Page>
      <StatsReportsCurvePanel />
      <StatsReportsByRegion />
      <StatsReportsInternetPanel />
    </Page>
  )
}
