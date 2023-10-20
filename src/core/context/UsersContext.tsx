import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher, UsePaginate} from '../../alexlibs/react-hooks-lib'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {useScPaginate} from '../../shared/usePaginate'
import {ApiError} from '../client/ApiClient'
import {RoleAdminOrAgent, roleAgents, User, UserSearch} from '../client/user/User'

export interface UsersContextProps {
  searchAdmin: UsePaginate<User, UserSearch>
  searchAgent: UsePaginate<User, UserSearch>
  agentPending: UseFetcher<SignalConsoApiSdk['secured']['user']['fetchPendingAgent'], ApiError>
  inviteDgccrf: UseFetcher<SignalConsoApiSdk['secured']['user']['inviteDGCCRF'], ApiError>
  inviteDgal: UseFetcher<SignalConsoApiSdk['secured']['user']['inviteDGAL'], ApiError>
  inviteAdmin: UseFetcher<SignalConsoApiSdk['secured']['user']['inviteAdmin'], ApiError>
  changePassword: UseFetcher<SignalConsoApiSdk['secured']['user']['changePassword'], ApiError>
  activate: UseFetcher<SignalConsoApiSdk['public']['user']['activateAccount'], ApiError>
  fetchTokenInfo: UseFetcher<SignalConsoApiSdk['public']['user']['fetchTokenInfo'], ApiError>
  getConnectedUser: UseFetcher<SignalConsoApiSdk['secured']['user']['fetchConnectedUser']>
  forceValidateEmail: UseFetcher<SignalConsoApiSdk['secured']['user']['forceValidateEmail']>
  softDelete: UseFetcher<SignalConsoApiSdk['secured']['user']['softDelete']>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<UsersContextProps> = {}

const UsersContext = React.createContext<UsersContextProps>(defaultContext as UsersContextProps)

export const UsersProvider = ({api, children}: Props) => {
  const searchAdmin = useScPaginate<User, UserSearch, ApiError>(api.secured.user.searchAdminOrAgent, {
    limit: 50,
    offset: 0,
    role: ['Admin'],
  })
  const searchAgent = useScPaginate<User, UserSearch, ApiError>(api.secured.user.searchAdminOrAgent, {
    limit: 10,
    offset: 0,
    role: roleAgents.map(_ => _ as RoleAdminOrAgent),
  })
  const changePassword = useFetcher(api.secured.user.changePassword)
  const forceValidateEmail = useFetcher(api.secured.user.forceValidateEmail)
  const activate = useFetcher(api.public.user.activateAccount)
  const agentPending = useFetcher(api.secured.user.fetchPendingAgent)
  const inviteDgccrf = useFetcher(api.secured.user.inviteDGCCRF)
  const inviteDgal = useFetcher(api.secured.user.inviteDGAL)
  const inviteAdmin = useFetcher(api.secured.user.inviteAdmin)
  const fetchTokenInfo = useFetcher(api.public.user.fetchTokenInfo)
  const getConnectedUser = useFetcher(api.secured.user.fetchConnectedUser)
  const softDelete = useFetcher(api.secured.user.softDelete)
  return (
    <UsersContext.Provider
      value={{
        searchAdmin,
        searchAgent,
        agentPending,
        inviteDgccrf,
        inviteDgal,
        inviteAdmin,
        changePassword,
        activate,
        fetchTokenInfo,
        getConnectedUser,
        forceValidateEmail,
        softDelete,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

export const useUsersContext = (): UsersContextProps => {
  return useContext<UsersContextProps>(UsersContext)
}
