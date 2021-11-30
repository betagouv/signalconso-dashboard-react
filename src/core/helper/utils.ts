import classNames from 'classnames'
import {fromNullable} from 'fp-ts/lib/Option'
import {OrderBy, Paginate} from '@alexandreannic/react-hooks-lib/lib'
import {config} from 'conf/config'
import {Paginate as ApiPaginate} from '@signal-conso/signalconso-api-sdk-js'
import {mapPromise, PromiseFnResult} from '@alexandreannic/ts-utils/lib/common'

export const isJsonValid = (json: string): boolean => {
  try {
    JSON.parse(json)
    return true
  } catch (e) {
    return false
  }
}

export type Index<T> = {[key: string]: T}

export const textOverflowMiddleCropping = (text: string, limit: number) => {
  return text.length > limit ? `${text.substr(0, limit / 2)}...${text.substr(text.length - limit / 2, text.length)}` : text
}

export const fromQueryString = <T = object>(qs: string): { [key in keyof T]: string | number } => {
  const decoded = decodeURI(qs.replace(/^\?/, '')).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')
  const json: Index<string> = JSON.parse(`{${decoded}}`)
  return Object.entries(json).reduce(
    (acc, [key, value]) => ({...acc, [key]: Number(value) ?? value}),
    {} as { [key in keyof T]: string | number },
  )
}

export const stopPropagation =
  <E extends {
    preventDefault: () => void
    stopPropagation: () => void
  },
    >(
    action: (event: E) => any,
  ) =>
    (event: E) => {
      event.stopPropagation()
      event.preventDefault()
      action(event)
    }

export const capitalize = (str?: string, othersInLowerCase = true): string | undefined =>
  fromNullable(str)
    .map(_ => _.charAt(0).toUpperCase() + (othersInLowerCase ? _.slice(1).toLowerCase() : _.slice(1)))
    .toUndefined()

// Because default imports are very very annoying since they break autocomplete
export const classes = classNames

interface FnSwitch {
  <T extends string | number | symbol, R = any>(value: T, cases: { [key in T]: ((_: T) => R) | R }): R
  <T extends string | number | symbol, R = any>(
    value: T,
    cases: Partial<{ [key in T]: ((_: T) => R) | R }>,
    defaultCase: (_: T) => R,
  ): R
}

export const fnSwitch: FnSwitch = (value, cases, defaultCase?) => {
  const res = cases[value]
  if (!res && !defaultCase) {
    throw new Error(
      `[fnSwtich] ${value} does not match any of theses cases ${Object.keys(cases).join(
        ', ',
      )} defaultCase parameter is not provided.`,
    )
  }
  return (typeof res === 'function' ? res(value) : res) ?? (defaultCase as any)!(value)
}

export const paginateData = <T>(limit: number, offset: number) => (data: T[]): Paginate<T> => {
  return {
    data: data.slice(offset, offset + limit),
    totalSize: data.length,
  }
}

export const sortData = <T>(sortBy: keyof T, orderBy: OrderBy) => (data: T[]): T[] => {
  return data.sort((a, b) => ('' + a[sortBy]).localeCompare('' + b[sortBy]) * (orderBy === 'desc' ? -1 : 1))
}

export const sortPaginatedData = <T>(sortBy: keyof T, orderBy: OrderBy) => (p: Paginate<T>): Paginate<T> => {
  return {
    data: sortData(sortBy, orderBy)(p.data),
    totalSize: p.totalSize,
  }
}

export const siretToSiren = (siret: string) => siret.slice(0, 9)

export const stringToBoolean = (str?: string): boolean | undefined => {
  if (str) {
    if (str === 'true') return true
    else if (str === 'false') return false
  }
}

export const mapSdkPaginate = <T>(_: ApiPaginate<T>): Paginate<T> => ({
  data: _.entities,
  totalSize: _.totalCount,
})

export const mapPromiseSdkPaginate = <F extends (...args: any[]) => Promise<ApiPaginate<any>>>(
  promise: F,
): PromiseFnResult<F> extends ApiPaginate<infer U> ? (...args: Parameters<F>) => Promise<Paginate<U>> : F =>
  mapPromise({
    promise: promise,
    mapThen: mapSdkPaginate,
  }) as any

export const openInNew = (path: string) => {
  window.open((config.useHashRouter ? '/#' : '') + path, '_blank')
}
