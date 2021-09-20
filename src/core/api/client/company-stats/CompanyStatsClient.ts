import {ApiClientApi, ReportTag} from '../..'
import {Id} from '../../model'
import {ReportResponseReviews, ReportsCountEvolution, Period, ReportStatusDistribution, ReportTagsDistribution} from './CompanyStats'

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

  readonly getResponseDelay = (id: Id) => {
    return this.client.get<any>(`/company-stats/${id}/response-delay-days`)
  }

  readonly getReportsCountEvolution = (id: Id, period: Period): Promise<ReportsCountEvolution[]> => {
    return this.client.get(`/company-stats/${id}/report-count`, {qs: {period}})
      .then(this.mapReportsCountByDate)
  }

  private readonly mapReportsCountByDate = (data: ReportsCountEvolution[]): ReportsCountEvolution[] => {
    return data.map(x => ({...x, data: new Date(x.date)}))
  }
}
