import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher, usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {ApiDetailedError, ApiError, User, UserSearch} from 'core/api'
import {SignalConsoApiSdk} from '../ApiSdkInstance'

export interface UsersContextProps {
  dgccrf: UsePaginate<User, UserSearch>
  dgccrfPending: UseFetcher<SignalConsoApiSdk['secured']['user']['fetchPendingDGCCRF'], ApiError>
  invite: UseFetcher<SignalConsoApiSdk['secured']['user']['inviteDGCCRF'], ApiDetailedError>
  changePassword: UseFetcher<SignalConsoApiSdk['secured']['user']['changePassword'], ApiError>
  activate: UseFetcher<SignalConsoApiSdk['public']['user']['activateAccount'], ApiError>
  fetchTokenInfo: UseFetcher<SignalConsoApiSdk['public']['user']['fetchTokenInfo'], ApiError>
  getConnectedUser: UseFetcher<SignalConsoApiSdk['secured']['user']['fetchConnectedUser']>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<UsersContextProps> = {}

const UsersContext = React.createContext<UsersContextProps>(defaultContext as UsersContextProps)

export const UsersProvider = ({api, children}: Props) => {
  const dgccrf = usePaginate<User, UserSearch, ApiError>(api.secured.user.fetchDGCCRF, {limit: 10, offset: 0})
  const changePassword = useFetcher(api.secured.user.changePassword)
  const activate = useFetcher(api.public.user.activateAccount)
  const dgccrfPending = useFetcher(api.secured.user.fetchPendingDGCCRF)
  const invite = useFetcher(api.secured.user.inviteDGCCRF)
  const fetchTokenInfo = useFetcher(api.public.user.fetchTokenInfo)
  const getConnectedUser = useFetcher(api.secured.user.fetchConnectedUser)

  return (
    <UsersContext.Provider
      value={{
        dgccrf,
        dgccrfPending,
        invite,
        changePassword,
        activate,
        fetchTokenInfo,
        getConnectedUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

export const useUsersContext = (): UsersContextProps => {
  return useContext<UsersContextProps>(UsersContext)
}
