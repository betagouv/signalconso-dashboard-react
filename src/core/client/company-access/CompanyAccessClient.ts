import { Id } from '../../model'
import { ApiClient } from '../ApiClient'
import {
  CompanyAccess,
  CompanyAccessLevel,
  CompanyAccessMostActive,
} from './CompanyAccess'
import { VisibleUser } from './VisibleUser'

export class CompanyAccessClient {
  constructor(private client: ApiClient) {}

  readonly fetch = (siret: string) => {
    return this.client.get<CompanyAccess[]>(`/accesses/${siret}`)
  }

  readonly count = (siret: string) => {
    return this.client.get<number>(`/accesses/${siret}/count`)
  }

  readonly update = (
    siret: string,
    userId: string,
    level: CompanyAccessLevel,
  ) => {
    return this.client
      .put<CompanyAccess>(`/accesses/${siret}/${userId}`, { body: { level } })
      .then((_) => ({ ..._, level: level }))
  }

  readonly remove = (siret: string, userId: Id) => {
    return this.client.delete<void>(`/accesses/${siret}/${userId}`)
  }

  readonly visibleUsersToPro = () => {
    return this.client.get<VisibleUser[]>(`/accesses/visible-users`)
  }

  readonly inviteProToCompanies = (email: string) => {
    return this.client.post<string>(`/accesses/visible-users/${email}`)
  }

  readonly revokeProFromCompanies = (userId: Id) => {
    return this.client.delete<string>(`/accesses/visible-users/${userId}`)
  }

  readonly getMostActives = (siret: string) => {
    return this.client.get<CompanyAccessMostActive[]>(
      `/accesses/${siret}/most-active`,
    )
  }
}
