import React, {Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from 'react'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {Roles, UserWithPermission} from '../client/authenticate/Authenticate'

const LoginContext = React.createContext({} as any)

interface LoginProviderProps {
  apiSdk: SignalConsoApiSdk
  connectedUser: UserWithPermission
  onLogout: () => void
  setConnectedUser: (_: UserWithPermission) => void
  children: ReactNode
}

interface UseLoginProps {
  connectedUser: UserWithPermission & {isDGCCRF: boolean; isDGAL: boolean; isPro: boolean; isNotPro: boolean; isAdmin: boolean}
  setConnectedUser: Dispatch<SetStateAction<UserWithPermission>>
  logout: () => void
  apiSdk: SignalConsoApiSdk
}

export const LoginProvider = ({
  apiSdk,
  connectedUser: _connectedUser,
  setConnectedUser: _setConnectedUser,
  onLogout,
  children,
}: LoginProviderProps) => {
  const [connectedUser, setConnectedUser] = useState<UserWithPermission>(_connectedUser)

  useEffect(() => {
    setConnectedUser(_connectedUser)
  }, [_connectedUser])

  useEffect(() => {
    _setConnectedUser(connectedUser)
  }, [connectedUser])

  return (
    <LoginContext.Provider
      value={{
        setConnectedUser,
        connectedUser: {
          ...connectedUser,
          isDGCCRF: connectedUser.role === Roles.DGCCRF,
          isDGAL: connectedUser.role === Roles.DGAL,
          isPro: connectedUser.role === Roles.Pro,
          isNotPro: connectedUser.role !== Roles.Pro,
          isAdmin: connectedUser.role === Roles.Admin,
        },
        logout: onLogout,
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
