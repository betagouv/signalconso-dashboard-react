import { LoginManagementResult } from 'core/useLoginManagement'
import React, { ReactNode, useContext } from 'react'
import { ConnectedApiSdk } from '../ApiSdkInstance'
import { User } from '../client/user/User'

export type ConnectedContext = {
  connectedUser: User & {
    isDGCCRF: boolean
    isDGAL: boolean
    isPro: boolean
    isNotPro: boolean
    isAdmin: boolean
    isSuperAdmin: boolean
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
  connectedUser: User
  setConnectedUser: LoginManagementResult['setConnectedUser']
  children: ReactNode
}) => {
  return (
    <connectedContext.Provider
      value={{
        setConnectedUser,
        connectedUser: {
          ...connectedUser,
          isDGCCRF: connectedUser.role === 'DGCCRF',
          isDGAL: connectedUser.role === 'DGAL',
          isPro: connectedUser.role === 'Professionnel',
          isNotPro: connectedUser.role !== 'Professionnel',
          isAdmin:
            connectedUser.role === 'SuperAdmin' ||
            connectedUser.role === 'Admin' ||
            connectedUser.role === 'ReadOnlyAdmin',
          isSuperAdmin: connectedUser.role === 'SuperAdmin',
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
