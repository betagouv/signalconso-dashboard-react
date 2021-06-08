import {ApiClientApi} from '../../index'
import {AuthUser} from './User'

export class AuthenticateClient {

  constructor(private client: ApiClientApi) {
  }

  readonly login = (login: string, password: string) => {
    return this.client.post<AuthUser>(`/authenticate`, {body: {login, password}})
  }
}
