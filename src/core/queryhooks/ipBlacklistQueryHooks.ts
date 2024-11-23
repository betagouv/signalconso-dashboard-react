import { useQuery } from '@tanstack/react-query'
import { BlacklistedIp } from '../client/ip-blacklist/BlacklistedIp'
import { useApiContext } from '../context/ApiContext'
import { UseQueryOpts } from './UseQueryOpts'

export const ListIpBlacklistQueryKeys = ['ipBlacklist_list']

export const useListIpBlacklistQuery = (
  options?: UseQueryOpts<BlacklistedIp[], string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: ListIpBlacklistQueryKeys,
    queryFn: api.secured.ipBlacklist.list,
    ...options,
  })
}
