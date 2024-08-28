import { Id, ResponseEvaluation } from '../../model'
import { ReportStatus, ReportTag } from './Report'

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
  subcategories?: string[]
  details?: string
  description?: string
  contactAgreement?: boolean
  hasPhone?: boolean
  hasWebsite?: boolean
  hasForeignCountry?: boolean
  hasCompany?: boolean
  hasAttachment?: boolean
  hasResponseEvaluation?: boolean
  responseEvaluation?: ResponseEvaluation[]
  hasEngagementEvaluation?: boolean
  engagementEvaluation?: ResponseEvaluation[]
  fullText?: String
  isForeign?: boolean
  hasBarcode?: boolean
}
