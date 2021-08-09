import {CompanyAccess, CompanyAccessLevel} from './CompanyAccess'
import {ApiClientApi, Id} from '../..'

export class CompanyAccessClient {
  constructor(private client: ApiClientApi) {}

  readonly fetch = (siret: string) => {
    return this.client.get<CompanyAccess[]>(`/accesses/${siret}`)
  }

  readonly update = (siret: string, userId: string, level: CompanyAccessLevel) => {
    return this.client.put<CompanyAccess>(`/accesses/${siret}/${userId}`, {body: {level}}).then(_ => ({..._, level: level}))
  }

  readonly remove = (siret: string, userId: Id) => {
    return this.client.delete<void>(`/accesses/${siret}/${userId}`)
  }
}
