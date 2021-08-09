import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher, usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {ApiError, User, UserSearch} from 'core/api'
import {SignalConsoApiSdk} from '../../App'

export interface UsersContextProps {
  dgccrf: UsePaginate<User, UserSearch>
  dgccrfPending: UseFetcher<SignalConsoApiSdk['secured']['user']['fetchPendingDGCCRF'], ApiError>
  invite: UseFetcher<SignalConsoApiSdk['secured']['user']['inviteDGCCRF'], ApiError>
  changePassword: UseFetcher<SignalConsoApiSdk['secured']['user']['changePassword'], ApiError>
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

  const dgccrfPending = useFetcher(api.secured.user.fetchPendingDGCCRF)

  const invite = useFetcher(api.secured.user.inviteDGCCRF)

  return (
    <UsersContext.Provider
      value={{
        dgccrf,
        dgccrfPending,
        invite,
        changePassword,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

export const useUsersContext = (): UsersContextProps => {
  return useContext<UsersContextProps>(UsersContext)
}
