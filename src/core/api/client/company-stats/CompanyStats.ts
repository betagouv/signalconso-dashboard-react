import {ReportStatus} from '../report/Report'
import {Index} from '../../helper/Utils'

export type Period = 'day' | 'week' | 'month'

export interface ReportsCountEvolution {
  date: Date
  reports: number
  responses: number
}

export type ReportStatusDistribution = { [key in ReportStatus]: number }

export type ReportTagsDistribution = Index<number>

export interface ReportResponseReviews {
  positive: number
  negative: number
}
