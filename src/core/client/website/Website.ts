import {Entity, Id, PaginatedFilters} from '../../model'
import {Company} from '../company/Company'
import {Address} from '../../model'
import {Country} from '../constant/Country'

export enum IdentificationStatus {
  Identified = 'Identified',
  NotIdentified = 'NotIdentified',
}

export interface DepartmentDivision {
  code: string
  name: string
}

export interface WebsiteInvestigation {
  practice?: string
  investigationStatus?: string
  attribution?: string
  lastUpdated?: Date
  id: Id
}

export interface Website extends Entity {
  creationDate: Date
  host: string
  companyId: Id
  identificationStatus: IdentificationStatus
  practice?: string
  investigationStatus?: string
  attribution?: string
  lastUpdated?: Date
}

export interface WebsiteUpdateCompany {
  siret: string
  name?: string
  address?: Address
  activityCode?: string
}

export interface WebsiteWithCompany extends Website {
  company?: Company
  companyCountry?: Country
  count?: 0
}

export interface ApiHostWithReportCount {
  host: string
  count: number
}

export interface WebsiteWithCompanySearch extends PaginatedFilters {
  host?: string
  identificationStatus?: IdentificationStatus[]
}

export interface HostReportCountSearch extends PaginatedFilters {
  q?: string
  start?: Date
  end?: Date
}
