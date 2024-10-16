import { ApiClient } from './ApiClient'
import { PublicCompanyClient } from './company/PublicCompanyClient'

export class CompanyPublicSdk {
  constructor(private client: ApiClient) {}

  readonly company = new PublicCompanyClient(this.client)
}
