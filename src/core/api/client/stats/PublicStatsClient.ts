import {ApiClientApi} from '../../core/ApiClient'
import {MonthlyStat, SimpleStat} from './ReportStats'

export class PublicStatsClient {

  constructor(private client: ApiClientApi) {
  }

  readonly getReportCount = () => {
    return this.client.get(`/stats/reports/count`)
  }

  readonly getMonthlyReportCount = () => {
    return this.client.get<MonthlyStat[]>(`/stats/reports/count/monthly`)
  }

  readonly getReportForwardedToProPercentage = () => {
    return this.client.get<SimpleStat>(`/stats/reports/forwarded/percentage`)
  }

  readonly getReportReadByProPercentage = () => {
    return this.client.get<SimpleStat>(`/stats/reports/read/percentage`)
  }

  readonly getMonthlyReportForwardedToProPercentage = () => {
    return this.client.get<MonthlyStat[]>(`/stats/reports/forwarded/percentage/monthly`)
  }

  readonly getMonthlyReportReadByProPercentage = () => {
    return this.client.get<MonthlyStat[]>(`/stats/reports/read/percentage/monthly`)
  }

  readonly getReportWithResponsePercentage = () => {
    return this.client.get<SimpleStat>(`/stats/reports/responsed/percentage`)
  }

  readonly getMonthlyReportWithResponsePercentage = () => {
    return this.client.get<MonthlyStat[]>(`/stats', 'reports/responsed/percentage/monthly`)
  }

  readonly getReportWithWebsitePercentage = () => {
    return this.client.get<SimpleStat>(`/stats/reports/website/percentage`)
  }
}
