import { MassManagementUsers } from 'feature/Users/usersProMassManage/usersProMassManagementConstants'
import { ApiClient } from '../ApiClient'
import { ProCompanies } from '../company/Company'

export class AccessesMassManagementClient {
  constructor(private client: ApiClient) {}

  readonly getCompaniesOfPro = () => {
    return this.client.get<ProCompanies>(`/accesses-mass-management/companies`)
  }

  readonly getUsersOfPro = () => {
    return this.client.get<MassManagementUsers>(
      `/accesses-mass-management/users`,
    )
  }
}
