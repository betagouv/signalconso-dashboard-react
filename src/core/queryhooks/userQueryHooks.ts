import {useApiContext} from '../context/ApiContext'
import {useQueryPaginate} from './UseQueryPaginate'
import {RoleAdminOrAgent, RoleAgents, roleAgents, User, UserPending} from '../client/user/User'
import {UseQueryOpts} from './types'
import {useQuery} from '@tanstack/react-query'
import {TokenInfo} from '../client/authenticate/Authenticate'
import {Paginate} from '../model'

export const SearchAdminQueryKeys = ['user_searchAdmin']
export const SearchAgentQueryKeys = ['user_searchAgent']
export const SearchAuthAttemptsQueryKeys = ['authAttemptClient_fetch']
export const GetConnectedUserQueryKeys = ['user_fetchConnectedUser']
export const FetchTokenInfoQueryKeys = ['user_fetchTokenInfo']
export const GetAgentPendingQueryKeys = ['user_fetchPendingAgent']

export const useSearchAdminQuery = (options?: UseQueryOpts<Paginate<User>, string[]>) => {
  const {api} = useApiContext()
  return useQueryPaginate(
    SearchAdminQueryKeys,
    api.secured.user.searchAdminOrAgent,
    {
      limit: 50,
      offset: 0,
      role: ['Admin'],
    },
    options,
  )
}

export const useSearchAgentQuery = (options?: UseQueryOpts<Paginate<User>, string[]>) => {
  const {api} = useApiContext()
  return useQueryPaginate(
    SearchAgentQueryKeys,
    api.secured.user.searchAdminOrAgent,
    {
      limit: 10,
      offset: 0,
      role: roleAgents.map(_ => _ as RoleAdminOrAgent),
    },
    options,
  )
}

export const useSearchAuthAttemptsQuery = () => {
  const {api} = useApiContext()
  const defaultFilters: {limit: number; offset: number; login?: string} = {
    limit: 25,
    offset: 0,
  }
  return useQueryPaginate(SearchAuthAttemptsQueryKeys, api.secured.authAttemptClient.fetch, defaultFilters)
}

export const useGetConnectedUserQuery = (options?: UseQueryOpts<User, string[]>) => {
  const {api} = useApiContext()
  return useQuery({queryKey: GetConnectedUserQueryKeys, queryFn: api.secured.user.fetchConnectedUser, ...options})
}

export const useFetchTokenInfoQuery = (token: string, companySiret?: string, options?: UseQueryOpts<TokenInfo, string[]>) => {
  const {api} = useApiContext()
  return useQuery({
    queryKey: FetchTokenInfoQueryKeys,
    queryFn: () => api.public.user.fetchTokenInfo(token, companySiret),
    ...options,
  })
}

export const useGetAgentPendingQuery = (role?: RoleAgents, options?: UseQueryOpts<UserPending[], string[]>) => {
  const {api} = useApiContext()
  return useQuery({queryKey: GetAgentPendingQueryKeys, queryFn: () => api.secured.user.fetchPendingAgent(role), ...options})
}
