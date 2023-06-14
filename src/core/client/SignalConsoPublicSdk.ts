import {ApiClientApi} from './ApiClient'
import {AuthenticateClient, FileClient, PublicConstantClient} from '.'
import {PublicUserClient} from './user/PublicUserClient'

export class SignalConsoPublicSdk {
  constructor(private client: ApiClientApi) {}

  readonly user = new PublicUserClient(this.client)
  readonly constant = new PublicConstantClient(this.client)
  readonly authenticate = new AuthenticateClient(this.client)
  readonly document = new FileClient(this.client)
}
