import {ReportStatus} from '../report/Report'
import {Index} from '../../helper/Utils'

export type ReportsCountEvolutionPeriod = 'day' | 'week' | 'month'

export type ReportsCountEvolution = [Date, number][]

export type ReportStatusDistribution = { [key in ReportStatus]: number }

export type ReportTagsDistribution = Index<number>

export interface ReportResponseReviews {
  positive: number
  negative: number
}
