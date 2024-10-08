import { Page } from '../../shared/Page'

import { StatsProUserPanel } from './StatsProUserPanel'
import { StatsReportsProProcessedPanel } from './StatsReportsProProcessed'
import { StatsReportsProResponsePanel } from './StatsReportsProResponse'

export const ProStats = () => {
  return (
    <Page>
      <StatsProUserPanel />
      <StatsReportsProProcessedPanel />
      <StatsReportsProResponsePanel />
    </Page>
  )
}
