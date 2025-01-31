import { useQuery } from '@tanstack/react-query'
import { AuthAttemptsSearch } from '../client/auth-attempts/AuthAttemptClient'
import {
  RoleAgents,
  roleAgents,
  UserPending,
  UserSearch,
} from '../client/user/User'
import { useApiContext } from '../context/ApiContext'
import { UseQueryOpts } from './UseQueryOpts'
import { useQueryPaginate } from './UseQueryPaginate'
import { VisibleUser } from '../client/company-access/VisibleUser'

export const FetchVisibleUsersToProKeys = ['user_fetchVisibleUsersToPro']
export const SearchAdminQueryKeys = ['user_searchAdmin']
export const SearchAgentQueryKeys = ['user_searchAgent']
const SearchAuthAttemptsQueryKeys = ['authAttemptClient_fetch']
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
  const defaultFilters: UserSearch = {
    limit: 50,
    offset: 0,
  }
  return useQueryPaginate(
    SearchAdminQueryKeys,
    api.secured.user.searchAdmin,
    defaultFilters,
    undefined,
    enabled,
  )
}

export const useSearchAgentQuery = (enabled: boolean) => {
  const { api } = useApiContext()
  const defaultFilters: UserSearch = {
    limit: 25,
    offset: 0,
    role: roleAgents.map((_) => _),
  }
  return useQueryPaginate(
    SearchAgentQueryKeys,
    api.secured.user.searchAgent,
    defaultFilters,
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

export const useFetchVisibleUsersToProQuery = (
  options?: UseQueryOpts<VisibleUser[], string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: FetchVisibleUsersToProKeys,
    queryFn: () => api.secured.companyAccess.visibleUsersToPro(),
    ...options,
  })
}
