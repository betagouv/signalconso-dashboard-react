import {UseQueryOpts} from './types'
import {useApiContext} from '../context/ApiContext'
import {useQuery} from '@tanstack/react-query'
import {Subscription} from '../client/subscription/Subscription'

const ListSubscriptionsQueryKeys = ['subscription_list']
export const useListSubscriptionsQuery = (options?: UseQueryOpts<Subscription[], string[]>) => {
  const {api} = useApiContext()
  return useQuery({queryKey: ListSubscriptionsQueryKeys, queryFn: api.secured.subscription.list, ...options})
}
