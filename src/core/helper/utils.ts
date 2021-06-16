import classNames from 'classnames'
import {fromNullable} from 'fp-ts/lib/Option'

export const isJsonValid = (json: string): boolean => {
  try {
    JSON.parse(json);
    return true;
  } catch (e) {
    return false
  }
};

export type Index<T> = {[key: string]: T}

export const regexpPattern = {
  email: '^[^@]+@[^\\.]+\\..+',
  yyyyMMdd: '\\d{4}-(0\\d|1[0-2])-([0-2]\\d|3[0-1])',
}

export const regexp = Object.entries(regexpPattern).reduce(
  (acc, [key, value]) => ({...acc, [key]: new RegExp(value)}),
  {} as { [key in keyof typeof regexpPattern]: RegExp }
)

export const textOverflowMiddleCropping = (text: string, limit: number) => {
  return text.length > limit ? `${text.substr(0, limit / 2)}...${text.substr(text.length - (limit / 2), text.length)}` : text
}

export const fromQueryString = <T = object>(qs: string): { [key in keyof T]: string | number } => {
  const decoded = decodeURI(qs.replace(/^\?/, ''))
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"')
  const json: Index<string> = JSON.parse(`{${decoded}}`)
  return Object.entries(json).reduce(
    (acc, [key, value]) => ({...acc, [key]: Number(value) ?? value}),
    {} as { [key in keyof T]: string | number }
  )
}

export const stopPropagation = <E extends {
  preventDefault: () => void,
  stopPropagation: () => void
}>(action: (event: E) => any) => (event: E) => {
  event.stopPropagation()
  event.preventDefault();
  action(event)
}

export const capitalize = (str?: string, othersInLowerCase = true): string | undefined => fromNullable(str)
  .map(_ => _.charAt(0).toUpperCase() + (othersInLowerCase ? _.slice(1).toLowerCase() : _.slice(1)))
  .toUndefined()

// export const fnSwitch = <T>(t: T, )
// Because default imports are very very annoying since they break autocomplete
export const classes = classNames

export const fnSwitch = <T extends string | number | symbol, R = any>(
  value: T,
  cases: Partial<{ [key in T]: (_: T) => R }>,
  defaultCase?: (_: T) => R,
): R | undefined => {
  return (cases[value] ?? defaultCase ?? (() => undefined))(value)
}
