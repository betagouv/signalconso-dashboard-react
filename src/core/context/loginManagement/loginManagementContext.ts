import React, { useContext } from 'react'
import { User } from '../../client/user/User'

export type MaybeUser = User | undefined
export type LoginManagementResult = {
  connectedUser?: User
  logout: () => void
  handleDetectedLogout: () => void
  login: {
    action: (login: string, password: string) => Promise<User>
    loading?: boolean
    // this is not used, in the LoginForm we do our own error handling
    errorMsg?: unknown
  }
  loginProConnect: {
    action: (authorizationCode: string, state: string) => Promise<User>
    loading?: boolean
    errorMsg?: unknown
  }
  startProConnect: {
    action: (state: string, nonce: string) => Promise<void>
    loading?: boolean
    errorMsg?: unknown
  }
  register: {
    action: (siret: string, token: string, email: string) => Promise<void>
    loading?: boolean
    errorMsg?: unknown
  }
  setConnectedUser: (
    user: MaybeUser | ((previous: MaybeUser) => MaybeUser),
  ) => void
  isAuthenticated: () => boolean
}

export const LoginManagementContext =
  React.createContext<LoginManagementResult>({} as LoginManagementResult)

export const useLoginManagement = (): LoginManagementResult => {
  return useContext(LoginManagementContext)
}
