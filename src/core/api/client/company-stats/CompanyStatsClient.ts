import {ApiClientApi, ReportTag} from '../..'
import {Id} from '../../model'
import {Period, ReportResponseReviews, ReportsCountEvolution, ReportStatusDistribution, ReportTagsDistribution} from './CompanyStats'
import {duration, Duration} from '@alexandreannic/ts-utils/lib/common'

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

  readonly getReadDelay = (id: Id): Promise<Duration | undefined> => {
    return this.client.get<{value: number | undefined}>(`/company-stats/${id}/read-delay-hours`)
      .then(_ => _.value ? duration(_.value, 'hour') : undefined)
  }

  readonly getResponseDelay = (id: Id): Promise<Duration | undefined> => {
    return this.client.get<{value: number | undefined}>(`/company-stats/${id}/response-delay-hours`)
      .then(_ => _.value ? duration(_.value, 'hour') : undefined)
  }

  readonly getReportsCountEvolution = (id: Id, period: Period): Promise<ReportsCountEvolution[]> => {
    return this.client.get(`/company-stats/${id}/report-count`, {qs: {period}})
      .then(this.mapReportsCountByDate)
  }

  private readonly mapReportsCountByDate = (data: ReportsCountEvolution[]): ReportsCountEvolution[] => {
    return data.map(x => ({...x, data: new Date(x.date)}))
  }
}
