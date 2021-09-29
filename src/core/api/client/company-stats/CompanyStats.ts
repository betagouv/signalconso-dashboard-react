import {ReportStatus} from '../report/Report'
import {Index} from '../../helper/Utils'

export type Period = 'day' | 'month'

export interface CountByDate {
  date: Date
  count: number
}

export type ReportStatusDistribution = { [key in ReportStatus]: number }

export type ReportTagsDistribution = Index<number>

export interface ReportResponseReviews {
  positive: number
  negative: number
}
