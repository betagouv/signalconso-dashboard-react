import {ReportStatus, ReportTag} from './Report'
import {Id, ReportResponseTypes, ResponseEvaluation} from '../../model'

export interface ReportSearch {
  departments?: string[]
  withTags?: ReportTag[]
  withoutTags?: ReportTag[]
  companyCountries?: string[]
  siretSirenList?: string[]
  activityCodes?: string[]
  status?: ReportStatus[]
  companyIds?: Id[]
  start?: Date
  end?: Date
  email?: string
  websiteURL?: string
  phone?: string
  category?: string
  details?: string
  description?: string
  contactAgreement?: boolean
  hasPhone?: boolean
  hasWebsite?: boolean
  hasForeignCountry?: boolean
  hasCompany?: boolean
  hasAttachment?: boolean
  hasEvaluation?: boolean
  evaluation?: ResponseEvaluation[]
  fullText?: String
}
