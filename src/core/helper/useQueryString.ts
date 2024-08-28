import {regexp} from './regexp'
import {useNavigate} from 'react-router-dom'
import {parse as _parse, stringify as _stringify} from 'qs'
import {useLocation} from 'react-router'

interface ParsedUrlQueryInput {
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

type ParsedQueryString<T> = {
  [K in keyof T]: T[K] extends Date ? ParsedDate : T[K] extends Date | undefined ? ParsedDate | undefined : T[K]
}
type MappedQueryString<T> = {
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
  const history = useNavigate()
  const location = useLocation()

  const update = (t: E) => {
    const newQueryString = QueryString.stringify(toQueryString(t))
    const previousQueryString = location.search.replace(/^\?/, '')
    const hasChanged = newQueryString !== previousQueryString
    hasChanged && history(`?${newQueryString}`, {replace: true})
  }

  const get = (): E => {
    // arrayLimit raised from 20 to 200 otherwise the departments list may not be parsed correctly
    return fromQueryString(QueryString.parse(location.search.replace(/^\?/, ''), {arrayLimit: 200}) as any)
  }

  return {update, get}
}

const parseArray = (_?: string | string[]): string[] | undefined => (_ ? [_].flatMap(_ => _) : undefined)

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

export const mapDatesToQueryString = <T extends object>(_: T): Readonly<ParsedQueryString<T>> => {
  return Object.entries(_).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value instanceof Date ? value.toISOString() : value,
    }),
    {} as Readonly<ParsedQueryString<T>>,
  )
}

export const mapDateFromQueryString = <T extends object>(
  _: ParsedQueryString<T>,
): Readonly<MappedQueryString<ParsedQueryString<T>>> => {
  return Object.entries(_).reduce(
    (acc, [key, value]: [string, any]) => ({
      ...acc,
      [key]: regexp.isoDate.test(value) ? new Date(value) : value,
    }),
    {} as MappedQueryString<ParsedQueryString<T>>,
  )
}
