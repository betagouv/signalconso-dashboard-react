import {CompanySearchResult} from './Company'
import {ApiClientApi} from '../ApiClient'

export class PublicCompanyClient {
  constructor(private client: ApiClientApi) {}

  readonly searchCompaniesByIdentity = (identity: string) => {
    return this.client.get<CompanySearchResult[]>(`/companies/search/${identity}`, {})
    // .then(companies => companies.filter(_ => _.postalCode));
  }
}
