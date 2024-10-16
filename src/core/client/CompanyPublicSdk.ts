import { CompanySearchResult } from 'core/model'
import { ApiClient } from './ApiClient'

export class CompanyPublicSdk {
  constructor(private apiClient: ApiClient) {}

  searchCompaniesByIdentity = (identity: string, openOnly: boolean) => {
    return this.apiClient.get<CompanySearchResult[]>(
      `/companies/search/${identity}?openOnly=${openOnly}`,
      {},
    )
  }
}
