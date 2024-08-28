import { ApiClientApi } from './ApiClient'
import { PublicCompanyClient } from './company/PublicCompanyClient'

export class CompanyPublicSdk {
  constructor(private client: ApiClientApi) {}

  readonly company = new PublicCompanyClient(this.client)
}
