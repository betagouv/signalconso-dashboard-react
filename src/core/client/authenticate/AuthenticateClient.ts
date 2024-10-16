import { Id, User } from '../../model'
import { ApiClient } from '../ApiClient'

export class AuthenticateClient {
  constructor(private client: ApiClient) {}

  readonly login = (login: string, password: string) => {
    return this.client.post<User>(`/authenticate`, {
      body: { login, password },
      withCredentials: true,
    })
  }

  readonly logAs = (userEmail: string) => {
    return this.client.post<User>(`/log-as`, {
      body: { email: userEmail },
      withCredentials: true,
    })
  }

  readonly logout = () => {
    return this.client.post<User | undefined>(`/logout`, {
      withCredentials: true,
    })
  }

  readonly getUser = () => {
    return this.client.get<User>(`/current-user`, {
      withCredentials: true,
    })
  }

  readonly forgotPassword = (login: string): Promise<void> => {
    return this.client.post<void>(`/authenticate/password/forgot`, {
      body: { login },
    })
  }

  readonly sendActivationLink = (
    siret: string,
    token: string,
    email: string,
  ) => {
    return this.client.post<void>(`/accesses/${siret}/send-activation-link`, {
      body: { token, email },
    })
  }

  readonly validateEmail = (token: Id) => {
    return this.client.post<User>(`/account/validate-email`, {
      body: { token },
      withCredentials: true,
    })
  }

  readonly resetPassword = (password: string, token: string) => {
    return this.client.post<void>(`/authenticate/password/reset`, {
      body: { password },
      qs: { token },
    })
  }
}
