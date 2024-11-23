import { ApiError } from 'core/client/ApiClient'
import format from 'date-fns/format'
import { ScOption } from './ScOption'

export type Index<T> = { [key: string]: T }

export const dateToApiDate = (date?: Date): string | undefined =>
  date ? format(date, 'yyyy-MM-dd') : undefined

export const dateToApiTime = (date?: Date): string | undefined =>
  date ? date.toISOString() : undefined

const isNotDefined = (value: any): value is undefined | null | '' => {
  return [undefined, null, ''].includes(value)
}

export const isDefined = <T>(value: T | undefined | null | ''): value is T =>
  !isNotDefined(value)

export const emptyStringToUndefined = (value: string): string | undefined =>
  value.length === 0 ? undefined : value

export const toNumberOrDefault = (value: any, defaultValue: number): number =>
  isNaN(value) || value === '' || value == null ? defaultValue : value

// remove undefined values and empty arrays
export const cleanObject = <T extends { [key: string]: any }>(
  obj: T,
): Partial<T> => {
  const clone = { ...obj }
  for (let k in clone) {
    const val = clone[k]
    if (
      isNotDefined(val) ||
      (Array.isArray(val) && val.filter(isDefined).length === 0)
    ) {
      delete clone[k]
    }
  }
  return clone
}

export const roundValue = (_: number): number => Math.round(_)

export const toQueryString = (obj: any): string => {
  if (!obj) return ''
  return (
    '?' +
    Object.keys(obj)
      .filter((k) => obj[k] !== undefined)
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
      .join('&')
  )
}

export const directDownloadBlob =
  (fileName: string, mimeType: string) =>
  (blob: Blob): void => {
    const url = window.URL.createObjectURL(new Blob([blob], { type: mimeType }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
  }

export const textOverflowMiddleCropping = (text: string, limit: number) => {
  return text.length > limit
    ? `${text.slice(0, limit / 2)}...${text.slice(
        text.length - limit / 2,
        text.length,
      )}`
    : text
}

export const stopPropagation =
  <
    E extends {
      preventDefault?: () => void
      stopPropagation?: () => void
    },
  >(
    action: (event: E) => any,
  ) =>
  (event: E) => {
    event.stopPropagation?.()
    event.preventDefault?.()
    action(event)
  }

export const capitalize = (
  str?: string,
  othersInLowerCase = true,
): string | undefined =>
  ScOption.from(str)
    .map(
      (_) =>
        _.charAt(0).toUpperCase() +
        (othersInLowerCase ? _.slice(1).toLowerCase() : _.slice(1)),
    )
    .getOrElse(undefined)

interface FnSwitch {
  <T extends string | number | symbol, R = any>(
    value: T,
    cases: { [key in T]: ((_: T) => R) | R },
  ): R
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
      `[fnSwitch] ${String(
        value,
      )} does not match any of theses cases ${Object.keys(cases).join(
        ', ',
      )} defaultCase parameter is not provided.`,
    )
  }
  return (
    (typeof res === 'function' ? res(value) : res) ??
    (defaultCase as any)!(value)
  )
}

export const siretToSiren = (siret: string) => siret.slice(0, 9)

const stringToBoolean = (str?: string): boolean | undefined => {
  if (str) {
    if (str === 'true') return true
    else if (str === 'false') return false
  }
}

export const openInNew = (path: string) => {
  window.open(path, '_blank')
}

export const countryToFlag = (isoCode: string) => {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(char.charCodeAt(0) + 127397),
        )
    : isoCode
}

export const null2Undefined = <A>(value: A | null): A | undefined =>
  value === null ? undefined : value

export const undefined2Null = <A>(value: A | undefined): A | null =>
  value === undefined ? null : value

export function sum(arr: number[]): number {
  return arr.reduce((acc, current) => acc + current, 0)
}

export async function wrap404AsNull<A>(
  callback: () => Promise<A>,
): Promise<A | null> {
  try {
    return await callback()
  } catch (e) {
    if (e instanceof ApiError && e.details.code === 404) {
      return null
    } else throw e
  }
}

// mapFor(n, callback)
// is equivalent to
// [...new Array(n)].map((_, i) => callback(i))
export const mapFor = <T>(n: number, callback: (i: number) => T): T[] => {
  const result: T[] = new Array(n)
  for (let i = 0; i < n; i++) {
    result[i] = callback(i)
  }
  return result
}

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

// see https://stackoverflow.com/questions/60141960/typescript-key-value-relation-preserving-object-entries-type
export function objectEntriesUnsafe<T extends object>(obj: T) {
  return Object.entries(obj) as Entries<T>
}
export function objectKeysUnsafe<T extends object>(obj: T) {
  return objectEntriesUnsafe(obj).map(([k]) => k)
}

export function map<A, B>(item: A | undefined, fn: (a: A) => B) {
  if (item === undefined) return undefined
  return fn(item)
}

export const noop = (...args: unknown[]) => {}

export function timeoutPromise(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}
