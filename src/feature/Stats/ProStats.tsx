import { StatsProUserPanel } from './StatsProUserPanel'
import { StatsReportsProProcessedPanel } from './StatsReportsProProcessed'
import { StatsReportsProResponsePanel } from './StatsReportsProResponse'

export const ProStats = () => {
  return (
    <>
      <StatsProUserPanel />
      <StatsReportsProProcessedPanel />
      <StatsReportsProResponsePanel />
    </>
  )
}
