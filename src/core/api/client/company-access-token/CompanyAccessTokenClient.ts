import {ApiClientApi, CompanyAccessLevel} from '../..'
import {CompanyAccessToken} from './CompanyAccessToken'

export class CompanyAccessTokenClient {

  constructor(private client: ApiClientApi) {
  }

  readonly fetch = (siret: string) => {
    return this.client.get<CompanyAccessToken[]>(`accesses/${siret}/pending`)
  }

  readonly remove = (siret: string, tokenId: string) => {
    return this.client.delete(`accesses/${siret}/token/${tokenId}`)
  }

  readonly create = (siret: string, email: string, level: CompanyAccessLevel) => {
    return this.client.post(`api/accesses/${siret}/invitation`, {body: {email, level}})
  }
}
