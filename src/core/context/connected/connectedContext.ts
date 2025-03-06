import { LoginManagementResult } from 'core/context/loginManagement/loginManagementContext'
import React, { useContext } from 'react'
import { ConnectedApiSdk } from '../../apiSdkInstances'
import { User } from '../../client/user/User'

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
  api: ConnectedApiSdk
}

export const connectedContext = React.createContext<ConnectedContext>(
  {} as ConnectedContext,
)

export const useConnectedContext = (): ConnectedContext => {
  return useContext(connectedContext)
}
