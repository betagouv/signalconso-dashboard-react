import { LoginManagementResult } from 'core/useLoginManagement'
import React, { ReactNode, useContext } from 'react'
import { ConnectedApiSdk } from '../ApiSdkInstance'
import { Roles, UserWithPermission } from '../client/authenticate/Authenticate'

export type ConnectedContext = {
  connectedUser: UserWithPermission & {
    isDGCCRF: boolean
    isDGAL: boolean
    isPro: boolean
    isNotPro: boolean
    isAdmin: boolean
  }
  setConnectedUser: LoginManagementResult['setConnectedUser']
  apiSdk: ConnectedApiSdk
}

const connectedContext = React.createContext<ConnectedContext>(
  {} as ConnectedContext,
)

export const ConnectedContextProvider = ({
  apiSdk,
  connectedUser,
  setConnectedUser,
  children,
}: {
  apiSdk: ConnectedApiSdk
  connectedUser: UserWithPermission
  setConnectedUser: LoginManagementResult['setConnectedUser']
  children: ReactNode
}) => {
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
