import {ISearch, Paginate, UsePaginate} from '../../alexlibs/react-hooks-lib'
import {usePaginate} from '../../alexlibs/react-hooks-lib'
import {Paginate as ApiPaginate} from '@signal-conso/signalconso-api-sdk-js'
import {mapPromise, PromiseFnResult} from '../../alexlibs/ts-utils'

const mapSdkPaginate = <T>(_: ApiPaginate<T>): Paginate<T> => ({
  data: _.entities,
  totalSize: _.totalCount,
})

const mapPromiseSdkPaginate = <F extends (...args: any[]) => Promise<ApiPaginate<any>>>(
  promise: F,
): PromiseFnResult<F> extends ApiPaginate<infer U> ? (...args: Parameters<F>) => Promise<Paginate<U>> : F =>
  mapPromise({
    promise: promise,
    mapThen: mapSdkPaginate,
  }) as any

export const useScPaginate = <T, S extends ISearch<any>, E = any>(
  fetcher: (search: S) => Promise<ApiPaginate<T>>,
  initialFilters: S,
  mapError?: (_: any) => E,
): UsePaginate<T, S, E> => {
  return usePaginate(mapPromiseSdkPaginate(fetcher), initialFilters, mapError)
}
