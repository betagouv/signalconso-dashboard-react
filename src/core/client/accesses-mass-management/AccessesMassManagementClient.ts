import { ApiClient } from '../ApiClient'
import { ProCompanies } from '../company/Company'

export class AccessesMassManagementClient {
  constructor(private client: ApiClient) {}

  readonly getCompaniesOfPro = () => {
    return this.client.get<ProCompanies>(`/accesses-mass-management/companies`)
  }
}
