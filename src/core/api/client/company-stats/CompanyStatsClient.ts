import {ApiClientApi, ReportTag} from '../..'
import {Id} from '../../model'
import {ReportResponseReviews, ReportsCountEvolution, ReportsCountEvolutionPeriod, ReportStatusDistribution, ReportTagsDistribution} from './CompanyStats'

export class CompanyStatsClient {
  constructor(private client: ApiClientApi) {
  }

  readonly getTags = (id: Id) => {
    return this.client.get<ReportTagsDistribution>(`/company-stats/${id}/tags`)
  }
  readonly getStatus = (id: Id) => {
    return this.client.get<ReportStatusDistribution>(`/company-stats/${id}/status`)
  }

  readonly getHosts = (id: Id) => {
    return this.client.get<ReportTag[]>(`/company-stats/${id}/hosts`)
  }

  readonly getResponseReviews = (id: Id) => {
    return this.client.get<ReportResponseReviews>(`/company-stats/${id}/reviews`)
  }

  readonly getReportsCountEvolution = (id: Id, period: ReportsCountEvolutionPeriod): Promise<ReportsCountEvolution> => {
    return this.client.get(`/company-stats/${id}/report-count`, {qs: {period}})
      .then(this.mapReportsCountByDate)
  }

  private readonly mapReportsCountByDate = (data: [string, number][]): ReportsCountEvolution => {
    return data.map(([date, count]) => ([new Date(date), count]))
  }
}
