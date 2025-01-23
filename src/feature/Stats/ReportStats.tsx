import { StatsReportsByRegion } from './StatsReportsByRegion'
import { StatsReportsCurvePanel } from './StatsReportsCurve'
import { StatsReportsInternetPanel } from './StatsReportsInternetPanel'

export const ReportStats = () => {
  return (
    <>
      <StatsReportsCurvePanel />
      <StatsReportsByRegion />
      <StatsReportsInternetPanel />
    </>
  )
}
