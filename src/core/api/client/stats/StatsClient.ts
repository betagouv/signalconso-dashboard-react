import {ApiClientApi} from '../../index'
import {Id} from '../../model'
import {CountByDate, Period, ReportResponseReviews, ReportStatusDistribution, ReportTagsDistribution} from '../company-stats/CompanyStats'
import {duration, Duration} from '@alexandreannic/ts-utils/lib/common'
import {fnSwitch} from '../../../helper/utils'

export class StatsClient {
  constructor(private client: ApiClientApi) {
  }

  readonly getTags = (companyId: Id) => {
    return this.client.get<ReportTagsDistribution>(`/stats/tags`, {qs: {companyId}})
  }
  readonly getStatus = (companyId: Id) => {
    return this.client.get<ReportStatusDistribution>(`/stats/status`, {qs: {companyId}})
  }

  readonly getResponseReviews = (companyId: Id) => {
    return this.client.get<ReportResponseReviews>(`/stats/reviews`, {qs: {companyId}})
  }

  readonly getReadDelay = (companyId: Id): Promise<Duration | undefined> => {
    return this.client.get<{value: number | undefined}>(`/stats/reports/delay/read`, {qs: {companyId}})
      .then(_ => _.value ? duration(_.value, 'hour') : undefined)
  }

  readonly getResponseDelay = (companyId: Id): Promise<Duration | undefined> => {
    return this.client.get<{value: number | undefined}>(`/stats/reports/delay/responsed`, {qs: {companyId}})
      .then(_ => _.value ? duration(_.value, 'hour') : undefined)
  }

  readonly getReportsCountCurve = (companyId: Id, period: Period): Promise<CountByDate[]> => {
    const endpoint = fnSwitch(period, {
      'day': `/stats/reports/daily/count`,
    }, () => `/stats/reports/monthly/count`)
    return this.client.get(endpoint, {qs: {companyId}}).then(this.mapReportsCountByDate)
  }

  readonly getReportsRespondedCountCurve = (companyId: Id, period: Period): Promise<CountByDate[]> => {
    const endpoint = fnSwitch(period, {
      'day': `/stats/reports/daily/count-responded`,
    }, () => `/stats/reports/monthly/count-responded`)
    return this.client.get(endpoint, {qs: {companyId}}).then(this.mapReportsCountByDate)
  }

  private readonly mapReportsCountByDate = (data: CountByDate[]): CountByDate[] => {
    return data.map(_ => ({..._, date: new Date(_.date)}))
  }
}
