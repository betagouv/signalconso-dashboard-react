import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher, usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {ApiError, PaginatedFilters, User} from 'core/api'
import {SignalConsoApiSdk} from '../../App'

export interface UsersContextProps {
  dgccrf: UsePaginate<User, PaginatedFilters>
  dgccrfPending: UseFetcher<SignalConsoApiSdk['secured']['user']['fetchPendingDGCCRF'], ApiError>
  invite: UseFetcher<SignalConsoApiSdk['secured']['user']['inviteDGCCRF'], ApiError>

}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<UsersContextProps> = {}

const UsersContext = React.createContext<UsersContextProps>(defaultContext as UsersContextProps)

export const UsersProvider = ({api, children}: Props) => {

  const dgccrf = usePaginate<User, PaginatedFilters>(
    api.secured.user.fetchDGCCRF,
    {limit: 10, offset: 0}
  )

  const dgccrfPending = useFetcher(api.secured.user.fetchPendingDGCCRF)

  const invite = useFetcher(api.secured.user.inviteDGCCRF)

  return (
    <UsersContext.Provider value={{
      dgccrf,
      dgccrfPending,
      invite,
    }}>
      {children}
    </UsersContext.Provider>
  )
}

export const useUsersContext = (): UsersContextProps => {
  return useContext<UsersContextProps>(UsersContext)
}
