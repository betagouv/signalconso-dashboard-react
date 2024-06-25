import {MutationCache, QueryCache, QueryClient} from '@tanstack/react-query'
import {ApiError} from 'core/client/ApiClient'

function initialErrorHandler(e: Error) {
  console.error('Error caught by initial error handler of queryClient, this should not happen', e)
}

function buildQueryClient() {
  const MAX_RETRIES = 3
  const HTTP_STATUS_TO_NOT_RETRY: (string | number)[] = [400, 401, 403, 404]
  let errorHandler = initialErrorHandler
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5000,
        retry: (failureCount, error) => {
          if (failureCount > MAX_RETRIES) {
            return false
          }
          return !(error instanceof ApiError && error.details.code && HTTP_STATUS_TO_NOT_RETRY.includes(error.details.code))
        },
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        errorHandler(error)
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (mutation.options.onError) return
        errorHandler(error)
      },
    }),
  })
  return {
    queryClient,
    setQueryClientErrorHandler: (handler: (e: Error) => void) => {
      errorHandler = handler
    },
  }
}

export const {queryClient, setQueryClientErrorHandler} = buildQueryClient()
