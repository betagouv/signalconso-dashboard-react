import { Page } from '../../shared/Page'

import { StatsReportsByRegion } from './StatsReportsByRegion'
import { StatsReportsCurvePanel } from './StatsReportsCurve'
import { StatsReportsInternetPanel } from './StatsReportsInternetPanel'

export const ReportStats = () => {
  return (
    <Page>
      <StatsReportsCurvePanel />
      <StatsReportsByRegion />
      <StatsReportsInternetPanel />
    </Page>
  )
}
