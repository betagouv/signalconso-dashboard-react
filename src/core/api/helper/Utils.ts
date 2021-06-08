export type Index<T> = {[key: string]: T}

export const dateToYYYYMMDD = (date?: Date): string | undefined => date ? date.toISOString().split('T')[0] : undefined

export const dateToApi = dateToYYYYMMDD

export const getHostFromUrl = (url?: string) => {
  return url
    ?.replace('http://', '')
    .replace('https://', '')
    .replace('www.', '')
    .split(/[/?#]/)[0]
}

export const cleanObject = <T extends object>(obj: T): Partial<T> => {
  return Object.entries(obj)
    .filter(([, _]) =>
      _ !== undefined &&
      _ !== null &&
      _ !== '' &&
      (!Array.isArray(_) || !!_.filter(v => v !== undefined).length)
    )
    .reduce((acc, [key, value]) => ({...acc, [key]: value}), {})
}

export const toQueryString = (obj: any): string => {
  if (!obj) return ''
  return '?' + Object.keys(obj)
    .filter(k => obj[k] !== undefined)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
    .join('&')
}
