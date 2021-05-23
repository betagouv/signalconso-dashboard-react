import {dateToYYYYMMDD} from '@signalconso/signalconso-api-sdk-js/build'
import {regexp} from '../helper/utils'

type ParsedQueryString<T> = { [K in keyof T]: T[K] extends Date | undefined ? string : T[K] }

// type ParsedDate = `${number}${number}${number}${number}-${number}${number}-${number}${number}`

export const objectToParsableQueryString = <T extends object>(_: T): ParsedQueryString<T> => {
  return Object.entries(_).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: (value instanceof Date) ? dateToYYYYMMDD(value) : value
  }), {} as ParsedQueryString<T>)
}

export const fromParsableQueryString = <T extends object>(_: ParsedQueryString<T>): T => {
  return Object.entries(_).reduce((acc, [key, value]: [string, any]) => ({
    ...acc,
    [key]: regexp.yyyyMMdd.test(value) ? new Date(value) : value
  }), {} as T)
}


export const useQueryString = () => {

}
