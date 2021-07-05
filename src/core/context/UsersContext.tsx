import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetchableReturn, useFetcher, usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {PaginatedFilters, User, UserPending} from 'core/api'
import {SignalConsoApiSdk} from '../../App'

export interface UsersContextProps {
  dgccrf: UsePaginate<User, PaginatedFilters>
  dgccrfPending: UseFetchableReturn<UserPending[]>
  invite: UseFetchableReturn<void>

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

  const dgccrfPending = useFetcher<UserPending[]>(api.secured.user.fetchPendingDGCCRF)

  const invite = useFetcher<void>(api.secured.user.inviteDGCCRF)

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
