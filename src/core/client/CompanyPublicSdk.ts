import {ApiClientApi} from './ApiClient'
import {AuthenticateClient, FileClient, PublicConstantClient} from '.'
import {PublicCompanyClient} from './company/PublicCompanyClient'
import {PublicUserClient} from './user/PublicUserClient'
import {PublicReportClient} from './report/PublicReportClient'

export class CompanyPublicSdk {
  constructor(private client: ApiClientApi) {}

  readonly company = new PublicCompanyClient(this.client)
}
