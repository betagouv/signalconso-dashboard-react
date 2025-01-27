import { CompanySearchResult } from '../company/Company'

interface Siret {
  siret: string
  valid: boolean
}

interface Siren {
  siren: string
  valid: boolean
}

export interface SiretExtraction {
  siret?: Siret
  siren?: Siren
  links: string[]
  sirene?: CompanySearchResult
}

export interface ExtractionResult {
  website: string
  status: 'success' | 'failure'
  extractions?: SiretExtraction[]
  error?: string
}
