import {CompanySearchResult} from '../company/Company'

export interface Siret {
  siret: string
  valid: boolean
}

export interface Siren {
  siren: string
  valid: boolean
}

export interface SiretExtraction {
  website: string
  siret?: Siret
  siren?: Siren
  links: string[]
  sirene?: CompanySearchResult
}

export interface ExtractionResult {
  status: 'success' | 'failure'
  extractions?: SiretExtraction[]
  error?: string
}
