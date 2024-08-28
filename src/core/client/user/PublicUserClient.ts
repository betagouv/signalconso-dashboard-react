import { UserToActivate } from './User'
import { ApiClientApi } from '../ApiClient'
import { TokenInfo, UserWithPermission } from '../authenticate/Authenticate'

export class PublicUserClient {
  constructor(private client: ApiClientApi) {}

  readonly activateAccount = (
    user: UserToActivate,
    token: string,
    companySiret?: string,
  ) => {
    return this.client.post<UserWithPermission>(`/account/activation`, {
      body: {
        draftUser: user,
        token: token,
        ...(companySiret ? { companySiret } : {}),
      },
      withCredentials: true,
    })
  }

  readonly fetchTokenInfo = (
    token: string,
    companySiret?: string,
  ): Promise<TokenInfo> => {
    if (companySiret) {
      return this.client.get<TokenInfo>(`/accesses/${companySiret}/token`, {
        qs: {
          token: token,
        },
      })
    } else {
      return this.client.get<TokenInfo>(`/account/token`, {
        qs: {
          token: token,
        },
      })
    }
  }
}
