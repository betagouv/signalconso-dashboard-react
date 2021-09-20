import {ReportTag, Subcategory} from '../..'
import {UploadedFile} from '../..'
import {Address} from '../../model/Address'

export const ReportingDateLabel = 'Date du constat'
export const ReportingTimeslotLabel = 'Heure du constat'
export const DescriptionLabel = 'Description'

export interface Report {
  id: string
  category: string
  subcategories: Subcategory[]
  tags: ReportTag[]
  companyId: string
  companyName: string
  companyAddress: Address
  companySiret: string
  websiteURL?: string
  vendor: string
  phone?: string
  details: DetailInputValue[]
  firstName?: string
  lastName?: string
  email?: string
  employeeConsumer: boolean
  contactAgreement: boolean
  creationDate: Date
  status: ReportStatus
}

export interface DetailInputValue {
  label: string
  value: string
}

export interface ReportSearchResult {
  report: Report
  files: UploadedFile[]
}

export enum ReportStatus {
  NA = 'NA',
  EmployeeConsumer = "Lanceur d'alerte",
  InProgress = 'Traitement en cours',
  Unread = 'Signalement non consulté',
  UnreadForPro = 'Non consulté',
  Transmitted = 'Signalement transmis',
  ToReviewedByPro = 'À répondre',
  Accepted = 'Promesse action',
  ClosedForPro = 'Clôturé',
  Rejected = 'Signalement infondé',
  NotConcerned = 'Signalement mal attribué',
  Ignored = 'Signalement consulté ignoré',
}
