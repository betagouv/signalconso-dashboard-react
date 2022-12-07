import {ApiError} from 'core/client/ApiClient'
import {Dispatch, SetStateAction, useRef, useState} from 'react'

// a function with any arguments, returning R
export type Func<R = any> = (...args: any[]) => R

export interface FetchParams {
  force?: boolean
  clean?: boolean
}

// If the type T is a promise, returns the type of the promise content
// Otherwise returns the type T itself
type ThenContentOf<T> = T extends Promise<infer U> ? U : T

// Given of type of function F, returns the return type of this promise
// But if the return type is a promise, returns the type of the promise content
type ThenReturnTypeOf<F extends Func> = ThenContentOf<ReturnType<F>>

// Given a function of type F
// This type Fetch<F> describes a function wrapping the original function
// with just one extra parameter at the start :
// a "settings" object with the {force, clean} settings.
export type Fetch<F extends Func<Promise<ThenReturnTypeOf<F>>>> = (
  p?: {force?: boolean; clean?: boolean},
  ..._: Parameters<F>
) => ReturnType<F>

// F est le type de la fonction qui fetch (sa définition est récursive, je pense que c'est simplifiable)
// E est le type d'erreur, c'est tout le temps ApiError donc il devrait être supprimé
export type UseFetcher<F extends Func<Promise<ThenReturnTypeOf<F>>>, E = ApiError> = {
  entity?: ThenReturnTypeOf<F>
  loading: boolean
  error?: E
  fetch: Fetch<F>
  setEntity: Dispatch<SetStateAction<ThenReturnTypeOf<F> | undefined>>
  clearCache: () => void
}

/**
 * Factorize fetching logic which goal is to prevent unneeded fetchs and expose loading indicator + error status.
 */
export const useFetcher = <F extends Func<Promise<any>>, E = any>(
  fetcher: F,
  initialValue?: ThenReturnTypeOf<F>,
  mapError: (_: any) => E = _ => _,
): UseFetcher<F, E> => {
  const [entity, setEntity] = useState<ThenReturnTypeOf<F> | undefined>(initialValue)
  const [error, setError] = useState<E | undefined>()
  const [loading, setLoading] = useState<boolean>(false)
  const fetch$ = useRef<Promise<ThenReturnTypeOf<F>>>()

  const fetch = ({force = true, clean = true}: FetchParams = {}, ...args: any[]): Promise<ThenReturnTypeOf<F>> => {
    if (!force) {
      if (fetch$.current) {
        return fetch$.current!
      }
      if (entity) {
        return Promise.resolve(entity)
      }
    }
    if (clean) {
      setError(undefined)
      setEntity(undefined)
    }
    setLoading(true)
    fetch$.current = fetcher(...args)
    fetch$.current
      .then((x: ThenReturnTypeOf<F>) => {
        setLoading(false)
        setEntity(x)
        fetch$.current = undefined
      })
      .catch(e => {
        setLoading(false)
        fetch$.current = undefined
        setError(mapError(e))
        setEntity(undefined)
        // return Promise.reject(e)
        throw e
      })
    return fetch$.current
  }

  const clearCache = () => {
    setEntity(undefined)
    setError(undefined)
    fetch$.current = undefined
  }

  return {
    entity,
    loading,
    error,
    // TODO(Alex) not sure the error is legitimate
    fetch: fetch as any,
    setEntity,
    clearCache,
  }
}
