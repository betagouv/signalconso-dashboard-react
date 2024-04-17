import React, {Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from 'react'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {Roles, UserWithPermission} from '../client/authenticate/Authenticate'

type ConnectedContext = {
  connectedUser: UserWithPermission & {isDGCCRF: boolean; isDGAL: boolean; isPro: boolean; isNotPro: boolean; isAdmin: boolean}
  setConnectedUser: Dispatch<SetStateAction<UserWithPermission>>
  logout: () => void
  apiSdk: SignalConsoApiSdk
}

const connectedContext = React.createContext<ConnectedContext>({} as ConnectedContext)

export const ConnectedContextProvider = ({
  apiSdk,
  connectedUser: _connectedUser,
  setConnectedUser: _setConnectedUser,
  onLogout,
  children,
}: {
  apiSdk: SignalConsoApiSdk
  connectedUser: UserWithPermission
  onLogout: () => void
  setConnectedUser: (_: UserWithPermission) => void
  children: ReactNode
}) => {
  const [connectedUser, setConnectedUser] = useState<UserWithPermission>(_connectedUser)

  useEffect(() => {
    setConnectedUser(_connectedUser)
  }, [_connectedUser])

  useEffect(() => {
    _setConnectedUser(connectedUser)
  }, [connectedUser])

  return (
    <connectedContext.Provider
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
    </connectedContext.Provider>
  )
}

export const useConnectedContext = (): ConnectedContext => {
  return useContext(connectedContext)
}
