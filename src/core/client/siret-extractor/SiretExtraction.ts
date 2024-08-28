import {CompanySearchResult} from '../company/Company'

interface Siret {
  siret: string
  valid: boolean
}

interface Siren {
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
