import { apiHeaders, companiesApiBaseUrl } from 'core/apiSdkInstances'
import { CompanySearchResult } from 'core/model'
import { ApiClient } from './ApiClient'

export class CompaniesApiSdk {
  private apiClient = new ApiClient({
    baseUrl: companiesApiBaseUrl,
    headers: apiHeaders,
  })

  searchCompaniesByIdentity = (identity: string, openOnly: boolean) => {
    return this.apiClient.get<CompanySearchResult[]>(
      `/companies/search/${identity}?openOnly=${openOnly}`,
      {},
    )
  }
}
