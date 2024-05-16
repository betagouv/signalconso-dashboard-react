import {ReportStatus, ReportStatusPro} from '../report/Report'
import {Index} from '../../helper'

export interface SimpleStat {
  value: string | number
}

export type Period = 'Day' | 'Week' | 'Month'

export type ReportResponseType = 'ACCEPTED' | 'REJECTED' | 'NOT_CONCERNED'

export interface CountByDate {
  date: Date
  count: number
}

export type ReportStatusDistribution = {[key in ReportStatus]: number}
export type ReportStatusProDistribution = {[key in ReportStatusPro]: number}
export type ReportStatusDistributionWithTotals = {
  distribution: ReportStatusDistribution
  totals: NbReportsTotals
}
export type ReportStatusProDistributionWithTotals = {
  distribution: ReportStatusProDistribution
  totals: NbReportsTotals
}
export type NbReportsTotals = {
  total: number
  totalWaitingResponse: number
}

export type ReportTagsDistribution = Index<number>

export interface ReportResponseReviews {
  positive: number
  negative: number
  neutral: number
}

export interface CurveStatsParams {
  ticks?: number
  tickDuration?: Period
}

export interface ReportResponseStatsParams {
  ticks?: number
  responseStatusQuery?: ReportResponseType[]
}
