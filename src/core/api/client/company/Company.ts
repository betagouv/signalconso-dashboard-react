import {Id, PaginatedSearch, ReportStatus} from '../../model'
import {Index, WebsiteKind} from '../..'
import {Address} from '../../model/Address'

export interface WebsiteURL {
  url: string
}

export interface DraftCompany {
  siret: string
  name?: string
  brand?: string
  address?: Address
  website?: WebsiteURL
  activityCode?: string
}

export interface CompanyWithReportsCount extends Company {
  count: number
}

export interface Company {
  id: Id
  siret: string
  creationDate: Date
  name: string
  address: Address
  // postalCode?: string
  activityCode?: string
}

export interface CompanyToActivate {
  company: Company
  lastNotice?: Date
  tokenCreation: Date
}

export interface CompanyCreation {
  siret: string
  name: string
  address: Address
  // postalCode?: string
  activityCode?: string
}

export interface CompanyUpdate {
  address: Address
  // postalCode: string
  activationDocumentRequired: boolean
}

export interface CompanySearchResult extends DraftCompany {
  highlight: string
  activityCode: string
  activityLabel: string
  isHeadOffice: boolean
  kind?: WebsiteKind
}

export interface CompanySearch extends PaginatedSearch<any> {
  readonly departments?: string[]
  identity?: string
}

// TODO(Alex) Harmonize with company-access types
export enum AccessLevel {
  NONE = 'none',
  MEMBER = 'member',
  ADMIN = 'admin',
}

export interface CompanyWithAccessLevel extends Company {
  level: AccessLevel
}

export const isGovernmentCompany = (_?: DraftCompany): boolean => _?.activityCode?.startsWith('84.') ?? false
