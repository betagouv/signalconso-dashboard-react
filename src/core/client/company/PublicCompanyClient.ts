import {CompanySearchResult} from './Company'
import {ApiClientApi} from '../ApiClient'

export class PublicCompanyClient {
  constructor(private client: ApiClientApi) {}

  readonly searchCompaniesByIdentity = (identity: string, openOnly: boolean) => {
    return this.client.get<CompanySearchResult[]>(`/companies/search/${identity}?openOnly=${openOnly}`, {})
  }
}
