import {ApiClientApi} from '../ApiClient'
import {CountByDate, CurveStatsParams, SimpleStat} from './Stats'
import {Id, Report, ReportSearch, ReportStatus} from '../../model'
import {cleanObject, roundValue} from '../../helper'
import {subDays} from 'date-fns'
import {pipe} from 'rxjs'
import {cleanReportFilter, reportFilter2QueryString} from '../report/ReportsClient'

export class PublicStatsClient {
  constructor(private client: ApiClientApi) {}

  private readonly baseURL = `stats/reports`

  readonly getReportCount = (filters?: ReportSearch) => {
    const qs = filters ? pipe(cleanReportFilter, reportFilter2QueryString, cleanObject)(filters) : undefined
    return this.client.get<SimpleStat>(`${this.baseURL}/count`, {qs})
  }
  readonly getReportCountCurve = (search?: ReportSearch & CurveStatsParams) => {
    return this.client
      .get<CountByDate[]>(`${this.baseURL}/curve`, {qs: search})
      .then(res => res.map(_ => ({..._, date: new Date(_.date)})))
  }

  readonly percentage = new PublicStatsPercentageClient(this)

  readonly percentageCurve = new PublicStatsCurveClient(this)
}

class PublicStatsPercentageClient {
  constructor(private client: PublicStatsClient) {}

  private readonly delayBeforeCountingToWaitForProResponseInDays = 30

  private readonly statsAdminStartDate = new Date('2019-01-01')

  private readonly getPercentByStatus = async ({
    companyId,
    status,
    baseStatus,
    start,
    end,
  }: {
    companyId?: Id
    status: ReportStatus[]
    baseStatus?: ReportStatus[]
    start?: Date
    end?: Date
  }): Promise<SimpleStat> => {
    const [count, baseCount] = await Promise.all([
      this.client.getReportCount({start, end, status, ...(companyId ? {companyIds: [companyId]} : {})}),
      this.client.getReportCount({start, end, status: baseStatus, ...(companyId ? {companyIds: [companyId]} : {})}),
    ])
    return {value: roundValue((+count.value / +baseCount.value) * 100)}
  }
  readonly getReportForwardedToPro = (companyId?: Id): Promise<SimpleStat> => {
    return this.getPercentByStatus({
      companyId,
      status: Report.transmittedStatus,
      start: this.statsAdminStartDate,
      end: subDays(new Date(), this.delayBeforeCountingToWaitForProResponseInDays),
    })
  }

  readonly getReportReadByPro = (companyId?: Id) => {
    return this.getPercentByStatus({
      companyId,
      status: Report.readStatus,
      baseStatus: Report.transmittedStatus,
      start: this.statsAdminStartDate,
      end: subDays(new Date(), this.delayBeforeCountingToWaitForProResponseInDays),
    })
  }

  readonly getReportWithResponse = (companyId?: Id) => {
    return this.getPercentByStatus({
      companyId,
      status: Report.respondedStatus,
      baseStatus: Report.readStatus,
      start: this.statsAdminStartDate,
      end: subDays(new Date(), this.delayBeforeCountingToWaitForProResponseInDays),
    })
  }

  readonly getReportWithWebsite = async (companyId?: Id): Promise<SimpleStat> => {
    const [count, baseCount] = await Promise.all([
      this.client.getReportCount({
        hasWebsite: true,
        start: this.statsAdminStartDate,
        end: subDays(new Date(), this.delayBeforeCountingToWaitForProResponseInDays),
        ...(companyId ? {companyIds: [companyId]} : {}),
      }),
      this.client.getReportCount({
        start: this.statsAdminStartDate,
        end: subDays(new Date(), this.delayBeforeCountingToWaitForProResponseInDays),
        ...(companyId ? {companyIds: [companyId]} : {}),
      }),
    ])
    return {value: roundValue((+count.value / +baseCount.value) * 100)}
  }
}

class PublicStatsCurveClient {
  constructor(private client: PublicStatsClient) {}

  private readonly getReportPercentageCurve = async ({
    companyId,
    ticks,
    tickDuration,
    status,
    baseStatus,
  }: CurveStatsParams & {companyId?: Id; status: ReportStatus[]; baseStatus?: ReportStatus[]}): Promise<CountByDate[]> => {
    const params = {
      status,
      ticks,
      tickDuration,
      ...(companyId ? {companyIds: [companyId]} : {}),
    }
    const baseParams = {
      status: baseStatus,
      ticks,
      tickDuration,
      ...(companyId ? {companyIds: [companyId]} : {}),
    }
    const [curve, baseCurve] = await Promise.all([
      this.client.getReportCountCurve(params),
      this.client.getReportCountCurve(baseParams),
    ])
    if (curve.length !== baseCurve.length) {
      console.error(params, curve, `doesn't have the same size than `, baseParams, baseCurve)
      return Promise.reject({code: 'front-side'})
    }
    return this.getPercent(curve, baseCurve)
  }

  private getPercent = (curve: CountByDate[], baseCurve: CountByDate[]): Promise<CountByDate[]> => {
    let res: CountByDate[] = []
    for (let i = 0; i < curve.length; i++) {
      if (curve[i].date.getTime() !== baseCurve[i].date.getTime()) {
        console.error(curve[i], `have different date than`, baseCurve[i], ' values: ', curve, baseCurve)
        return Promise.reject({code: 'front-side'})
      }
      res[i] = {
        count: roundValue((curve[i].count / baseCurve[i].count) * 100),
        date: curve[i].date,
      }
    }
    return Promise.resolve(res)
  }

  readonly getReportForwardedPercentage = async (params: CurveStatsParams & {companyId?: Id}): Promise<CountByDate[]> => {
    return this.getReportPercentageCurve({
      ...params,
      status: Report.transmittedStatus,
    })
  }

  readonly getReportRespondedPercentage = (params: CurveStatsParams & {companyId?: Id}) => {
    return this.getReportPercentageCurve({
      ...params,
      status: Report.respondedStatus,
      baseStatus: Report.readStatus,
    })
  }

  readonly getReportReadPercentage = (params: CurveStatsParams & {companyId?: Id}) => {
    return this.getReportPercentageCurve({
      ...params,
      status: Report.readStatus,
      baseStatus: Report.transmittedStatus,
    })
  }
}
