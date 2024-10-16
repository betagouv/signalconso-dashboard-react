import { ApiClient } from '../ApiClient'
import { CompanySearchResult } from './Company'

export class PublicCompanyClient {
  constructor(private client: ApiClient) {}

  readonly searchCompaniesByIdentity = (
    identity: string,
    openOnly: boolean,
  ) => {
    return this.client.get<CompanySearchResult[]>(
      `/companies/search/${identity}?openOnly=${openOnly}`,
      {},
    )
  }
}
