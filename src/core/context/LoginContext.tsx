import React, {ReactNode, useContext} from 'react'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {Roles, UserWithPermission} from '@signal-conso/signalconso-api-sdk-js'

const LoginContext = React.createContext({} as any)

interface LoginProviderProps {
  apiSdk: SignalConsoApiSdk
  token: string
  connectedUser: UserWithPermission
  onLogout: () => void
  children: ReactNode
}

interface UseLoginProps {
  connectedUser: UserWithPermission & {isDGCCRF: boolean; isPro: boolean; isAdmin: boolean}
  logout: () => void
  apiSdk: SignalConsoApiSdk
  token: string
}

export const LoginProvider = ({apiSdk, token, connectedUser, onLogout, children}: LoginProviderProps) => {
  return (
    <LoginContext.Provider
      value={{
        connectedUser: {
          ...connectedUser,
          isDGCCRF: connectedUser.role === Roles.DGCCRF,
          isPro: connectedUser.role === Roles.Pro,
          isAdmin: connectedUser.role === Roles.Admin,
        },
        logout: onLogout,
        token,
        apiSdk,
      }}
    >
      {children}
    </LoginContext.Provider>
  )
}

export const useLogin = (): UseLoginProps => {
  return useContext(LoginContext)
}
