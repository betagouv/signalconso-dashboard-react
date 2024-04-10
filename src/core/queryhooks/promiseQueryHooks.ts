import {UseQueryOpts} from './types'
import {useApiContext} from '../context/ApiContext'
import {useQuery} from '@tanstack/react-query'
import {PromiseOfAction} from '../client/promise/PromiseOfAction'

export const ListPromisesOfActionQueryKeys = ['promise_list']

export const useListPromisesOfActionQuery = (options?: UseQueryOpts<PromiseOfAction[], string[]>) => {
  const {api} = useApiContext()
  return useQuery({
    queryKey: ListPromisesOfActionQueryKeys,
    queryFn: () => api.secured.promise.list(),
    ...options,
  })
}
