import {ApiClientApi, ReportTag} from '../..'
import {Id} from '../../model'
import {ReportsCountEvolution, ReportsCountEvolutionPeriod, ReportStatusDistribution, ReportTagsDistribution} from './CompanyStats'

export class CompanyStatsClient {
  constructor(private client: ApiClientApi) {
  }

  readonly getTags = (id: Id) => {
    return this.client.get<ReportTagsDistribution>(`/companies-stats/tags/${id}`)
  }
  readonly getStatus = (id: Id) => {
    return this.client.get<ReportStatusDistribution>(`/companies-stats/status/${id}`)
  }
  readonly getHosts = (id: Id) => {
    return this.client.get<ReportTag[]>(`/companies-stats/hosts/${id}`)
  }

  readonly getReportsCountEvolution = (id: Id, period: ReportsCountEvolutionPeriod): Promise<ReportsCountEvolution> => {
    return this.client.get(`/companies-stats/report-count/${id}`, {qs: {period}})
      .then(this.mapReportsCountByDate)
  }

  private readonly mapReportsCountByDate = (data: [string, number][]): ReportsCountEvolution => {
    return data.map(([date, count]) => ([new Date(date), count]))
  }
}
