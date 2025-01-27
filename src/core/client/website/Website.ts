import {
  Address,
  CompanyCreation,
  Entity,
  Id,
  PaginatedFilters,
} from '../../model'
import { Company } from '../company/Company'
import { Country } from '../constant/Country'
import { ExtractionResult } from '../siret-extractor/SiretExtraction'

export enum IdentificationStatus {
  Identified = 'Identified',
  NotIdentified = 'NotIdentified',
}

export enum InvestigationStatus {
  NotProcessed = 'NotProcessed',
  SignalConsoIdentificationFailed = 'SignalConsoIdentificationFailed',
  Processing = 'Processing',
}

export interface WebsiteInvestigation {
  investigationStatus?: InvestigationStatus
  identificationStatus?: IdentificationStatus
  attribution?: string
  lastUpdated?: Date
  creationDate: Date
  id: Id
}

export interface Website extends Entity {
  creationDate: Date
  host: string
  companyId: Id
  identificationStatus: IdentificationStatus
  investigationStatus?: InvestigationStatus
  attribution?: string
  lastUpdated?: Date
  isMarketplace: boolean
}

export interface WebsiteUpdateCompany {
  siret: string
  name?: string
  address?: Address
  activityCode?: string
  isHeadOffice: boolean
  isOpen: boolean
  isPublic: boolean
}

export interface WebsiteWithCompany extends Website {
  company?: Company
  companyCountry?: Country
}

export interface WebsiteWithCompanyAndCount extends WebsiteWithCompany {
  count: number
  siretExtraction?: ExtractionResult
}

export interface ApiHostWithReportCount {
  host: string
  count: number
}

export interface WebsiteWithCompanySearch extends PaginatedFilters {
  host?: string
  isOpen: boolean | null
  identificationStatus?: IdentificationStatus[]
  investigationStatus?: InvestigationStatus[]
  start?: Date
  end?: Date
  isMarketplace: boolean | null
}

export interface HostReportCountSearch extends PaginatedFilters {
  q?: string
  start?: Date
  end?: Date
}

export interface WebsiteCreation {
  host: string
  company: CompanyCreation
}
