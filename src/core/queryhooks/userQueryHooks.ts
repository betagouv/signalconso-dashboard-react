import { useApiContext } from '../context/ApiContext'
import { useQueryPaginate } from './UseQueryPaginate'
import {
  RoleAdminOrAgent,
  RoleAgents,
  roleAgents,
  User,
  UserPending,
} from '../client/user/User'
import { UseQueryOpts } from './types'
import { useQuery } from '@tanstack/react-query'
import { TokenInfo } from '../client/authenticate/Authenticate'
import { AuthAttemptsSearch } from '../client/auth-attempts/AuthAttemptClient'

export const SearchAdminQueryKeys = ['user_searchAdmin']
export const SearchAgentQueryKeys = ['user_searchAgent']
const SearchAuthAttemptsQueryKeys = ['authAttemptClient_fetch']
const GetConnectedUserQueryKeys = ['user_fetchConnectedUser']
export const FetchTokenInfoQueryKeys = (
  token: string,
  companySiret?: string,
) =>
  companySiret
    ? ['user_fetchTokenInfo', token, companySiret]
    : ['user_fetchTokenInfo', token]
const GetAgentPendingQueryKeys = (role?: RoleAgents) =>
  role ? ['user_fetchPendingAgent', role] : ['user_fetchPendingAgent']

export const useSearchAdminQuery = (enabled: boolean) => {
  const { api } = useApiContext()
  return useQueryPaginate(
    SearchAdminQueryKeys,
    api.secured.user.searchAdmin,
    {
      limit: 50,
      offset: 0,
    },
    undefined,
    enabled,
  )
}

export const useSearchAgentQuery = (enabled: boolean) => {
  const { api } = useApiContext()
  return useQueryPaginate(
    SearchAgentQueryKeys,
    api.secured.user.searchAgent,
    {
      limit: 25,
      offset: 0,
      role: roleAgents.map((_) => _),
    },
    undefined,
    enabled,
  )
}

export const useSearchAuthAttemptsQuery = (filters: AuthAttemptsSearch) => {
  const { api } = useApiContext()
  const defaultFilters: { limit: number; offset: number; login?: string } = {
    limit: 25,
    offset: 0,
  }
  return useQueryPaginate(
    SearchAuthAttemptsQueryKeys,
    api.secured.authAttemptClient.fetch,
    defaultFilters,
    filters,
  )
}

const useGetConnectedUserQuery = (options?: UseQueryOpts<User, string[]>) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: GetConnectedUserQueryKeys,
    queryFn: api.secured.user.fetchConnectedUser,
    ...options,
  })
}

const useFetchTokenInfoQuery = (
  token: string,
  companySiret?: string,
  options?: UseQueryOpts<TokenInfo, string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: FetchTokenInfoQueryKeys(token, companySiret),
    queryFn: () => api.public.user.fetchTokenInfo(token, companySiret),
    ...options,
  })
}

export const useGetAgentPendingQuery = (
  role?: RoleAgents,
  options?: UseQueryOpts<UserPending[], string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: GetAgentPendingQueryKeys(role),
    queryFn: () => api.secured.user.fetchPendingAgent(role),
    ...options,
  })
}
