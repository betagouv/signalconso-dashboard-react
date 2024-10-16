import { AuthenticateClient, FileClient, PublicConstantClient } from '.'
import { ApiClient } from './ApiClient'
import { PublicUserClient } from './user/PublicUserClient'

export class SignalConsoPublicSdk {
  constructor(private client: ApiClient) {}

  readonly user = new PublicUserClient(this.client)
  readonly constant = new PublicConstantClient(this.client)
  readonly authenticate = new AuthenticateClient(this.client)
  readonly document = new FileClient(this.client)
}
