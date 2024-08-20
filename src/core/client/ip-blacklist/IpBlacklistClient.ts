import {ApiClientApi} from '../ApiClient'
import {BlacklistedIp} from './BlacklistedIp'

export class IpBlacklistClient {
  constructor(private client: ApiClientApi) {}

  readonly list = async (): Promise<BlacklistedIp[]> => {
    return this.client.get<BlacklistedIp[]>('/blacklisted-ips')
  }

  readonly add = (ip: string, comment: string, critical: boolean) => {
    return this.client.post<void>(`/blacklisted-ips`, {body: {ip, comment, critical}})
  }

  readonly delete = (id: string) => {
    return this.client.delete<void>(`/blacklisted-ips/${id}`)
  }
}
