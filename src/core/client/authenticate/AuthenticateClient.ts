import {UserWithPermission} from './Authenticate'
import {ApiClientApi} from '../ApiClient'
import {Id} from '../../model'

export class AuthenticateClient {
  constructor(private client: ApiClientApi) {}

  readonly login = (login: string, password: string) => {
    return this.client.post<UserWithPermission>(`/authenticate`, {body: {login, password}, withCredentials: true})
  }
  readonly logout = () => {
    return this.client.post<void>(`/logout`, {withCredentials: true})
  }
  readonly getUser = () => {
    return this.client.get<UserWithPermission>(`/current-user`, {withCredentials: true})
  }

  readonly forgotPassword = (login: string): Promise<void> => {
    return this.client.post<void>(`/authenticate/password/forgot`, {body: {login}})
  }

  readonly sendActivationLink = (siret: string, token: string, email: string) => {
    return this.client.post<void>(`/accesses/${siret}/send-activation-link`, {body: {token, email}})
  }

  readonly validateEmail = (token: Id) => {
    return this.client.post<UserWithPermission>(`/account/validate-email`, {body: {token}, withCredentials: true})
  }

  readonly resetPassword = (password: string, token: string) => {
    return this.client.post<void>(`/authenticate/password/reset`, {body: {password}, qs: {token}})
  }
}
