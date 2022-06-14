import {dateToYYYYMMDD} from '@signal-conso/signalconso-api-sdk-js'
import {regexp} from './regexp'
import {useHistory} from 'react-router-dom'
import {parse as _parse, stringify as _stringify} from 'qs'

export interface ParsedUrlQueryInput {
  [key: string]:
    | string
    | number
    | boolean
    | ReadonlyArray<string>
    | ReadonlyArray<number>
    | ReadonlyArray<boolean>
    | undefined
    | null
}

export class QueryString {
  static readonly parse = _parse
  static readonly stringify = _stringify
}

type QueryStringOf<T> = {
  [K in keyof T]: T[K] extends Date ? ParsedDate : T[K] extends Date | undefined ? ParsedDate | undefined : T[K]
}
type ParsedQueryStringOf<T> = {
  [K in keyof T]: T[K] extends ParsedDate ? Date : T[K] extends ParsedDate | undefined ? Date | undefined : T[K]
}

type ParsedDate = `${number}${number}${number}${number}-${number}${number}-${number}${number}`

export const useQueryString = <E, QS extends ParsedUrlQueryInput>({
  toQueryString,
  fromQueryString,
}: {
  toQueryString: (_: E) => QS
  fromQueryString: (_: QS) => E
}) => {
  const history = useHistory()

  const update = (t: E) => {
    history.replace({search: QueryString.stringify(toQueryString(t), {arrayFormat: 'comma', encodeValuesOnly: true})})
  }

  const get = (): E => {
    return fromQueryString(QueryString.parse(history.location.search.replace(/^\?/, '')) as any)
  }

  return {update, get}
}

const parseArray = (_?: string): string[] | undefined => {
  return (_ ? _.split(',') : undefined)
}

export const mapArrayFromQuerystring =
  <QS extends {[key: string]: any}>(arrayProperties: (keyof QS)[]) =>
  (obj: QS): {[key in keyof QS]: any} => {
    arrayProperties.forEach(property => {
      obj[property] = parseArray(obj[property] as any) as any
    })
    return obj as any
  }

export const mapBooleanFromQueryString =
  <QS extends {[key: string]: any}>(properties: (keyof QS)[]) =>
  (obj: QS): {[key in keyof QS]: any} => {
    properties.forEach(property => {
      obj[property] = {true: true, false: false}[obj[property] as unknown as string] as any
    })
    return obj as any
  }

export const mapDatesToQueryString = <T extends object>(_: T): Readonly<QueryStringOf<T>> => {
  return Object.entries(_).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value instanceof Date ? dateToYYYYMMDD(value) : value,
    }),
    {} as Readonly<QueryStringOf<T>>,
  )
}

export const mapDateFromQueryString = <T extends object>(
  _: QueryStringOf<T>,
): Readonly<ParsedQueryStringOf<QueryStringOf<T>>> => {
  return Object.entries(_).reduce(
    (acc, [key, value]: [string, any]) => ({
      ...acc,
      [key]: regexp.yyyyMMdd.test(value) ? new Date(value) : value,
    }),
    {} as ParsedQueryStringOf<QueryStringOf<T>>,
  )
}
