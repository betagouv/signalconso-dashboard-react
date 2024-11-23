import { ApiClient } from '../ApiClient'

export class AccessesClient {
  constructor(private client: ApiClient) {}

  readonly acceptToken = (siret: string, token: string) => {
    return this.client.post<void>(`/accesses/${siret}/token/accept`, {
      body: { token },
    })
  }
}
