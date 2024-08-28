import { useQuery } from '@tanstack/react-query'
import { useApiContext } from '../context/ApiContext'
import { UseQueryOpts } from './types'
import { ConsumerBlacklistedEmail } from '../client/consumer-blacklist/ConsumerBlacklistedEmail'

export const ListConsumerBlacklistQueryKeys = ['consumerBlacklist_list']

export const useListConsumerBlacklistQuery = (
  options?: UseQueryOpts<ConsumerBlacklistedEmail[], string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: ListConsumerBlacklistQueryKeys,
    queryFn: api.secured.consumerBlacklist.list,
    ...options,
  })
}
