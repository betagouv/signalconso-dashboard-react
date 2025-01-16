import { PaginatedSearch } from '../../model'

export interface ReportedPhone {
  phone: string
  count: number
  siret?: string
  companyName?: string
}

export interface ReportedPhoneFilters {
  phone?: string
  start?: Date
  end?: Date
}

export interface ReportedPhoneSearch
  extends PaginatedSearch<ReportedPhone>,
    ReportedPhoneFilters {}
