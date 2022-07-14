import {Page} from '../../shared/Layout'

import {StatsProUserPanel} from './StatsProUserPanel'
import {StatsReportsProProcessedPanel} from './StatsReportsProProcessed'
import {StatsReportsProResponsePanel} from './StatsReportsProResponse'
import {TmpSandboxStatsPanel} from './TmpSandboxStatsPanel'

export const ProStats = () => {
  return (
    <Page>
      <TmpSandboxStatsPanel />
      <StatsProUserPanel />
      <StatsReportsProProcessedPanel />
      <StatsReportsProResponsePanel />
    </Page>
  )
}
