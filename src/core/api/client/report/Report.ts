import {Subcategory, ReportTag} from '../anomaly/Anomaly'
import {UploadedFile} from '../file/UploadedFile'

export const ReportingDateLabel = 'Date du constat';
export const ReportingTimeslotLabel = 'Heure du constat';
export const DescriptionLabel = 'Description';

export interface Report {
  id: string
  category: string
  subcategories: Subcategory[]
  tags: ReportTag[]
  companyId: string
  companyName: string
  companyAddress: string
  companyPostalCode: string
  companyCountry: string
  companySiret: string
  websiteURL?: string
  vendor: string
  phone?: string
  details: DetailInputValue[]
  firstName: string
  lastName: string
  email: string
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
  EmployeeConsumer = 'Lanceur d\'alerte',
  InProgress = 'Traitement en cours',
  Unread = 'Signalement non consulté',
  UnreadForPro = 'Non consulté',
  Transmitted = 'Signalement transmis',
  ToReviewedByPro = 'À répondre',
  Accepted = 'Promesse action',
  ClosedForPro = 'Clôturé',
  Rejected = 'Signalement infondé',
  Ignored = 'Signalement consulté ignoré',
  NotConcerned = 'Signalement mal attribué'
}

