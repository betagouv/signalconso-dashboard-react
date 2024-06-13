import {AcceptedDetails} from '../event/Event'
import {Report} from '../report/Report'
import {Id} from '../../model'

export interface Engagement {
  id: Id
  report: Report
  expirationDate: Date
  engagement: AcceptedDetails
  otherEngagement?: string
  resolutionDate?: Date
}

export const EngagementReminderPeriod = 21 as const
