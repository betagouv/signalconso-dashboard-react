import {Id, PaginatedSearch} from '../../model'
import {WebsiteKind} from '../..'

export interface WebsiteURL {
  url: string
}

export interface DraftCompany {
  siret: string
  name?: string
  brand?: string
  address?: string
  postalCode?: string
  country?: string
  website?: WebsiteURL
  activityCode?: string
}

export interface CompanyWithReportsCount {
  address: string
  name: string
  postalCode: string
  siret: string
  count: number
}


export interface Company {
  id: Id
  siret: string
  creationDate: Date
  name: string
  address: string
  postalCode?: string
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
  address: string
  postalCode?: string
  activityCode?: string
}

export interface CompanyUpdate {
  address: string
  postalCode: string
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
  readonly departments?: string[];
  identity?: string
}

export enum AccessLevel {
  NONE = 'none',
  MEMBER = 'member',
  ADMIN = 'admin',
}

export interface ViewableCompany {
  siret: string;
  postalCode?: string;
  closed: boolean;
}

export interface CompanyAccessLevel extends Company {
  level: AccessLevel;
}

export const isGovernmentCompany = (_?: DraftCompany): boolean => _?.activityCode?.startsWith('84.') ?? false;
