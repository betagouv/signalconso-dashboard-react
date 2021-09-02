import {ApiClientApi, Id} from '../..'
import {AuthUser} from './UserWithPermission'

export class AuthenticateClient {
  constructor(private client: ApiClientApi) {}

  readonly login = (login: string, password: string) => {
    return this.client.post<AuthUser>(`/authenticate`, {body: {login, password}})
  }

  readonly forgotPassword = (login: string) => {
    return this.client.post<void>(`/authenticate/password/forgot`, {body: {login}})
  }

  readonly sendActivationLink = (siret: string, token: string, email: string) => {
    return this.client.post<void>(`/accesses/${siret}/send-activation-link`, {body: {token, email}})
  }

  readonly validateEmail = (token: Id) => {
    return this.client.post<AuthUser>(`/account/validate-email`, {body: {token}})
  }

  readonly resetPassword = (password: string, token: string) => {
    return this.client.post<void>(`/authenticate/password/reset`, {body: {password}, qs: {token}})
  }
}
