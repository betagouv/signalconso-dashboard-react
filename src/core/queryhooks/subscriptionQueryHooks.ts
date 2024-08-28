import { useQuery } from '@tanstack/react-query'
import { useApiContext } from '../context/ApiContext'

export const ListSubscriptionsQueryKeys = ['subscription_list']
export const useListSubscriptionsQuery = () => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: ListSubscriptionsQueryKeys,
    queryFn: api.secured.subscription.list,
  })
}
