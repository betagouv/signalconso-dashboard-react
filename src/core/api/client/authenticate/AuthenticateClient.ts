import {ApiClientApi} from '../..'
import {AuthUser} from './UserWithPermission'

export class AuthenticateClient {

  constructor(private client: ApiClientApi) {
  }

  readonly login = (login: string, password: string) => {
    return this.client.post<AuthUser>(`/authenticate`, {body: {login, password}})
  }
}
