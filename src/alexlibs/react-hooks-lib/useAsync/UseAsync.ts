import { useState } from 'react'
import { Func } from '../useFetcher/UseFetcher'

type UseAsync<F extends Func<Promise<any>>, E = any> = {
  loading: boolean
  error?: E
  call: F
}

// Factorize async by exposing loading indicator and error status.
// Could probably be replaced by a simple useQuery ?
export const useAsync = <F extends Func<Promise<any>>, E = any>(
  caller: F,
): UseAsync<F, E> => {
  const [error, setError] = useState<E | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  const call = (...args: any[]) => {
    setLoading(true)
    return caller(...args)
      .then((_) => {
        setLoading(false)
        return _
      })
      .catch((e: E) => {
        setLoading(false)
        setError(e)
        throw e
      })
  }

  return {
    loading,
    error,
    // @ts-ignore
    call,
  }
}
