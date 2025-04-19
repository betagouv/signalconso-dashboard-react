import { ApiClient } from '../ApiClient'
import { ProCompanies } from '../company/Company'
import { AccessesMassManagementUsers } from './accessesMassManagement'
export class AccessesMassManagementClient {
  constructor(private client: ApiClient) {}

  readonly getCompaniesOfPro = () => {
    return this.client.get<ProCompanies>(`/accesses-mass-management/companies`)
  }

  readonly getUsersOfPro = () => {
    return this.client.get<AccessesMassManagementUsers>(
      `/accesses-mass-management/users`,
    )
  }
}
