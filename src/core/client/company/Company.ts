import { Address, Id, PaginatedFilters } from '../../model'

export interface CompanyWithReportsCount extends Company {
  count: number
  responseRate: number
  albertActivityLabel?: string
}

export interface Company {
  id: Id
  siret: string
  creationDate: Date
  name: string
  commercialName?: string
  establishmentCommercialName?: string
  brand?: string
  address: Address
  isHeadOffice: boolean
  isOpen: boolean
  isPublic: boolean
  activityCode?: string
}

export interface CompanyToActivate {
  company: Company
  lastNotice?: Date
  tokenCreation: Date
}

export interface CompanyToFollowUp {
  company: Company
  ignoredReportCount: number
}

export interface CompanyCreation {
  siret: string
  name: string
  address: Address
  isHeadOffice: boolean
  isOpen: boolean
  isPublic: boolean
  activityCode?: string
}

export interface CompaniesToImport {
  siren?: string
  sirets: string[]
  emails: string[]
  onlyHeadOffice: boolean
  level: AccessLevel
}

export interface CompanyUpdate {
  address: Address
  // postalCode: string
  activationDocumentRequired: boolean
}

export interface CompanySearchResult {
  siret: string
  name?: string
  commercialName?: string
  establishmentCommercialName?: string
  brand?: string
  isHeadOffice: boolean
  isOpen: boolean
  isPublic: boolean
  address: Address
  activityCode: string
  activityLabel?: string
  isMarketPlace: boolean
}

export interface CompanySearch extends PaginatedFilters {
  readonly departments?: string[]
  readonly activityCodes?: string[]
  emailsWithAccess?: string
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

export type CompanyWithAccessAndCounts = {
  company: Company
  access: {
    level: AccessLevel
    kind: 'Direct' | 'Inherited' | 'InheritedAdminAndDirectMember'
  }
  reportsCount: number
  ongoingReportsCount: number
  directAccessesCount: number | undefined // undefined if your own access level isn't admin
}

export type ProCompaniesExtended = {
  headOfficesAndSubsidiaries: {
    headOffice: CompanyWithAccessAndCounts
    subsidiaries: CompanyWithAccessAndCounts[]
  }[]
  loneSubsidiaries: CompanyWithAccessAndCounts[]
}

export function flattenProCompaniesExtended(
  companies: ProCompaniesExtended,
): CompanyWithAccessAndCounts[] {
  return [
    ...companies.headOfficesAndSubsidiaries.flatMap(
      ({ headOffice, subsidiaries }) => [headOffice, ...subsidiaries],
    ),
    ...companies.loneSubsidiaries,
  ]
}

export type CompanyHosts = {
  host: string
  nbOccurences: number
}[]

export type CompanyPhones = {
  phone: string
  nbOccurences: number
}[]
