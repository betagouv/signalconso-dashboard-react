import {ApiClientApi} from '../../core/ApiClient'
import {SimpleStat} from './ReportStats'

export class ReportStatsClient {

  constructor(private client: ApiClientApi) {
  }

  readonly getReportReadByProMedianDelay = () => {
    return this.client.get<SimpleStat>(`/stats/reports/read/delay`)
  }

  readonly getReportWithResponseMedianDelay = () => {
    return this.client.get<SimpleStat>(`/stats/reports/responsed/delay`)
  }
}
