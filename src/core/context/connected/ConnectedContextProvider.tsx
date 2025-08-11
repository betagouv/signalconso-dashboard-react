import { LoginManagementResult } from 'core/context/loginManagement/loginManagementContext'
import { ReactNode } from 'react'
import { ConnectedApiSdk } from '../../apiSdkInstances'
import { User } from '../../client/user/User'
import { connectedContext } from './connectedContext'
export const ConnectedContextProvider = ({
  api,
  connectedUser,
  setConnectedUser,
  children,
}: {
  api: ConnectedApiSdk
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
          isSSMVM: connectedUser.role === 'SSMVM',
          isPro: connectedUser.role === 'Professionnel',
          isNotPro: connectedUser.role !== 'Professionnel',
          isAdmin:
            connectedUser.role === 'SuperAdmin' ||
            connectedUser.role === 'Admin' ||
            connectedUser.role === 'ReadOnlyAdmin',
          isSuperAdmin: connectedUser.role === 'SuperAdmin',
        },

        api,
      }}
    >
      {children}
    </connectedContext.Provider>
  )
}
