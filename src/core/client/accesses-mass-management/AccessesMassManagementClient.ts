import { ApiClient } from '../ApiClient'
import { ProCompanies } from '../company/Company'
import { User } from '../user/User'

export class AccessesMassManagementClient {
  constructor(private client: ApiClient) {}

  readonly getCompaniesOfPro = () => {
    return this.client.get<ProCompanies>(`/accesses-mass-management/companies`)
  }

  readonly getUsersOfPro = () => {
    return this.client.get<User[]>(`/accesses-mass-management/users`)
  }
}
