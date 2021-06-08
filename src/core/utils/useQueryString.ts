import {dateToYYYYMMDD} from 'core/api'
import {Index, regexp} from '../helper/utils'
import {useHistory} from 'react-router-dom'
import * as querystring from 'querystring'

type ParsedQueryString<T> = { [K in keyof T]: T[K] extends Date ? ParsedDate : T[K] }
type MappedQueryString<T> = { [K in keyof T]: T[K] extends ParsedDate ? Date : T[K] }

type ParsableObject = Index<string | number | boolean
  | ReadonlyArray<string> | ReadonlyArray<number> | ReadonlyArray<boolean>
  | undefined | Date>;

type MappableObject = Index<string | number | boolean
  | ReadonlyArray<string> | ReadonlyArray<number> | ReadonlyArray<boolean>
  | undefined | Date>;

type ParsedDate =
`${number}${number}${number}${number}-${number}${number}-${number}${number}`

export const mapDatesToQueryString = <T extends ParsableObject>(_: T): Readonly<ParsedQueryString<T>> => {
  return Object.entries(_).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: (value instanceof Date) ? dateToYYYYMMDD(value) : value
  }), {} as Readonly<ParsedQueryString<T>>)
}

export const mapDateFromQueryString = <T extends MappableObject>(_: ParsedQueryString<T>): Readonly<MappedQueryString<ParsedQueryString<T>>> => {
  return Object.entries(_).reduce((acc, [key, value]: [string, any]) => ({
    ...acc,
    [key]: regexp.yyyyMMdd.test(value) ? new Date(value) : value
  }), {} as MappedQueryString<ParsedQueryString<T>>)
}

interface UseQueryString {
  <T, R extends ParsableObject>(
    f1: (_: T) => R,
    f2: (_: R) => T,
  ): {update: (_: T) => void, get: () => T}
  <T extends Readonly<ParsableObject>>(): {update: (_: T) => void, get: () => T}
}

export const useQueryString: UseQueryString = <T>(
  f1: (_: T) => ParsableObject = _ => _ as unknown as ParsableObject,
  f2: (_: ParsableObject) => T = _ => _ as unknown as T,
) => {
// export const useQueryString = <T, R extends ParsableObject = any>(
//   f1: (_: T) => R = _ => _ as unknown as R,
//   f2: (_: R) => T = _ => _ as unknown as T,
// ): {update: (_: T) => void, get: () => T} => {
  const history = useHistory()

  const update = (t: T) => {
    const z = f1(t)
    const x = mapDatesToQueryString(z)
    history.push({search: querystring.stringify(x as any)})
  }

  const get = (): T => {
    const t1 = querystring.parse(history.location.search.replace(/^\?/, ''))
    const t2 = mapDateFromQueryString(t1)
    return f2(t2 as any)
  }

  return {update, get}
}
