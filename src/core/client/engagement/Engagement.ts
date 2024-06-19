import {Id} from '../../model'
import {AcceptedDetails} from '../event/Event'
import {Report} from '../report/Report'

export interface Engagement {
  id: Id
  report: Report
  expirationDate: Date
  engagement: AcceptedDetails
  otherEngagement?: string
  resolutionDate?: Date
}

export const EngagementReminderPeriod = 21 as const
