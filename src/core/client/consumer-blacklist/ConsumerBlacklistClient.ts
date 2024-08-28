import { ApiClientApi } from '../ApiClient'
import {
  ConsumerBlacklistedEmail,
  ConsumerBlacklistedEmailRawFromApi,
} from './ConsumerBlacklistedEmail'

export class ConsumerBlacklistClient {
  constructor(private client: ApiClientApi) {}

  readonly list = async (): Promise<ConsumerBlacklistedEmail[]> => {
    const res = await this.client.get<ConsumerBlacklistedEmailRawFromApi[]>(
      '/blacklisted-emails',
    )
    return res.map((_) => ({
      ..._,
      creationDate: new Date(_.creationDate),
    }))
  }

  readonly add = (email: string, comments: string) => {
    return this.client.post<void>(`/blacklisted-emails`, {
      body: { email, comments },
    })
  }

  readonly delete = (id: string) => {
    return this.client.delete<void>(`/blacklisted-emails/${id}`)
  }
}
