import { UseQueryOpts } from './types'
import { useApiContext } from '../context/ApiContext'
import { useQuery } from '@tanstack/react-query'
import { Engagement } from '../client/engagement/Engagement'

export const ListEngagementsQueryKeys = ['engagement_list']

export const useListEngagementsQuery = (
  options?: UseQueryOpts<Engagement[], string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: ListEngagementsQueryKeys,
    queryFn: () => api.secured.engagement.list(),
    ...options,
  })
}
