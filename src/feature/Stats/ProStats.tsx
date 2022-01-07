
import {Page} from '../../shared/Layout'
import * as React from 'react'

import {StatsProUserPanel} from "./StatsProUserPanel";
import {StatsReportsProProcessedPanel} from "./StatsReportsProProcessed";
import {StatsReportsProResponsePanel} from "./StatsReportsProResponse";


export const ProStats = () => {
  return (
    <Page>
      <StatsProUserPanel ticks={12}/>
      <StatsReportsProProcessedPanel/>
      <StatsReportsProResponsePanel/>
    </Page>
  )
}
